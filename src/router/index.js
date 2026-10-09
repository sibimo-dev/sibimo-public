import { createRouter, createWebHistory, START_LOCATION } from "vue-router";
import servicesRoutes from "./routes/services.routes";
import { setupGuards } from "./guards";

const routes = [
  { path: "/", name: "home", component: () => import("@/views/home/HomeView.vue") },
  { path: "/profile", name: "profile", component: () => import("@/views/profile/ProfileView.vue") },

  // Peta kalurahan ada di halaman Profil (section #wilayah).
  // Route "map" dipakai menu navbar, jadi diarahkan ke sana.
  { path: "/map", name: "map", redirect: { name: "profile", hash: "#wilayah" } },

  ...servicesRoutes,

  { path: "/my-documents", name: "my-documents", component: () => import("@/views/documents/MyDocumentsView.vue") },
  { path: "/complaints", name: "complaints", component: () => import("@/views/complaints/ComplaintListView.vue") },
  { path: "/complaints/create", name: "complaints-form", component: () => import("@/views/complaints/ComplaintFormView.vue") },
  { path: "/news", name: "news", component: () => import("@/views/news/NewsListView.vue") },
  { path: "/news/:slug", name: "news-detail", component: () => import("@/views/news/NewsDetailView.vue"), props: true },
  { path: "/events", name: "events", component: () => import("@/views/events/EventsListView.vue") },
  { path: "/events/:month", name: "events-detail", component: () => import("@/views/events/EventsDetail.vue"), props: true },
  { path: "/gallery", name: "gallery", component: () => import("@/views/gallery/GalleryView.vue") },
  { path: "/potential", name: "potential", component: () => import("@/views/potential/PotentialView.vue") },
  { path: "/potential/:slug", name: "potential-detail", component: () => import("@/views/potential/PotentialDetailView.vue"), props: true },
  { path: "/legal-products", name: "legal-products", component: () => import("@/views/legal/LegalProductsView.vue") },
  { path: "/development", name: "development", component: () => import("@/views/development/DevelopmentView.vue") },
  { path: "/development/:slug", name: "development-detail", component: () => import("@/views/development/DevelopmentDetailView.vue"), props: true },
  { path: "/data", name: "data", component: () => import("@/views/data/DataView.vue") },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFoundView.vue") },
];

/* True kalau halaman dibuka lewat tombol reload (F5 / Ctrl+R) */
function isPageReload() {
  const nav = performance.getEntriesByType?.("navigation")?.[0];
  return nav?.type === "reload";
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Reload: mulai dari atas (kecuali URL punya #hash), bukan di posisi lama
    if (from === START_LOCATION && isPageReload() && !to.hash) {
      return { top: 0 };
    }
    // Tombol back/forward: kembali ke posisi scroll sebelumnya
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 80, behavior: "smooth" };
    return { top: 0 };
  },
});

setupGuards(router);

export default router;