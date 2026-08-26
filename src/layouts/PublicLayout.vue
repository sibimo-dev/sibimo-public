<script setup>
import { ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Drawer from "primevue/drawer";
import {
  navMenuItems,
  navCta,
  mobileBottomNav,
  mobileMoreLinks,
} from "@/components/shared/navMenu.js";
import AppFooter from "@/components/shared/AppFooter.vue";

// TODO: ganti dengan logo resmi kalurahan. Taruh file gambarnya di
// src/assets/ (mis. logo-kalurahan.png) lalu ganti import di bawah ini.
// File placeholder ini cuma penanda tempat sampai logo aslinya tersedia.
import villageLogo from "@/assets/logo-kalurahan-placeholder.svg";

const route = useRoute();

// Bottom sheet "Lainnya" di mobile
const moreSheetOpen = ref(false);
function handleBottomNavClick(item) {
  if (item.action === "more") moreSheetOpen.value = true;
}

// Item bottom-nav aktif ditandai berdasarkan route name saat ini, biar
// warna/kontrasnya jelas menunjukkan posisi user (bukan cuma warna
// abu-abu redup semua seperti sebelumnya).
function isActive(item) {
  return !!item.route && route.name === item.route.name;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <!-- ============ NAVBAR ============ -->
    <header
      class="sticky top-0 z-40 bg-gradient-to-r from-primary-900 to-primary-800 border-b border-white/10 shadow-sm"
    >
      <div class="max-w-[1240px] mx-auto px-4 md:px-8">
        <Menubar :model="navMenuItems" class="app-menubar app-menubar-dark !border-0 !bg-transparent !px-0 !py-3">
          <template #start>
            <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2.5 shrink-0 mr-4">
              <Avatar :image="villageLogo" shape="square" size="large" class="!w-10 !h-10 shrink-0" />
              <span class="hidden sm:flex flex-col leading-tight">
                <b class="font-brand text-[16.5px] uppercase tracking-tight text-white">Kalurahan Bimomartani</b>
                <small class="text-[10.5px] text-white/80 font-medium">
                  Kapanewon Ngemplak, Kabupaten Sleman
                </small>
              </span>
            </RouterLink>
          </template>

          <template #item="{ item, props, hasSubmenu }">
            <RouterLink v-if="item.route && !hasSubmenu" v-slot="{ href, navigate }" :to="item.route" custom>
              <a :href="href" v-bind="props.action" @click="navigate">
                <span class="text-white">{{ item.label }}</span>
              </a>
            </RouterLink>
            <a v-else v-bind="props.action">
              <span class="text-white">{{ item.label }}</span>
              <i v-if="hasSubmenu" class="pi pi-angle-down ml-1 text-xs text-white/70" />
            </a>
          </template>

          <template #end>
            <Button
            as="router-link"
            :to="navCta.route"
            class="!bg-white !border-white !text-primary-800 hover:!bg-primary-50 shrink-0 !px-3.5 sm:!px-4 !rounded-lg transition-colors"
            >
            <i :class="navCta.icon" class="pi text-[15px] !text-primary-800" />
            <span class="hidden sm:inline ml-1.5 font-bold text-[13.5px] !text-primary-800">{{ navCta.label }}</span>
          </Button>
        </template>
        </Menubar>
      </div>
    </header>

    <!-- ============ KONTEN HALAMAN ============ -->
    <main class="flex-1 pb-[calc(var(--bottom-nav-h)+12px)] lg:pb-0">
      <div class="max-w-[1240px] mx-auto px-4 md:px-8">
        <RouterView />
      </div>
    </main>

    <AppFooter class="pb-[calc(var(--bottom-nav-h)+12px)] lg:pb-8" />

    <!-- ============ BOTTOM NAV, mobile only ============ -->
    <nav
      class="lg:hidden fixed bottom-0 inset-x-0 z-40 h-[var(--bottom-nav-h)] bg-surface border-t border-border-default flex items-stretch"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <template v-for="item in mobileBottomNav" :key="item.label">
        <Button
          v-if="item.action"
          text
          class="!flex-1 !flex-col !gap-1 !text-text !rounded-none"
          :class="item.action === 'more' && moreSheetOpen ? '!text-primary-800' : ''"
          @click="handleBottomNavClick(item)"
        >
          <i :class="item.icon" class="text-[19px]" />
          <span class="text-[10.5px] font-bold">{{ item.label }}</span>
        </Button>
        <Button
          v-else
          as="router-link"
          :to="item.route"
          text
          class="!flex-1 !flex-col !gap-1 !rounded-none"
          :class="isActive(item) ? '!text-primary-800' : '!text-text'"
        >
          <span
            class="flex items-center justify-center w-9 h-6 rounded-full transition-colors"
            :class="isActive(item) ? 'bg-primary-50' : ''"
          >
            <i :class="item.icon" class="text-[19px]" />
          </span>
          <span class="text-[10.5px] font-bold">{{ item.label }}</span>
        </Button>
      </template>
    </nav>

    <!-- ============ BOTTOM SHEET "LAINNYA", mobile only ============ -->
    <Drawer v-model:visible="moreSheetOpen" position="bottom" class="lg:hidden !h-auto !max-h-[70vh] !rounded-t-3xl">
      <template #header>
        <h3 class="text-sm font-bold text-heading">Menu Lainnya</h3>
      </template>
      <RouterLink
        v-for="item in mobileMoreLinks"
        :key="item.label"
        :to="item.route"
        class="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-surface-hover transition-colors"
        @click="moreSheetOpen = false"
      >
        <Avatar :icon="item.icon" shape="circle" class="!bg-primary-50 !text-primary-700 shrink-0" />
        <span class="text-sm font-semibold text-default">{{ item.label }}</span>
      </RouterLink>
    </Drawer>
  </div>
</template>

<style scoped>
/*
 * Navbar atas (PrimeVue Menubar) di mobile: hamburger + item dropdown
 * bawaan tema Aura warnanya abu-abu redup dan tipis. Dipertegas di sini
 * biar kebaca jelas di layar kecil, tanpa mengubah tampilan desktop.
 */
.app-menubar :deep(.p-menubar-button) {
  color: var(--color-primary-900);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
}

.app-menubar :deep(.p-menubar-button:hover) {
  background: var(--color-primary-50);
  color: var(--color-primary-900);
}

.app-menubar :deep(.p-menubar-button svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.app-menubar :deep(.p-menubar-mobile .p-menubar-root-list) {
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 24px rgba(20, 31, 51, 0.12);
}

.app-menubar :deep(.p-menubar-item-link) {
  padding: 0.85rem 1rem;
}

.app-menubar :deep(.p-menubar-item-label) {
  font-weight: 700;
  font-size: 14px;
  color: var(--color-text-h);
}

.app-menubar :deep(.p-menubar-item-icon),
.app-menubar :deep(.p-menubar-submenu-icon) {
  color: var(--color-text-muted);
}

.app-menubar :deep(.p-menubar-item-active > .p-menubar-item-content .p-menubar-item-label) {
  color: var(--color-primary-800);
}

/*
 * Varian gelap untuk navbar (bg gradasi primary-900→800, disamakan dengan
 * footer). Item top-level: teks putih, hover pakai overlay putih
 * transparan tipis — !important dipakai karena style hover bawaan Aura
 * punya spesifisitas lebih tinggi dan sebelumnya menang, bikin teks jadi
 * invisible di atas kotak putih solid.
 */
.app-menubar-dark :deep(.p-menubar-item-label) {
  color: #fff !important;
  font-weight: 700;
}

.app-menubar-dark :deep(.p-menubar-item-icon),
.app-menubar-dark :deep(.p-menubar-submenu-icon) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.app-menubar-dark :deep(.p-menubar-item-content) {
  background: transparent !important;
}

.app-menubar-dark :deep(.p-menubar-item-content:hover) {
  background: rgba(255, 255, 255, 0.12) !important;
}

.app-menubar-dark :deep(.p-menubar-item-content:hover .p-menubar-item-label),
.app-menubar-dark :deep(.p-menubar-item-content:hover .p-menubar-submenu-icon) {
  color: #fff !important;
}

.app-menubar-dark :deep(.p-menubar-item-active > .p-menubar-item-content .p-menubar-item-label) {
  color: #fff !important;
}

.app-menubar-dark :deep(.p-menubar-button) {
  color: #fff;
}

.app-menubar-dark :deep(.p-menubar-button:hover) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

/* Panel dropdown submenu (desktop flyout, mis. "Profil Desa" / "Informasi"):
   biru tua senada background navbar, teks putih senada item lain, berat
   font disamakan (700) supaya konsisten dengan item top-level. */
.app-menubar-dark :deep(.p-menubar-submenu) {
  background: linear-gradient(180deg, var(--color-primary-900), var(--color-primary-800));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 24px rgba(20, 31, 51, 0.35);
}

.app-menubar-dark :deep(.p-menubar-submenu .p-menubar-item-label) {
  color: #fff !important;
  font-weight: 700;
}

.app-menubar-dark :deep(.p-menubar-submenu .p-menubar-item-icon) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.app-menubar-dark :deep(.p-menubar-submenu .p-menubar-item-content:hover) {
  background: rgba(255, 255, 255, 0.1) !important;
}

.app-menubar-dark :deep(.p-menubar-submenu .p-menubar-item-content:hover .p-menubar-item-label) {
  color: var(--color-secondary-300) !important;
}

/* Panel hamburger mobile tetap terang (lebih gampang dibaca sebagai
   layar penuh di HP), jadi dipisah dari style submenu desktop di atas. */
.app-menubar-dark :deep(.p-menubar-mobile .p-menubar-root-list) {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 24px rgba(20, 31, 51, 0.18);
}

.app-menubar-dark :deep(.p-menubar-mobile .p-menubar-item-label) {
  color: var(--color-text-h) !important;
}

.app-menubar-dark :deep(.p-menubar-mobile .p-menubar-item-icon) {
  color: var(--color-text-muted) !important;
}

.app-menubar-dark :deep(.p-menubar-mobile .p-menubar-item-content:hover .p-menubar-item-label) {
  color: var(--color-primary-800) !important;
}
</style>