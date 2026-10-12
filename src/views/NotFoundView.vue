<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const secondsLeft = ref(2);
let redirectTimer;
let countdownTimer;

function goHome() {
  clearTimeout(redirectTimer);
  clearInterval(countdownTimer);
  router.replace({ name: "home" });
}

function followLink() {
  clearTimeout(redirectTimer);
  clearInterval(countdownTimer);
}

onMounted(() => {
  countdownTimer = window.setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) clearInterval(countdownTimer);
  }, 1000);

  redirectTimer = window.setTimeout(goHome, 2000);
});

onBeforeUnmount(() => {
  clearTimeout(redirectTimer);
  clearInterval(countdownTimer);
});

const publicLinks = [
  { label: "Layanan Mandiri", icon: "pi pi-file-edit", to: { name: "services" } },
  { label: "Berita Kalurahan", icon: "pi pi-megaphone", to: { name: "news" } },
  { label: "Agenda", icon: "pi pi-calendar", to: { name: "events" } },
  { label: "Aduan Masyarakat", icon: "pi pi-comments", to: { name: "complaints" } },
  { label: "Potensi Kalurahan", icon: "pi pi-chart-line", to: { name: "potential" } },
  { label: "Galeri", icon: "pi pi-images", to: { name: "gallery" } },
  { label: "Produk Hukum", icon: "pi pi-file", to: { name: "legal-products" } },
  { label: "Pembangunan", icon: "pi pi-building", to: { name: "development" } },
];
</script>

<template>
  <section class="py-12 sm:py-16">
    <div class="mx-auto max-w-3xl text-center">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-800 shadow-sm ring-1 ring-primary-100">
        <i class="pi pi-map-marker text-3xl" aria-hidden="true" />
      </div>

      <p class="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-secondary-500">Halaman tidak ditemukan</p>
      <h1 class="mt-2 text-6xl font-black tracking-tight text-primary-900 sm:text-7xl">404</h1>
      <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-text-muted">
        Halaman yang kamu cari tidak tersedia atau alamatnya sudah berubah.
        Kamu akan diarahkan ke Beranda dalam <b class="text-primary-900">{{ secondsLeft }} detik</b>.
      </p>

      <button
        type="button"
        class="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-800 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-900"
        @click="goHome"
      >
        <i class="pi pi-home" aria-hidden="true" />
        Kembali ke Beranda
      </button>

      <p class="mt-5 text-xs text-text-muted">
        Alamat yang dibuka: <code class="rounded bg-surface px-1.5 py-1">{{ route.fullPath }}</code>
      </p>
    </div>

    <div class="mx-auto mt-12 max-w-5xl rounded-3xl border border-border-default bg-surface p-5 shadow-sm sm:p-7">
      <div class="text-left">
        <p class="text-sm font-bold uppercase tracking-wide text-secondary-500">Tautan layanan publik</p>
        <h2 class="mt-1 text-xl font-bold text-primary-900">Mungkin kamu sedang mencari ini</h2>
      </div>

      <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <RouterLink
          v-for="link in publicLinks"
          :key="link.label"
          :to="link.to"
          class="flex items-center gap-3 rounded-2xl border border-border-default bg-bg px-4 py-3 text-left text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-900"
          @click="followLink"
        >
          <i :class="[link.icon, 'text-primary-700']" aria-hidden="true" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
