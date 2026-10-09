import api from "./api";

export const newsCategories = [
  "Pemerintahan",
  "Kegiatan Warga",
  "Pembangunan",
  "Pengumuman",
  "Kesehatan",
];

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

function mapNewsItem(item) {
  const plainText = (item.content || "")
    .replace(/<[^>]+>/g, "") // buang tag HTML
    .replace(/&nbsp;/g, " ") // ganti &nbsp; jadi spasi biasa
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ") // rapihin spasi ganda jadi 1 spasi
    .trim();(item.content || "").replace(/<[^>]+>/g, "");
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
    content: [plainText],
    image: item.thumbnail,
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

export async function getNewsBySlug(slug) {
  if (!cache) await fetchAllNews();
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