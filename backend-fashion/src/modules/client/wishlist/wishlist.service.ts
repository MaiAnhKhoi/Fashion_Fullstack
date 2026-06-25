import prisma from "@/config/prisma.config";
import AppError from "@/utils/app-error";
import { getProductsByIds } from "@/modules/client/product/product.service";
import { ProductResponse } from "@/modules/client/product/product.response";

const handleAddWishList = async (
  userId: number,
  productId: number,
): Promise<void> => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });
  if (!product) {
    throw new AppError("Sản phẩm không tồn tại", 404);
  }
  if (product.status !== "active") {
    throw new AppError("Sản phẩm hiện không khả dụng", 409);
  }
  await prisma.wishlists.upsert({
    where: { user_id_product_id: { user_id: userId, product_id: productId } },
    update: {},
    create: { user_id: userId, product_id: productId },
  });
};

const handleDeleteWishList = async (
  userId: number,
  productId: number,
): Promise<void> => {
  await prisma.wishlists.deleteMany({
    where: { user_id: userId, product_id: productId },
  });
};

const handleGetWishListCount = async (userId: number): Promise<number> => {
  return prisma.wishlists.count({ where: { user_id: userId } });
};

const handleGetWishListIds = async (userId: number): Promise<number[]> => {
  const wishlists = await prisma.wishlists.findMany({
    where: { user_id: userId },
    select: { product_id: true },
  });
  return wishlists.map((wishlist) => {
    return wishlist.product_id;
  });
};

// Trả về sản phẩm trong wishlist (đầy đủ) kèm phân trang.
const handleGetWishListProducts = async (
  userId: number,
  skip: number,
  limit: number,
): Promise<{ items: ProductResponse[]; total: number }> => {
  const [rows, total] = await prisma.$transaction([
    prisma.wishlists.findMany({
      where: { user_id: userId },
      orderBy: { id: "desc" }, // mới thêm lên đầu
      skip,
      take: limit,
      select: { product_id: true },
    }),
    prisma.wishlists.count({ where: { user_id: userId } }),
  ]);

  const ids = rows.map((r) => r.product_id);
  const products = await getProductsByIds(ids);

  // Giữ đúng thứ tự wishlist (getProductsByIds sắp theo product.created_at).
  const byId = new Map(products.map((p) => [p.id, p]));
  const items = ids
    .map((id) => byId.get(id))
    .filter((p): p is ProductResponse => Boolean(p));

  return { items, total };
};

export {
  handleAddWishList,
  handleDeleteWishList,
  handleGetWishListCount,
  handleGetWishListIds,
  handleGetWishListProducts,
};
