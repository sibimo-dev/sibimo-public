import api from "./api";

export const statusMeta = {
  planned: { label: "Perencanaan", severity: "secondary", icon: "pi pi-clock" },
  "in-progress": { label: "Sedang Berjalan", severity: "info", icon: "pi pi-sync" },
  completed: { label: "Selesai", severity: "success", icon: "pi pi-check-circle" },
};

export const developmentStatusOptions = [
  { label: "Semua", value: "all" },
  { label: statusMeta.planned.label, value: "planned" },
  { label: statusMeta["in-progress"].label, value: "in-progress" },
  { label: statusMeta.completed.label, value: "completed" },
];

const categoryIcons = {
  infrastruktur: "pi pi-building",
  kesehatan: "pi pi-heart",
  pendidikan: "pi pi-book",
  lingkungan: "pi pi-globe",
  sosial: "pi pi-users",
};

export function categoryIcon(category) {
  return categoryIcons[String(category || "").toLowerCase()] || "pi pi-tag";
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function mapStatus(status) {
  const value = String(status || "").toLowerCase().replace(/[\s_]+/g, "-");
  if (["completed", "done", "selesai"].includes(value)) return "completed";
  if (["in-progress", "ongoing", "sedang-berjalan", "berjalan"].includes(value)) return "in-progress";
  return "planned";
}

const PHOTO_PERCENTS = [0, 50, 100];

function buildPhotoSlots(photos = []) {
  return PHOTO_PERCENTS.map((percent) => {
    const found = photos.find((p) => Number(p.percentage ?? p.percent) === percent);
    return { percent, image: found?.image || "" };
  });
}

function capitalize(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "Umum";
}

function mapDevelopmentItem(item) {
  const startDate = item.start_date || "";
  const photos = buildPhotoSlots(item.progress);
  const highestPhoto = Math.max(0, ...photos.filter((p) => p.image).map((p) => p.percent));
  const volume = item.volume != null
    ? `${Number(item.volume)} ${item.volume_unit || ""}`.trim()
    : "-";

  return {
    id: item.development_id,
    slug: item.slug,
    title: item.name,
    category: capitalize(item.category),
    status: mapStatus(item.status),
    year: item.year ? Number(item.year) : startDate ? Number(startDate.slice(0, 4)) : null,
    image: item.cover_image || "",
    shortDesc: (item.description || "").slice(0, 160),
    longDesc: item.description || "",
    location: item.address || "-",
    volume,
    latitude: Number(item.latitude) || null,
    longitude: Number(item.longitude) || null,
    documentationImage: item.cover_image || "",
    photos,
    budget: item.budget ?? 0,
    fundingSource: item.funding_source || "-",
    contractor: item.executor || "-",
    startDate,
    endDate: item.target_date || "",
    progress: highestPhoto,
    milestones: [],
  };
}

function mapMilestone(milestone) {
  return {
    title: milestone.title,
    date: milestone.date,
    done: Boolean(milestone.done ?? milestone.is_done),
  };
}

/* ============ DATA DUMMY ============*/
const USE_DUMMY_DATA = false;

let cache = null;

export async function fetchAllDevelopments() {
  if (USE_DUMMY_DATA) {
    cache = dummyDevelopments.map((item) => ({
      ...item,
      image: "",
      documentationImage: "",
      photos: buildPhotoSlots(),
    }));
    return cache;
  }
  const res = await api.get("/developments");
  cache = res.data.data.map(mapDevelopmentItem);
  return cache;
}

export async function getDevelopmentBySlug(slug) {
  if (!cache) await fetchAllDevelopments();
  return cache.find((item) => item.slug === slug) || null;
}

export async function getRelatedDevelopments(current, limit = 3) {
  if (!current) return [];
  if (!cache) await fetchAllDevelopments();
  return cache
    .filter((item) => item.slug !== current.slug && item.category === current.category)
    .slice(0, limit);
}