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

import villageLogo from "@/assets/logo-kalurahan-placeholder.svg";

const route = useRoute();

const moreSheetOpen = ref(false);
function handleBottomNavClick(item) {
  if (item.action === "more") moreSheetOpen.value = true;
}


function isActive(item) {
  return !!item.route && route.name === item.route.name;
}


const menubarPt = {
  root: { class: "!border-0 !bg-transparent !px-0 !py-3" },
  button: {
    class: "!text-white hover:!bg-white/10 hover:!text-white !w-10 !h-10 !rounded-lg transition-colors lg:!hidden",
  },
  rootList: {
    class:
      "!bg-white lg:!bg-transparent !border !border-border-default lg:!border-0 !shadow-lg lg:!shadow-none !rounded-xl lg:!rounded-none !p-2 lg:!p-0",
  },
  item: { class: "!w-full lg:!w-auto" },

  itemContent: (options) => ({
    class: [
      "!rounded-lg transition-colors",
      "hover:!bg-primary-50 lg:hover:!bg-white/10",
      options.context.active || options.context.focused ? "!bg-primary-50 lg:!bg-white/10" : "",
    ],
  }),
  itemLink: { class: "!px-3 !py-2.5 !gap-1.5" },
  submenu: {
    class:
      "lg:!bg-gradient-to-b lg:!from-primary-900 lg:!to-primary-800 lg:!border lg:!border-white/10 lg:!shadow-lg lg:!rounded-lg lg:!mt-1 lg:!py-1",
  },
};

// Passthrough Button "Unduh Dokumen": putih solid, teks & ikon biru tua.
const navCtaPt = {
  root: {
    class: "!bg-white !border-white hover:!bg-primary-50 hover:!border-primary-50 !rounded-lg transition-colors",
  },
};
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <!-- ============ NAVBAR ============ -->
    <header
      class="sticky top-0 z-40 bg-gradient-to-r from-primary-900 to-primary-800 border-b border-white/10 shadow-sm"
    >
      <div class="max-w-[1240px] mx-auto px-4 md:px-8">
        <Menubar :model="navMenuItems" :pt="menubarPt">
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
                <span v-bind="props.label" class="text-text-h lg:text-white font-bold text-sm">{{ item.label }}</span>
              </a>
            </RouterLink>
            <a v-else v-bind="props.action">
              <span v-bind="props.label" class="text-text-h lg:text-white font-bold text-sm">{{ item.label }}</span>
              <i
                v-if="hasSubmenu"
                v-bind="props.submenuicon"
                class="pi pi-angle-down ml-1 text-xs text-text-muted lg:text-white/70"
              />
            </a>
          </template>

          <template #end>
            <Button as="router-link" :to="navCta.route" :pt="navCtaPt" class="shrink-0 !px-3.5 sm:!px-4">
              <i :class="navCta.icon" class="pi text-[15px] text-primary-800" />
              <span class="hidden sm:inline ml-1.5 font-bold text-[13.5px] text-primary-800">{{ navCta.label }}</span>
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