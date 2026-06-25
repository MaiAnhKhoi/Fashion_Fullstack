import prisma from "@/config/prisma.config";
import { Prisma } from "@/generated/prisma/client";
import AppError from "@/utils/app-error";
import { MAX_QUANTITY, MergeCartInput } from "./cart.validation";
import {
  CartItemResponse,
  CartResponse,
  CartCountResponse,
  MergeCartResponse,
  MergeReport,
} from "./cart.response";

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : parseFloat(String(value));
};

// Select dùng chung để dựng CartItemResponse.
const CART_ITEM_SELECT = {
  id: true,
  quantity: true,
  product_id: true,
  variant_id: true,
  products: {
    select: {
      slug: true,
      title: true,
      product_images: {
        select: { url: true },
        where: { is_main: true },
        take: 1,
      },
    },
  },
  product_variants: {
    select: {
      sku: true,
      price: true,
      stock: true,
      reserved_stock: true,
      sizes: { select: { name: true } },
      colors: { select: { name: true, label: true } },
      product_variant_images: {
        select: { url: true },
        where: { is_main: true },
        take: 1,
      },
    },
  },
} as const;

type CartRow = {
  id: number;
  quantity: number;
  product_id: number;
  variant_id: number;
  products: {
    slug: string;
    title: string;
    product_images: { url: string }[];
  };
  product_variants: {
    sku: string;
    price: unknown;
    stock: number;
    reserved_stock: number;
    sizes: { name: string } | null;
    colors: { name: string; label: string | null } | null;
    product_variant_images: { url: string }[];
  };
};

const transformItem = (row: CartRow): CartItemResponse => {
  const v = row.product_variants;
  const availableStock = Math.max(0, v.stock - v.reserved_stock);
  const unitPrice = toNumber(v.price);
  const image =
    v.product_variant_images[0]?.url ?? row.products.product_images[0]?.url ?? "";

  return {
    id: row.id,
    productId: row.product_id,
    variantId: row.variant_id,
    slug: row.products.slug,
    title: row.products.title,
    image,
    sku: v.sku,
    size: v.sizes?.name ?? null,
    color: v.colors?.label ?? v.colors?.name ?? null,
    unitPrice,
    quantity: row.quantity,
    lineTotal: unitPrice * row.quantity,
    availableStock,
    inStock: availableStock > 0,
    exceedsStock: row.quantity > availableStock,
  };
};

const buildCartResponse = (rows: CartRow[]): CartResponse => {
  const items = rows.map(transformItem);

  const summary = {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items
      .filter((i) => i.inStock)
      .reduce((sum, i) => sum + i.lineTotal, 0),
  };

  const hasIssues = items.some((i) => !i.inStock || i.exceedsStock);

  return { items, summary, hasIssues };
};

/** Lấy toàn bộ giỏ hàng của user (read-only, không tự điều chỉnh số lượng). */
const handleGetCart = async (userId: number): Promise<CartResponse> => {
  const rows = await prisma.carts.findMany({
    where: { user_id: userId },
    select: CART_ITEM_SELECT,
    orderBy: { created_at: "asc" },
  });
  return buildCartResponse(rows as CartRow[]);
};

/**
 * Đọc variant kèm trạng thái sản phẩm và tồn kho khả dụng.
 * Ném lỗi nếu không hợp lệ để dùng được khả dụng.
 */
const loadAvailableVariant = async (
  tx: Prisma.TransactionClient,
  variantId: number,
) => {
  const variant = await tx.product_variants.findUnique({
    where: { id: variantId },
    select: {
      product_id: true,
      stock: true,
      reserved_stock: true,
      products: { select: { status: true } },
    },
  });

  if (!variant) {
    throw new AppError("Biến thể sản phẩm không tồn tại", 404);
  }
  if (variant.products.status !== "active") {
    throw new AppError("Sản phẩm hiện không khả dụng", 409);
  }

  const available = Math.max(0, variant.stock - variant.reserved_stock);
  if (available <= 0) {
    throw new AppError("Sản phẩm đã hết hàng", 409);
  }

  return { productId: variant.product_id, available };
};

/** Thêm vào giỏ — cộng dồn với số lượng hiện có, cap theo tồn kho & MAX. */
const handleAddItem = async (
  userId: number,
  variantId: number,
  quantity: number,
): Promise<CartResponse> => {
  await prisma.$transaction(async (tx) => {
    const { productId, available } = await loadAvailableVariant(tx, variantId);

    const existing = await tx.carts.findUnique({
      where: { user_id_variant_id: { user_id: userId, variant_id: variantId } },
      select: { quantity: true },
    });

    const currentQty = existing?.quantity ?? 0;
    const desired = currentQty + quantity;
    const finalQty = Math.min(desired, available, MAX_QUANTITY);

    await tx.carts.upsert({
      where: { user_id_variant_id: { user_id: userId, variant_id: variantId } },
      create: {
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        quantity: Math.min(quantity, available, MAX_QUANTITY),
      },
      update: { quantity: finalQty },
    });
  });

  return handleGetCart(userId);
};

/** Đặt số lượng tuyệt đối cho một dòng — cap theo tồn kho & MAX. */
const handleUpdateItem = async (
  userId: number,
  variantId: number,
  quantity: number,
): Promise<CartResponse> => {
  await prisma.$transaction(async (tx) => {
    const existing = await tx.carts.findUnique({
      where: { user_id_variant_id: { user_id: userId, variant_id: variantId } },
      select: { id: true },
    });
    if (!existing) {
      throw new AppError("Sản phẩm không có trong giỏ hàng", 404);
    }

    const { available } = await loadAvailableVariant(tx, variantId);
    const finalQty = Math.min(quantity, available, MAX_QUANTITY);

    await tx.carts.update({
      where: { id: existing.id },
      data: { quantity: finalQty },
    });
  });

  return handleGetCart(userId);
};

/** Xoá một dòng khỏi giỏ (idempotent). */
const handleRemoveItem = async (
  userId: number,
  variantId: number,
): Promise<CartResponse> => {
  await prisma.carts.deleteMany({
    where: { user_id: userId, variant_id: variantId },
  });
  return handleGetCart(userId);
};

/** Xoá sạch giỏ hàng. */
const handleClearCart = async (userId: number): Promise<CartResponse> => {
  await prisma.carts.deleteMany({ where: { user_id: userId } });
  return handleGetCart(userId);
};

/** Đếm nhanh số lượng cho badge header. */
const handleGetCartCount = async (
  userId: number,
): Promise<CartCountResponse> => {
  const result = await prisma.carts.aggregate({
    where: { user_id: userId },
    _sum: { quantity: true },
    _count: { _all: true },
  });
  return {
    totalItems: result._count._all,
    totalQuantity: result._sum.quantity ?? 0,
  };
};

/**
 * Gộp giỏ guest vào giỏ user khi đăng nhập.
 * - Gộp các variantId trùng trong input trước.
 * - Cộng dồn với số lượng đang có trên server, cap theo tồn kho & MAX.
 * - Item lỗi (không tồn tại / ngừng bán / hết hàng) được bỏ qua, không chặn cả lô.
 */
const handleMergeCart = async (
  userId: number,
  items: MergeCartInput["items"],
): Promise<MergeCartResponse> => {
  // Gộp số lượng theo variantId để mỗi variant chỉ xử lý một lần.
  const wanted = new Map<number, number>();
  for (const it of items) {
    wanted.set(it.variantId, (wanted.get(it.variantId) ?? 0) + it.quantity);
  }

  const report: MergeReport = { skipped: [], adjusted: [] };

  await prisma.$transaction(async (tx) => {
    for (const [variantId, qty] of wanted) {
      const variant = await tx.product_variants.findUnique({
        where: { id: variantId },
        select: {
          product_id: true,
          stock: true,
          reserved_stock: true,
          products: { select: { status: true } },
        },
      });

      if (!variant) {
        report.skipped.push({ variantId, reason: "not_found" });
        continue;
      }
      if (variant.products.status !== "active") {
        report.skipped.push({ variantId, reason: "unavailable" });
        continue;
      }

      const available = Math.max(0, variant.stock - variant.reserved_stock);
      if (available <= 0) {
        report.skipped.push({ variantId, reason: "out_of_stock" });
        continue;
      }

      const existing = await tx.carts.findUnique({
        where: { user_id_variant_id: { user_id: userId, variant_id: variantId } },
        select: { quantity: true },
      });

      const desired = (existing?.quantity ?? 0) + qty;
      const finalQty = Math.min(desired, available, MAX_QUANTITY);

      if (finalQty < desired) {
        report.adjusted.push({ variantId, requested: desired, finalQuantity: finalQty });
      }

      await tx.carts.upsert({
        where: { user_id_variant_id: { user_id: userId, variant_id: variantId } },
        create: {
          user_id: userId,
          product_id: variant.product_id,
          variant_id: variantId,
          quantity: finalQty,
        },
        update: { quantity: finalQty },
      });
    }
  });

  const cart = await handleGetCart(userId);
  return { cart, report };
};

export {
  handleGetCart,
  handleAddItem,
  handleUpdateItem,
  handleRemoveItem,
  handleClearCart,
  handleGetCartCount,
  handleMergeCart,
};
