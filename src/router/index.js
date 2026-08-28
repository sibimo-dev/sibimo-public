import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home/HomeView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/profile/ProfileView.vue"),
  },
  {
    path: "/services",
    name: "services",
    component: () => import("@/views/services/ServicesView.vue"),
  },
  {

    path: "/services/apply/:type",
    component: () => import("@/views/services/ApplyLetterLayout.vue"),
    props: true,
    children: [
      { path: "", redirect: (to) => ({ name: "apply-personal-data", params: to.params }) },
      {
        path: "personal-data",
        name: "apply-personal-data",
        component: () => import("@/views/services/ApplyPersonalData.vue"),
      },
      {
        path: "documents",
        name: "apply-documents",
        component: () => import("@/views/services/ApplyDocuments.vue"),
      },
      {
        path: "confirmation",
        name: "apply-confirmation",
        component: () => import("@/views/services/ApplyConfirmation.vue"),
      },
    ],
  },
  {
    path: "/my-documents",
    name: "my-documents",
    component: () => import("@/views/documents/MyDocumentsView.vue"),
  },
  {
    path: "/complaints",
    name: "complaints",
    component: () => import("@/views/complaints/ComplaintFormView.vue"),
  },
  {
    path: "/news",
    name: "news",
    component: () => import("@/views/news/NewsListView.vue"),
  },
  {
    path: "/news/:slug",
    name: "news-detail",
    component: () => import("@/views/news/NewsDetailView.vue"),
    props: true,
  },
  {
    
    path: "/events",
    name: "events",
    component: () => import("@/views/events/EventsListView.vue"),
  },
  {
    path: "/events/:month",
    name: "events-detail",
    component: () => import("@/views/events/EventsDetail.vue"),
    props: true,
  },
  {
    path: "/gallery",
    name: "gallery",
    component: () => import("@/views/gallery/GalleryView.vue"),
  },
  {
    path: "/potential",
    name: "potential",
    component: () => import("@/views/potential/PotentialView.vue"),
  },
  {
    path: "/potential/:slug",
    name: "potential-detail",
    component: () => import("@/views/potential/PotentialDetailView.vue"),
    props: true,
  },
  {
    path: "/data",
    name: "data",
    component: () => import("@/views/data/DataView.vue"),
  },
  
  
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 80, behavior: "smooth" };
    return { top: 0 };
  },
});

export default router;