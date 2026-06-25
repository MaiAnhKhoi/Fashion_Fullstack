import prisma from "@/config/prisma.config";
import { CategoryResponse } from "./category.response";

const CATEGORY_SELECT = {
  id: true,
  name: true,
  slug: true,
  image_url: true,
};

const toResponse = (c: {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
}): CategoryResponse => ({
  id: c.id,
  label: c.name,
  slug: c.slug,
  imageSrc: c.image_url,
  width: 696,
  height: 773,
});

const handleGetCategories = async (): Promise<CategoryResponse[]> => {
  const categories = await prisma.product_categories.findMany({
    select: CATEGORY_SELECT,
    where: { is_active: true, parent_id: { not: null } },
    orderBy: { sort_order: "asc" },
  });

  return categories.map(toResponse);
};


const handleGetParentCategoriesWithChildren = async () => {
  const categories = await prisma.product_categories.findMany({
    where: {
      is_active: true,
      parent_id: null,
    },
    orderBy: {
      sort_order: "asc",
    },
    select: {
      ...CATEGORY_SELECT,

      children: {
        where: {
          is_active: true,
        },
        orderBy: {
          sort_order: "asc",
        },
        select: CATEGORY_SELECT,
      },
    },
  });

  return categories.map((c) => ({
    ...toResponse(c),
    children: c.children.map(toResponse),
  }));
};
export {
  handleGetCategories,
  handleGetParentCategoriesWithChildren,
};
