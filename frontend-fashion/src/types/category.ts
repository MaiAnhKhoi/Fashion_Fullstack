export interface CategoryResponse {
  id: number;
  label: string;
  slug: string;
  imageSrc: string | null;
  width: number | null;
  height: number | null;
}

export interface CategoryTreeResponse extends CategoryResponse {
  children: CategoryResponse[];
}
