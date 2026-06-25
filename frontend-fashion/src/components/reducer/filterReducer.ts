// State filter/sort cho trang sản phẩm. Việc lọc/sắp xếp do API xử lý,
// reducer chỉ giữ "ý định filter" của người dùng -> build query gửi lên server.
export interface FilterState {
  price: [number, number];
  availability: "All" | boolean;
  color: string; // "All" hoặc tên màu
  size: string; // "All" hoặc tên size
  brands: string; // "All" hoặc tên brand
  sortingOption: string; // nhãn hiển thị
  currentPage: number;
  itemPerPage: number;
}

export type FilterAction =
  | { type: "SET_PRICE"; payload: [number, number] }
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_SIZE"; payload: string }
  | { type: "SET_AVAILABILITY"; payload: "All" | boolean }
  | { type: "SET_BRANDS"; payload: string }
  | { type: "SET_SORTING_OPTION"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_ITEM_PER_PAGE"; payload: number }
  | { type: "CLEAR_FILTER"; payload?: [number, number] };

export const initialState: FilterState = {
  price: [0, 0], // [0,0] = chưa khởi tạo, sẽ lấy theo facets priceRange
  availability: "All",
  color: "All",
  size: "All",
  brands: "All",
  sortingOption: "Sort by (Default)",
  currentPage: 1,
  itemPerPage: 12,
};

// Đổi filter -> luôn về trang 1.
export function reducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, price: action.payload, currentPage: 1 };
    case "SET_COLOR":
      return { ...state, color: action.payload, currentPage: 1 };
    case "SET_SIZE":
      return { ...state, size: action.payload, currentPage: 1 };
    case "SET_AVAILABILITY":
      return { ...state, availability: action.payload, currentPage: 1 };
    case "SET_BRANDS":
      return { ...state, brands: action.payload, currentPage: 1 };
    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload, currentPage: 1 };
    case "CLEAR_FILTER":
      return {
        ...state,
        price: action.payload ?? [0, 0],
        availability: "All",
        color: "All",
        size: "All",
        brands: "All",
        currentPage: 1,
      };
    default:
      return state;
  }
}
