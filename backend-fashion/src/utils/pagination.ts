export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ParseOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

const toPositiveInt = (value: unknown): number | null => {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
};

/**
 * Đọc `page` & `limit` từ query string cho endpoint danh sách.
 * Giá trị sai/thiếu được clamp về mặc định thay vì báo lỗi (thân thiện cho listing).
 */
export const parsePagination = (
  query: Record<string, unknown>,
  { defaultLimit = 12, maxLimit = 100 }: ParseOptions = {},
): PaginationParams => {
  const page = toPositiveInt(query.page) ?? 1;
  const rawLimit = toPositiveInt(query.limit) ?? defaultLimit;
  const limit = Math.min(rawLimit, maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

/** Dựng metadata phân trang từ tổng số bản ghi. */
export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1 && total > 0,
  };
};
