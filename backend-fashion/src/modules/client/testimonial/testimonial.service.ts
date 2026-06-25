import prisma from "@/config/prisma.config";
import { TestimonialResponse } from "./testimonial.response";

const toNumber = (value: unknown): number => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return parseFloat(String(value));
};

const handleGetTestimonials = async (): Promise<TestimonialResponse[]> => {
  const reviews = await prisma.user_reviews.findMany({
    select: {
      id: true,
      comment: true,
      rating: true,
      is_verified_purchase: true,
      users: {
        select: {
          full_name: true,
          avatar_url: true,
        },
      },
      products: {
        select: {
          title: true,
          base_price: true,
        },
      },
    },
    where: {
      is_verified_purchase: true,
      rating: { gte: 4 },
      comment: { not: null },
    },
    orderBy: { created_at: "desc" },
    take: 12,
  });

  return reviews.map((r) => ({
    id: r.id,
    name: r.users?.full_name ?? null,
    image: r.users?.avatar_url ?? null,
    review: r.comment,
    rating: r.rating,
    product: r.products?.title ?? null,
    price: toNumber(r.products?.base_price),
    isVerified: r.is_verified_purchase ?? false,
  }));
};

export { handleGetTestimonials };
