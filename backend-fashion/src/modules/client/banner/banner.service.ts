import prisma from "@/config/prisma.config";
import { BannerResponse } from "./banner.response";

const handleGetBanners = async (
  position?: string,
): Promise<BannerResponse[]> => {
  const banners = await prisma.banners.findMany({
    select: {
      id: true,
      type: true,
      image_url: true,
      image_width: true,
      image_height: true,
      title: true,
      subtitle: true,
      col_class: true,
    },
    where: { is_active: true, ...(position ? { position: position } : {}) },
    orderBy: { sort_order: "asc" },
  });

  return banners.map((b) => ({
    id: b.id,
    bgType: b.type,
    imageSrc: b.image_url,
    width: b.image_width,
    height: b.image_height,
    heading: b.title,
    subText: b.subtitle,
    colClass: b.col_class,
  }));
};

export { handleGetBanners };
