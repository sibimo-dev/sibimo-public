<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import {
  navMenuItems,
  navMenuItemsMobile,
  navCta,
  mobileBottomNav,
} from "@/components/shared/navMenu.js";
import AppFooter from "@/components/shared/AppFooter.vue";
import AnnouncementTicker from "@/components/shared/AnnouncementTicker.vue";

import villageLogo from "@/assets/logo-kalurahan-placeholder.svg";

const route = useRoute();

// Sinkron dengan breakpoint="1024px" milik Menubar di bawah.
const isDesktop = ref(true);
let mql;
function syncIsDesktop() {
  isDesktop.value = mql.matches;
}
onMounted(() => {
  mql = window.matchMedia("(min-width: 1024px)");
  syncIsDesktop();
  mql.addEventListener("change", syncIsDesktop);
});
onBeforeUnmount(() => {
  mql?.removeEventListener("change", syncIsDesktop);
});

// Desktop: navMenuItems lengkap (tampilan tidak berubah).
// Mobile (hamburger): hanya 5 item dari navMenuItemsMobile.
const menubarModel = computed(() =>
  isDesktop.value ? navMenuItems : navMenuItemsMobile
);

function isActive(item) {
  return !!item.route && route.name === item.route.name;
}

// Cek apakah item ini adalah "Beranda" (dipakai untuk styling khusus di bottom nav).
function isHome(item) {
  return item.route?.name === "home";
}

// Susun ulang item bottom nav supaya "Beranda" selalu berada tepat di tengah,
// apa pun urutan aslinya di navMenu.js.
const bottomNavItems = computed(() => {
  const items = [
    ...mobileBottomNav.filter((item) => item.action !== "more"),
    { label: navCta.label, icon: navCta.icon, route: navCta.route },
  ];

  const homeIndex = items.findIndex((item) => isHome(item));
  if (homeIndex === -1) return items;

  const homeItem = items[homeIndex];
  const rest = items.filter((_, i) => i !== homeIndex);
  const centerPos = Math.floor(items.length / 2);
  rest.splice(centerPos, 0, homeItem);
  return rest;
});

const menubarPt = {
  root: { class: "!border-0 !bg-transparent !px-0 !py-4 lg:!py-5 !flex !items-center !justify-between !w-full" },
  button: {
    class: "!bg-white !text-primary-900 hover:!bg-primary-50 !border-2 !border-primary-900 !w-10 !h-10 !rounded-lg transition-colors lg:!hidden !order-1 lg:!order-none !mr-3 lg:!mr-0 shrink-0",
  },
  rootList: {
    class:
      "!order-3 lg:!order-none !bg-white lg:!bg-transparent !border !border-border-default lg:!border-0 !shadow-lg lg:!shadow-none !rounded-xl lg:!rounded-none !p-2 lg:!p-0 lg:!flex lg:!flex-1 lg:!flex-nowrap lg:!items-center lg:!justify-center lg:!gap-1 xl:!gap-4",
  },
  item: { class: "!w-full lg:!w-auto lg:!shrink-0" },
  itemContent: (options) => ({
    class: [
      "!rounded-lg transition-colors",
      "hover:!bg-primary-50 lg:hover:!bg-transparent",
      options.context.active || options.context.focused ? "!bg-primary-50 lg:!bg-transparent" : "",
    ],
  }),
  itemLink: { class: "!px-3 !py-3 !gap-1.5 !whitespace-nowrap" },
  submenu: {
    class:
      "lg:!bg-gradient-to-b lg:!from-primary-900 lg:!to-primary-800 lg:!border lg:!border-white/10 lg:!shadow-lg lg:!rounded-lg lg:!mt-1 lg:!py-1",
  },
};

const navCtaPt = {
  root: {
    class: "!bg-white !border-white hover:!bg-primary-50 hover:!border-primary-50 !rounded-lg transition-colors",
  },
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <!-- ============ INFO BERJALAN, tampil di semua halaman ============ -->
    <AnnouncementTicker />

    <!-- ============ NAVBAR ============ -->
    <header
      class="sticky top-0 z-40 bg-gradient-to-r from-primary-900 to-primary-800 border-b border-white/10 shadow-sm"
    >

    <div class="max-w-[1350px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
      <Menubar :model="menubarModel" :pt="menubarPt" breakpoint="1024px">
          <template #start>
            <RouterLink
              :to="{ name: 'home' }"
              class="flex items-center gap-2.5 sm:gap-3 shrink-0 lg:mr-6 order-2 lg:order-none min-w-0"
            >
              <Avatar :image="villageLogo" shape="square" size="large" class="!w-10 !h-10 sm:!w-11 sm:!h-11 shrink-0" />
              <span class="flex flex-col leading-tight min-w-0">
                <b class="font-heading font-bold tracking-tight text-sm sm:text-lg uppercase text-white truncate">
                  Kalurahan Bimomartani
                </b>
                <small class="block text-[10px] sm:text-[11.5px] text-white/80 font-medium truncate">
                  Kapanewon Ngemplak, Kabupaten Sleman
                </small>
              </span>
            </RouterLink>
          </template>

           <template #item="{ item, props, hasSubmenu }">
            <RouterLink
              v-if="item.route && !hasSubmenu"
              v-slot="{ href, navigate, isActive: linkActive }"
              :to="item.route"
              custom
            >
              <a
                :href="href"
                v-bind="props.action"
                class="relative pb-1 border-b-2 border-transparent transition-colors lg:hover:border-white"
                :class="linkActive ? 'lg:border-white' : ''"
                @click="navigate"
              >
                <span v-bind="props.label" class="text-text-h lg:text-white !font-norrmal !text-[16px] !tracking-tight">{{ item.label }}</span>
              </a>
            </RouterLink>

            <a
              v-else
              v-bind="props.action"
              class="relative pb-1 border-b-2 border-transparent transition-colors lg:hover:border-white"
            >
              <span v-bind="props.label" class="text-text-h lg:text-white !font-normal !text-[16px] !tracking-tight">{{ item.label }}</span>
              <i
                v-if="hasSubmenu"
                v-bind="props.submenuicon"
                class="pi pi-angle-down ml-1 text-xs text-text-muted lg:text-white/70"
              />
            </a>
          </template>


          <!-- Tombol Unduh: cuma tampil di desktop (lg+), di mobile sudah ada di bottom nav -->
          <template #end>
            <Button
              as="router-link"
              :to="navCta.route"
              :pt="navCtaPt"
              class="!hidden lg:!inline-flex shrink-0 !px-4 sm:!px-5 !py-2.5 order-4 lg:order-none"
            >
              <i :class="navCta.icon" class="pi text-[15px] text-primary-800" />
              <span class="ml-1.5 font-bold text-sm text-primary-800">{{ navCta.label }}</span>
            </Button>
          </template>
        </Menubar>
      </div>
    </header>

    <!-- ============ KONTEN HALAMAN ============ -->
    <main class="flex-1 pb-[calc(var(--bottom-nav-h)+12px)] lg:pb-0">
      <div class="max-w-[1350px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <RouterView />
      </div>
    </main>

    <AppFooter class="pb-[calc(var(--bottom-nav-h)+12px)] lg:pb-8" />

    <!-- ============ BOTTOM NAV, mobile only ============ -->
    <nav
  class="lg:hidden fixed bottom-0 inset-x-0 z-40 h-[var(--bottom-nav-h)] bg-surface border-t border-border-default flex items-stretch"
  style="padding-bottom: env(safe-area-inset-bottom)"
  ><Button
  v-for="item in bottomNavItems"
  :key="item.label"
  as="router-link"
  :to="item.route"
  text
  class="!flex-1 !flex-col !gap-1 !rounded-none"
  :class="!isHome(item) ? (isActive(item) ? '!text-primary-800' : '!text-text') : '!text-primary-800'"
>
  <span
    class="flex items-center justify-center w-9 h-6 rounded-full transition-colors"
    :class="isHome(item) ? 'bg-primary-800' : (isActive(item) ? 'bg-primary-50' : '')"
  >
    <i :class="[item.icon, 'text-[19px]', isHome(item) ? 'text-white' : '']" />
  </span>
  <span class="text-[10.5px] font-bold" :class="isHome(item) ? 'text-primary-900' : ''">{{ item.label }}</span>
</Button>
</nav>
      
    
  </div>
</template>