/**
 * Kompresi gambar sisi klien sebelum diunggah.
 * - Mengabaikan PDF atau file non-gambar (dikembalikan apa adanya).
 * - Menjaga orientasi & rasio aspek gambar.
 * - Resolusi maksimal diset ke 1920px (Full HD) agar teks dokumen (NIK, KK, nama) tetap sangat tajam dan terbaca.
 * - Kualitas JPEG 0.82 menghasilkan ukuran berkisar 150KB - 400KB dari file asli 3MB - 10MB.
 */
export async function compressImage(file, options = {}) {
  if (!file || !(file instanceof File)) return file;

  // Jika bukan gambar (misal PDF), kembalikan langsung tanpa ubah
  const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(file.name || "");
  if (!isImage || file.type === "application/pdf") {
    return file;
  }

  // Jika ukuran sudah di bawah threshold (misal < 350 KB), tidak perlu dikompres lagi
  const minCompressSize = options.minSize ?? 350 * 1024;
  const maxDimension = options.maxDimension ?? 1920;
  const quality = options.quality ?? 0.82;

  if (file.size <= minCompressSize) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(file);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => resolve(file);
      img.onload = () => {
        try {
          let { width, height } = img;

          // Hitung rasio aspek jika dimensi melebihi maxDimension
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                return resolve(file);
              }
              const originalName = file.name || "dokumen.jpg";
              const newFileName = originalName.replace(/\.[^/.]+$/, "") + ".jpg";
              const compressedFile = new File([blob], newFileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            quality,
          );
        } catch {
          resolve(file);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
