import { onBeforeUnmount, onMounted, ref } from "vue";
import publicService from "@/services/publicService";

const defaults = {
  village_name: "Kalurahan Bimomartani",
  description:
    "Website resmi Pemerintah Kalurahan Bimomartani, Kapanewon Ngemplak, Kabupaten Sleman, Provinsi Daerah Istimewa Yogyakarta.",
  address: "Dusun Krajan, Bimomartani, Ngemplak, Sleman, D.I. Yogyakarta, 55584.",
  phone: "0812-3456-7890",
  email: "desa.bimomartani@slemankab.go.id",
  logo: null,
  stamp: null,
  social_media: [
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "YouTube", url: "#" },
    { platform: "WhatsApp", url: "#" },
  ],
};

const footer = ref({ ...defaults });
const apiOrigin = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/api\/?$/, "");
const FOOTER_REFRESH_INTERVAL = 15000;
const DEFAULT_FAVICON = "/favicon.svg";
let refreshTimer = null;
let refreshUsers = 0;
let requestInFlight = false;

export function mediaUrl(value, fallback = "") {
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return `${apiOrigin}${String(value).startsWith("/") ? "" : "/"}${value}`;
}

function syncFavicon(logo) {
  const href = mediaUrl(logo, DEFAULT_FAVICON);
  const pathname = new URL(href, window.location.origin).pathname.toLowerCase();
  const extension = pathname.split(".").pop();
  const mime = {
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
  }[extension] ?? "image/png";

  let iconLinks = [...document.querySelectorAll('link[rel~="icon"]')];
  if (!iconLinks.length) {
    const link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
    iconLinks = [link];
  }

  iconLinks.forEach((link) => {
    link.type = mime;
    link.href = href;
  });
}

async function loadFooter() {
  if (requestInFlight) return;
  requestInFlight = true;

  try {
    const response = await publicService.getFooterSettings();
    const data = response.data?.data;
    if (!data) return;

    footer.value = {
      ...defaults,
      ...data,
      social_media: Array.isArray(data.social_media) ? data.social_media : [],
    };
    syncFavicon(data.logo);
  } catch (error) {
    console.warn("Pengaturan footer belum dapat dimuat, menggunakan fallback.", error);
  } finally {
    requestInFlight = false;
  }
}

function refreshWhenVisible() {
  if (!document.hidden) loadFooter();
}

function startSync() {
  refreshUsers += 1;
  if (refreshUsers !== 1) return;

  loadFooter();
  refreshTimer = window.setInterval(loadFooter, FOOTER_REFRESH_INTERVAL);
  window.addEventListener("focus", loadFooter);
  document.addEventListener("visibilitychange", refreshWhenVisible);
}

function stopSync() {
  refreshUsers = Math.max(0, refreshUsers - 1);
  if (refreshUsers > 0) return;

  if (refreshTimer) window.clearInterval(refreshTimer);
  refreshTimer = null;
  window.removeEventListener("focus", loadFooter);
  document.removeEventListener("visibilitychange", refreshWhenVisible);
}

export function usePublicFooterSettings() {
  onMounted(startSync);
  onBeforeUnmount(stopSync);

  return { footer, mediaUrl };
}
