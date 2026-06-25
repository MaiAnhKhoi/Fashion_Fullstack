interface ProductColor {
  label: string;
  value: string; // CSS class, e.g. "bg-yellow"
  img: string; // image URL when this color is selected
}

interface ProductResponse {
  id: number;
  imgSrc: string;
  imgHover: string;
  saleLabel: string | null;
  title: string | null;
  price: number;
  oldPrice: number | null;
  sizes: string[];
  colors: ProductColor[];
  inStock: boolean;
  isTrending: boolean;
}

interface ProductVariant {
  id: number;
  sku: string;

  size: string | null;
  color: string | null;

  stock: number;
  image: string | null;
}

// Extended response for the product detail page
interface ProductDetailResponse extends ProductResponse {
  slug: string;
  description: string | null; // → Description1 section
  sku: string; // → "SKU: ..." label in Details1
  brand: string | null; // → brand name in ProductHeading
  categories: string[]; // → "Categories: ..." in Details1
  rating: number; // → star rating in ProductHeading
  reviewCount: number; // → "(N reviews)" in ProductHeading
  stockCount: number; // → "Only N items left" in ProductHeading
  soldLast24h: number; // → "N sold in last 24 hours" in ProductHeading
  allImages: string[]; // → all images for the Slider1 gallery
  variants: ProductVariant[];
}

export { ProductColor, ProductResponse, ProductDetailResponse };
