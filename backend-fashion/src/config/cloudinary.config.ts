import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env.config";
import AppError from "@/utils/app-error";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isConfigured = (): boolean =>
  Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET,
  );

export interface UploadResult {
  url: string; // secure_url
  publicId: string; // dùng để xoá sau này
}

/**
 * Upload 1 ảnh (buffer) lên Cloudinary. api-secret nằm ở backend nên an toàn.
 * Tái sử dụng cho avatar, ảnh sản phẩm... bằng cách đổi `folder`.
 */
export const uploadImage = (
  buffer: Buffer,
  folder: string = env.CLOUDINARY_FOLDER,
): Promise<UploadResult> => {
  if (!isConfigured()) {
    throw new AppError("Cloudinary chưa được cấu hình", 500);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError("Tải ảnh lên thất bại", 502));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
};

/** Xoá ảnh theo publicId (bỏ qua lỗi nếu ảnh không tồn tại). */
export const deleteImage = async (publicId: string): Promise<void> => {
  if (!isConfigured() || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // không chặn luồng chính nếu xoá ảnh cũ thất bại
  }
};

export default cloudinary;
