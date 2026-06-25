import prisma from "@/config/prisma.config";
import { ShopgramResponse } from "./shopgram.response";

const handleGetShopgram = async (): Promise<ShopgramResponse[]> => {
  const items = await prisma.instagram_gallery.findMany({
    select: {
      id: true,
      image_url: true,
      caption: true,
      username: true,
      instagram_gallery_products: {
        select: { product_id: true },
        take: 1,
      },
    },
    where: { is_active: true },
    orderBy: { sort_order: "asc" },
  });

  return items.map((item) => ({
    id: item.id,
    imgSrc: item.image_url,
    alt: item.caption ?? item.username ?? null,
    productId: item.instagram_gallery_products[0]?.product_id ?? null,
  }));
};

export { handleGetShopgram };
