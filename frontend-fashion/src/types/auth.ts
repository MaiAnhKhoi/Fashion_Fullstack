// Backend bọc theo { message, data }; interceptor đã bóc 1 lớp,
// auth.api lấy tiếp response.data -> còn lại đúng { accessToken }.
// refreshToken được backend set vào httpOnly cookie, không trả trong body.
export interface LoginResponse {
    accessToken: string;
}