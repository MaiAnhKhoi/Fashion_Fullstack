/**
 * Nén/thu nhỏ ảnh phía client để LUÔN nằm dưới giới hạn cho phép (mặc định 10MB của Cloudinary).
 * Thu nhỏ cạnh dài về tối đa `maxDimension`, xuất JPEG và hạ chất lượng dần đến khi đạt `maxBytes`.
 */
export interface CompressOptions {
  maxDimension?: number; // cạnh dài tối đa (px)
  maxBytes?: number; // dung lượng tối đa (byte)
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Không đọc được ảnh."));
    img.src = src;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export async function compressImageForUpload(
  file: File,
  opts: CompressOptions = {}
): Promise<File> {
  const maxDimension = opts.maxDimension ?? 1280;
  const maxBytes = opts.maxBytes ?? 10 * 1024 * 1024;

  if (!file.type.startsWith("image/")) return file;

  let img: HTMLImageElement;
  try {
    img = await loadImage(await readAsDataURL(file));
  } catch {
    return file; // không decode được -> trả nguyên bản, để bước sau xử lý
  }

  const longest = Math.max(img.width, img.height) || 1;
  const scale = Math.min(1, maxDimension / longest);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  // Nền trắng để ảnh PNG/WEBP có alpha không bị đen khi xuất JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, "image/jpeg", quality);
  while (blob && blob.size > maxBytes && quality > 0.4) {
    quality = Math.round((quality - 0.1) * 10) / 10;
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
  }

  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "model";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
