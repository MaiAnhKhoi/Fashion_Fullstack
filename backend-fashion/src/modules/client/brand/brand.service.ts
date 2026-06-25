import prisma from "@/config/prisma.config";
import { BrandResponse } from "./brand.response";

const handleGetBrands = async (): Promise<BrandResponse[]> => {
  const brands = await prisma.brands.findMany({
    select: {
      id: true,
      name: true,
      logo_url: true,
      banner_url: true,
    },
    orderBy: { name: "asc" },
  });

  return brands.map((b) => ({
    id: b.id,
    name: b.name,
    logoSrc: b.logo_url,
  }));
};

export { handleGetBrands };
