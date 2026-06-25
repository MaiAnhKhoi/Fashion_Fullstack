import multer from "multer";
import AppError from "@/utils/app-error";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Lưu vào RAM (buffer) rồi đẩy thẳng lên Cloudinary, không ghi đĩa.
const storage = multer.memoryStorage();

export const uploadImageMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Chỉ chấp nhận file ảnh", 400));
    }
  },
});
