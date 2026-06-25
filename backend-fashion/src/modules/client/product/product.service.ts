import prisma from "@/config/prisma.config";
import { Prisma } from "@/generated/prisma/client";
import {
  ProductDetailResponse,
  ProductResponse,
} from "@/modules/client/product/product.response";
import AppError from "@/utils/app-error";

const toNumber = (value: unknown): number => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return parseFloat(String(value));
};

const PRODUCTS_SELECT = {
  select: {
    id: true,
    title: true,
    sale_label: true,
    base_price: true,
    old_price: true,
    is_trending: true,
    product_images: {
      select: { url: true, is_main: true, sort_order: true },
      orderBy: { sort_order: "asc" as const },
    },
    product_variants: {
      select: {
        stock: true,
        reserved_stock: true,
        sizes: { select: { name: true } },
        colors: { select: { name: true, label: true, css_class: true } },
        product_variant_images: {
          select: { url: true },
          where: { is_main: true },
          take: 1,
        },
      },
    },
    _count: {
      select: { order_items: true },
    },
  },
} as const;

type ProductRow = Prisma.productsGetPayload<typeof PRODUCTS_SELECT>;

const transformProduct = (p: ProductRow): ProductResponse => {
  const mainImg = p.product_images.find((img) => img.is_main);
  const hoverImg = p.product_images.find((img) => !img.is_main);

  const sizes: string[] = [
    ...new Set(
      p.product_variants.flatMap((v) => (v.sizes ? [v.sizes.name] : [])),
    ),
  ];

  const colorMap = new Map<
    string,
    { label: string; value: string; img: string }
  >();
  for (const v of p.product_variants) {
    if (v.colors && !colorMap.has(v.colors.name)) {
      colorMap.set(v.colors.name, {
        label: v.colors.label ?? v.colors.name,
        value: v.colors.css_class ?? "",
        img: v.product_variant_images[0]?.url ?? mainImg?.url ?? "",
      });
    }
  }

  const colors = [...colorMap.values()];

  return {
    id: p.id,
    imgSrc: mainImg?.url ?? "",
    imgHover: hoverImg?.url ?? mainImg?.url ?? "",
    saleLabel: p.sale_label,
    title: p.title,
    price: toNumber(p.base_price),
    oldPrice: toNumber(p.old_price),
    sizes,
    colors,
    isTrending: p.is_trending,
    inStock: p.product_variants.some((v) => v.stock > (v.reserved_stock ?? 0)),
  };
};

interface PaginatedProducts {
  items: ProductResponse[];
  total: number;
}

export interface ProductListFilters {
  skip: number;
  limit: number;
  sort?: string; // newest | price-asc | price-desc | title-asc | title-desc
  minPrice?: number;
  maxPrice?: number;
  color?: string; // css_class | name | label
  size?: string; // size name
  brand?: string; // brand name
  inStock?: boolean;
  category?: string; // category slug
  q?: string; // tìm theo tên
}

const buildOrderBy = (
  sort?: string,
): Prisma.productsOrderByWithRelationInput => {
  switch (sort) {
    case "price-asc":
      return { base_price: "asc" };
    case "price-desc":
      return { base_price: "desc" };
    case "title-asc":
      return { title: "asc" };
    case "title-desc":
      return { title: "desc" };
    default:
      return { created_at: "desc" };
  }
};

// Gộp điều kiện vào AND để filter chạy thẳng trên DB (không tải hết về client).
const buildWhere = (f: ProductListFilters): Prisma.productsWhereInput => {
  const and: Prisma.productsWhereInput[] = [];

  if (f.q) and.push({ title: { contains: f.q } });

  if (f.minPrice != null || f.maxPrice != null) {
    and.push({
      base_price: {
        ...(f.minPrice != null ? { gte: f.minPrice } : {}),
        ...(f.maxPrice != null ? { lte: f.maxPrice } : {}),
      },
    });
  }

  // color + size cùng nằm trên 1 variant ("có biến thể màu X cỡ Y").
  const variant: Prisma.product_variantsWhereInput = {};
  if (f.color) {
    variant.colors = {
      OR: [{ css_class: f.color }, { name: f.color }, { label: f.color }],
    };
  }
  if (f.size) variant.sizes = { name: f.size };
  if (Object.keys(variant).length) {
    and.push({ product_variants: { some: variant } });
  }

  if (f.inStock === true) {
    and.push({ product_variants: { some: { stock: { gt: 0 } } } });
  } else if (f.inStock === false) {
    and.push({ product_variants: { none: { stock: { gt: 0 } } } });
  }

  if (f.brand) {
    and.push({ product_brands: { some: { brands: { name: f.brand } } } });
  }

  if (f.category) {
    and.push({
      product_category_map: {
        some: { product_categories: { slug: f.category } },
      },
    });
  }

  return and.length ? { AND: and } : {};
};

const handleGetAllProducts = async (
  filters: ProductListFilters,
): Promise<PaginatedProducts> => {
  const where = buildWhere(filters);

  // Lấy data + đếm tổng trong cùng một transaction để số liệu nhất quán.
  const [products, total] = await prisma.$transaction([
    prisma.products.findMany({
      ...PRODUCTS_SELECT,
      where,
      orderBy: buildOrderBy(filters.sort),
      skip: filters.skip,
      take: filters.limit,
    }),
    prisma.products.count({ where }),
  ]);

  return { items: products.map(transformProduct), total };
};

// Đánh giá của 1 sản phẩm + tổng hợp (trung bình, đếm theo sao).
const handleGetProductReviews = async (productId: number) => {
  const reviews = await prisma.user_reviews.findMany({
    where: { product_id: productId },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      created_at: true,
      users: { select: { full_name: true, avatar_url: true } },
    },
  });

  const ratings = reviews
    .map((r) => r.rating ?? 0)
    .filter((r) => r > 0);
  const count = ratings.length;
  const average = count
    ? Math.round((ratings.reduce((a, b) => a + b, 0) / count) * 10) / 10
    : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r === star).length,
  }));

  return {
    summary: { average, count, breakdown },
    items: reviews.map((r) => ({
      id: r.id,
      userName: r.users?.full_name ?? "Khách",
      avatar: r.users?.avatar_url ?? null,
      rating: r.rating ?? 0,
      title: r.title,
      comment: r.comment,
      createdAt: r.created_at ? r.created_at.toISOString() : null,
    })),
  };
};

// Facets cho UI filter: màu / size / brand / khoảng giá.
const handleGetProductFilters = async () => {
  const [colors, sizes, brands, priceAgg] = await prisma.$transaction([
    prisma.colors.findMany({
      select: { name: true, label: true, css_class: true },
      orderBy: { name: "asc" },
    }),
    prisma.sizes.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
    prisma.brands.findMany({ select: { name: true }, orderBy: { name: "asc" } }),
    prisma.products.aggregate({
      _min: { base_price: true },
      _max: { base_price: true },
    }),
  ]);

  return {
    colors: colors.map((c) => ({
      name: c.name,
      label: c.label ?? c.name,
      value: c.css_class ?? "",
    })),
    sizes: sizes.map((s) => s.name),
    brands: brands.map((b) => b.name),
    priceRange: {
      min: Math.floor(toNumber(priceAgg._min.base_price)),
      max: Math.ceil(toNumber(priceAgg._max.base_price)),
    },
  };
};

// Lấy nhiều sản phẩm theo danh sách id (dùng cho wishlist...).
const getProductsByIds = async (ids: number[]): Promise<ProductResponse[]> => {
  if (ids.length === 0) return [];
  const products = await prisma.products.findMany({
    ...PRODUCTS_SELECT,
    where: { id: { in: ids } },
    orderBy: { created_at: "desc" },
  });
  return products.map(transformProduct);
};

// Tìm kiếm sản phẩm theo tên (title), có phân trang.
const handleSearchProducts = async (
  query: string,
  skip: number,
  limit: number,
): Promise<{ items: ProductResponse[]; total: number }> => {
  const where: Prisma.productsWhereInput = {
    title: { contains: query },
  };

  const [products, total] = await prisma.$transaction([
    prisma.products.findMany({
      ...PRODUCTS_SELECT,
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.products.count({ where }),
  ]);

  return { items: products.map(transformProduct), total };
};

const handleGetBestsellers = async (): Promise<ProductResponse[]> => {
  const bestsellers = await prisma.products.findMany({
    ...PRODUCTS_SELECT,
    where: { order_items: { some: {} } },
  });

  return bestsellers
    .sort((a, b) => b._count.order_items - a._count.order_items)
    .slice(0, 10)
    .map(transformProduct);
};

// Sản phẩm hay được mua kèm: dựa trên các sản phẩm xuất hiện cùng order với
// sản phẩm này. Thiếu thì bù bằng sản phẩm cùng category, cuối cùng là trending.
const handleGetBoughtTogether = async (
  productId: number,
  limit = 3,
): Promise<ProductResponse[]> => {
  // 1) Các order có chứa sản phẩm này.
  const orderRows = await prisma.order_items.findMany({
    where: { product_id: productId, order_id: { not: null } },
    select: { order_id: true },
    distinct: ["order_id"],
  });
  const orderIds = orderRows
    .map((o) => o.order_id)
    .filter((id): id is number => id != null);

  // 2) Đếm các sản phẩm khác xuất hiện cùng những order đó.
  const coOccur = orderIds.length
    ? await prisma.order_items.groupBy({
        by: ["product_id"],
        where: {
          order_id: { in: orderIds },
          product_id: { not: productId },
        },
        _count: { product_id: true },
        orderBy: { _count: { product_id: "desc" } },
        take: limit,
      })
    : [];

  let ids = coOccur
    .map((c) => c.product_id)
    .filter((id): id is number => id != null);

  // 3) Fallback: chưa đủ -> bù bằng sản phẩm cùng category.
  if (ids.length < limit) {
    const fallback = await prisma.products.findMany({
      where: {
        id: { not: productId, notIn: ids },
        product_category_map: {
          some: {
            product_categories: {
              product_category_map: { some: { product_id: productId } },
            },
          },
        },
      },
      select: { id: true },
      orderBy: { created_at: "desc" },
      take: limit - ids.length,
    });
    ids = [...ids, ...fallback.map((f) => f.id)];
  }

  // 4) Fallback cuối: sản phẩm trending.
  if (ids.length < limit) {
    const trending = await prisma.products.findMany({
      where: { id: { not: productId, notIn: ids }, is_trending: true },
      select: { id: true },
      take: limit - ids.length,
    });
    ids = [...ids, ...trending.map((t) => t.id)];
  }

  if (ids.length === 0) return [];

  // Giữ thứ tự theo độ liên quan đã tính ở trên.
  const products = await prisma.products.findMany({
    ...PRODUCTS_SELECT,
    where: { id: { in: ids } },
  });
  const rank = new Map(ids.map((id, i) => [id, i]));
  return products
    .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0))
    .map(transformProduct);
};

const handleGetTodaysPicks = async (): Promise<ProductResponse[]> => {
  const products = await prisma.products.findMany({
    ...PRODUCTS_SELECT,
    where: { is_today_pick: true, status: "active" },
    orderBy: { updated_at: "desc" },
  });

  return products.map(transformProduct);
};

// ─── Detail select ────────────────────────────────────────────────────────────
// Giống PRODUCTS_SELECT nhưng thêm: slug, description, brands, categories,
// reviews, tất cả ảnh, và SKU của variant.
const PRODUCT_DETAIL_SELECT = {
  select: {
    id: true,
    title: true,
    slug: true,
    description: true,
    sale_label: true,
    base_price: true,
    old_price: true,
    is_trending: true,
    product_images: {
      select: { url: true, is_main: true, sort_order: true },
      orderBy: { sort_order: "asc" as const },
    },
    product_variants: {
      select: {
        id: true,
        sku: true,
        stock: true,
        reserved_stock: true,
        sizes: { select: { id: true, name: true } },
        colors: {
          select: { id: true, name: true, label: true, css_class: true },
        },
        product_variant_images: {
          select: { url: true },
          where: { is_main: true },
          take: 1,
        },
      },
    },
    product_brands: {
      select: { brands: { select: { name: true } } },
      take: 1,
    },
    product_category_map: {
      select: { product_categories: { select: { name: true } } },
    },
    user_reviews: {
      select: { rating: true },
    },
  },
} as const;

type ProductDetailRow = Prisma.productsGetPayload<typeof PRODUCT_DETAIL_SELECT>;

const transformProductDetail = (
  p: NonNullable<ProductDetailRow>,
): ProductDetailResponse => {
  const mainImg = p.product_images.find((img) => img.is_main);
  const hoverImg = p.product_images.find((img) => !img.is_main);

  const sizes: string[] = [
    ...new Set(
      p.product_variants.flatMap((v) => (v.sizes ? [v.sizes.name] : [])),
    ),
  ];

  const colorMap = new Map<
    string,
    { label: string; value: string; img: string }
  >();
  for (const v of p.product_variants) {
    if (v.colors && !colorMap.has(v.colors.name)) {
      colorMap.set(v.colors.name, {
        label: v.colors.label ?? v.colors.name,
        value: v.colors.css_class ?? "",
        img: v.product_variant_images[0]?.url ?? mainImg?.url ?? "",
      });
    }
  }

  // Tính rating trung bình từ user_reviews
  const validRatings = p.user_reviews
    .map((r) => r.rating)
    .filter((r): r is number => r !== null);
  const rating =
    validRatings.length > 0
      ? Math.round(
          (validRatings.reduce((a, b) => a + b, 0) / validRatings.length) * 10,
        ) / 10
      : 0;

  // Tổng số hàng còn khả dụng (stock - reserved_stock)
  const stockCount = p.product_variants.reduce(
    (sum, v) => sum + Math.max(0, v.stock - (v.reserved_stock ?? 0)),
    0,
  );
  const variants = p.product_variants.map((v) => ({
    id: v.id,
    sku: v.sku,
    size: v.sizes?.name ?? null,
    color: v.colors?.label ?? v.colors?.name ?? null,
    stock: Math.max(0, v.stock - (v.reserved_stock ?? 0)),
    image: v.product_variant_images[0]?.url ?? mainImg?.url ?? "",
  }));

  return {
    // ── Chung với ProductResponse ──
    id: p.id,
    imgSrc: mainImg?.url ?? "",
    imgHover: hoverImg?.url ?? mainImg?.url ?? "",
    saleLabel: p.sale_label,
    title: p.title,
    price: toNumber(p.base_price),
    oldPrice: p.old_price ? toNumber(p.old_price) : null,
    sizes,
    colors: [...colorMap.values()],
    inStock: p.product_variants.some((v) => v.stock > (v.reserved_stock ?? 0)),
    isTrending: p.is_trending,

    // ── Thêm cho trang detail ──
    slug: p.slug,
    description: p.description ?? null,
    sku: p.product_variants[0]?.sku ?? "",
    brand: p.product_brands[0]?.brands?.name ?? null,
    categories: p.product_category_map.map((c) => c.product_categories.name),
    rating,
    reviewCount: validRatings.length,
    stockCount,
    soldLast24h: 0, // filled in handleGetProductById via separate count query
    allImages: p.product_images.map((img) => img.url),
    variants,
  };
};

const handleGetProductById = async (
  id: number,
): Promise<ProductDetailResponse | null> => {
  const product = await prisma.products.findUnique({
    where: { id },
    ...PRODUCT_DETAIL_SELECT,
  });

  if (!product) return null;

  const result = transformProductDetail(product);

  // Đếm số lượng đã bán trong 24h qua — cần query riêng vì Prisma
  // không cho aggregate trực tiếp qua nested relation trong findUnique.
  const soldLast24h = await prisma.order_items.aggregate({
    where: {
      product_id: id,
      orders: {
        created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    },
    _sum: { quantity: true },
  });

  result.soldLast24h = soldLast24h._sum.quantity ?? 0;

  return result;
};

// ─── Reviews: chỉ người ĐÃ MUA mới được đánh giá ───────────────────────────────

// Tìm 1 đơn hợp lệ của user có chứa sản phẩm này (đã thanh toán hoặc hoàn tất,
// không tính đơn đã huỷ). Trả về order_id nếu có, ngược lại null.
const findPurchasedOrderId = async (
  userId: number,
  productId: number,
): Promise<number | null> => {
  const item = await prisma.order_items.findFirst({
    where: {
      product_id: productId,
      orders: {
        user_id: userId,
        status: { not: "cancelled" },
        OR: [{ status: "completed" }, { payment_status: "paid" }],
      },
    },
    select: { order_id: true },
    orderBy: { id: "desc" },
  });
  return item?.order_id ?? null;
};

// Quyền đánh giá của user với 1 sản phẩm (đã mua chưa, đã đánh giá chưa).
const handleGetReviewEligibility = async (
  userId: number,
  productId: number,
): Promise<{ canReview: boolean; hasPurchased: boolean; hasReviewed: boolean }> => {
  const [orderId, existing] = await Promise.all([
    findPurchasedOrderId(userId, productId),
    prisma.user_reviews.findFirst({
      where: { user_id: userId, product_id: productId },
      select: { id: true },
    }),
  ]);

  const hasPurchased = orderId != null;
  const hasReviewed = existing != null;
  return { canReview: hasPurchased && !hasReviewed, hasPurchased, hasReviewed };
};

interface CreateReviewInput {
  rating: number;
  title?: string | null;
  comment: string;
}

const handleCreateReview = async (
  userId: number,
  productId: number,
  input: CreateReviewInput,
) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw new AppError("Sản phẩm không tồn tại", 404);

  // Chặn: chưa mua thì không cho đánh giá.
  const orderId = await findPurchasedOrderId(userId, productId);
  if (orderId == null) {
    throw new AppError("Bạn cần mua sản phẩm này trước khi đánh giá", 403);
  }

  // Chặn: mỗi người chỉ đánh giá 1 lần / sản phẩm.
  const existing = await prisma.user_reviews.findFirst({
    where: { user_id: userId, product_id: productId },
    select: { id: true },
  });
  if (existing) {
    throw new AppError("Bạn đã đánh giá sản phẩm này rồi", 409);
  }

  const created = await prisma.user_reviews.create({
    data: {
      user_id: userId,
      product_id: productId,
      order_id: orderId,
      rating: input.rating,
      title: input.title ?? null,
      comment: input.comment,
      is_verified_purchase: true,
    },
    select: {
      id: true,
      rating: true,
      title: true,
      comment: true,
      created_at: true,
      users: { select: { full_name: true, avatar_url: true } },
    },
  });

  return {
    id: created.id,
    userName: created.users?.full_name ?? "Khách",
    avatar: created.users?.avatar_url ?? null,
    rating: created.rating ?? 0,
    title: created.title,
    comment: created.comment,
    createdAt: created.created_at ? created.created_at.toISOString() : null,
  };
};

export {
  handleGetAllProducts,
  handleGetBestsellers,
  handleGetTodaysPicks,
  handleGetBoughtTogether,
  handleGetProductById,
  getProductsByIds,
  handleSearchProducts,
  handleGetProductFilters,
  handleGetProductReviews,
  handleGetReviewEligibility,
  handleCreateReview,
};
