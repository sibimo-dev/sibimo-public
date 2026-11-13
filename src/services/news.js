import api from "./api";

function resolveNewsImage(path) {
  if (!path || typeof path !== "string") return null;

  const value = path.trim();
  if (!value) return null;

  // URL lengkap tidak perlu diubah.
  if (/^https?:\/\//i.test(value)) return value;

  const backendOrigin = String(api.defaults.baseURL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  const cleanPath = value.replace(/^\/+/, "");

  const storagePath = cleanPath.startsWith("storage/")
    ? `/${cleanPath}`
    : `/storage/${cleanPath}`;

  return `${backendOrigin}${storagePath}`;
}

export const defaultNewsCategories = [
  "Pemerintahan",
  "Kegiatan Warga",
  "Pembangunan",
  "Pengumuman",
  "Kesehatan",
];

export async function fetchNewsCategories() {
  try {
    const response = await api.get("/news-categories");
    const categories = (response.data?.data || [])
      .map((item) => item.category_name)
      .filter(Boolean);
    return categories.length ? categories : defaultNewsCategories;
  } catch (error) {
    console.error("Gagal memuat kategori berita:", error);
    return defaultNewsCategories;
  }
}

const categoryStyles = {
  Pemerintahan: "bg-primary-900 text-white",
  "Kegiatan Warga": "bg-amber-50 text-amber-700",
  Pembangunan: "bg-emerald-50 text-emerald-700",
  Pengumuman: "bg-rose-50 text-rose-700",
  Kesehatan: "bg-sky-50 text-sky-700",
};

export function getCategoryClasses(category) {
  return categoryStyles[category] || "bg-primary-50 text-primary-700";
}

/**
 * Parse HTML konten dari rich text editor (Quill) menjadi array blok konten.
 * Setiap elemen array bisa berupa:
 *   - string  → paragraf teks biasa
 *   - { type: 'image', src: string, caption: string } → gambar
 */
function parseHtmlContent(html) {
  if (!html) return [];

  // Gunakan DOMParser jika tersedia (browser), fallback ke regex untuk SSR/Node
  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const blocks = [];

    function decodeText(text) {
      return text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    }

    /**
     * Traverse tiap node dan pertahankan urutan teks & gambar sesuai posisi aslinya.
     * Quill biasanya menghasilkan: <p>teks</p> <p><img></p> <p>teks lanjut</p>
     * sehingga iterasi top-level nodes sudah cukup menjaga urutan.
     */
    function traverse(node) {
      // Skip text nodes & komentar di level atas
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      if (node.tagName === "IMG") {
        const src = node.getAttribute("src") || "";
        if (src) blocks.push({ type: "image", src, caption: node.getAttribute("alt") || "" });
        return;
      }

      // Elemen yang mengandung <img> → traverse anak-anaknya secara berurutan
      if (node.querySelector("img")) {
        Array.from(node.childNodes).forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE && child.tagName === "IMG") {
            const src = child.getAttribute("src") || "";
            if (src) blocks.push({ type: "image", src, caption: child.getAttribute("alt") || "" });
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            // Elemen non-img (span, strong, dll) → ambil teksnya
            const text = decodeText(child.textContent || "");
            if (text) blocks.push(text);
          } else if (child.nodeType === Node.TEXT_NODE) {
            const text = decodeText(child.textContent || "");
            if (text) blocks.push(text);
          }
        });
        return;
      }

      // Elemen murni teks (paragraf, heading, dsb)
      const text = decodeText(node.textContent || "");
      if (text) blocks.push(text);
    }

    Array.from(doc.body.childNodes).forEach(traverse);
    return blocks.length ? blocks : [""];
  }

  // Fallback: regex-based parsing (non-browser env)
  const blocks = [];
  // Extract <img> tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    blocks.push({ type: "image", src: match[1], caption: "" });
  }
  // Extract plain text
  const plainText = html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (plainText) blocks.unshift(plainText);
  return blocks.length ? blocks : [""];
}

function mapNewsItem(item) {
  const rawHtml = item.content || "";

  // Teks murni untuk excerpt (tanpa HTML)
  const plainText = rawHtml
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return {
    news_id: item.news_id,
    slug: item.slug,
    category: item.category?.category_name || "Umum",
    date: item.published_at
      ? new Date(item.published_at).toLocaleDateString("id-ID", {
          day: "2-digit", month: "short", year: "numeric",
        })
      : "",
    dateISO: item.published_at,
    author: item.author?.full_name || "Admin Desa",
    title: item.title,
    excerpt: plainText.slice(0, 160) + (plainText.length > 160 ? "..." : ""),
    content: parseHtmlContent(rawHtml),
    rawContent: rawHtml,
    image: resolveNewsImage(item.thumbnail),
    popular: false,
    isPinned: false,
  };
}

let cache = null;

export async function fetchAllNews() {
  const res = await api.get("/news");
  const list = res.data.data.filter((n) => n.status === "Published");
  cache = list.map(mapNewsItem);
  return cache;
}

export function getAllNewsSync() {
  return cache || [];
}

export async function getNewsBySlug(slug, force = false) {
  if (!cache || force) await fetchAllNews();
  return cache.find((item) => item.slug === slug) || null;
}

export async function getPopularNews(limit = 3) {
  if (!cache) await fetchAllNews();
  return cache.slice(0, limit);
}

export async function getRelatedNews(current, limit = 3) {
  if (!current) return [];
  if (!cache) await fetchAllNews();
  const sameCategory = cache.filter((item) => item.slug !== current.slug && item.category === current.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = cache.filter((item) => item.slug !== current.slug && item.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}
