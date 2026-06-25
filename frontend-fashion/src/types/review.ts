export interface TestimonialResponse {
  id: number;
  name: string | null;
  image: string | null;
  review: string | null;
  rating: number | null;
  product: string | null;
  price: number;
  isVerified: boolean;
}
