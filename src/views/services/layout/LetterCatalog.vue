<script setup>
/* Katalog layanan (hero + search + tab kategori + grid kartu pastel).
   Dipakai oleh Layanan Umum & Perizinan supaya tampilannya sama. */
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import ServiceCard from "./ServiceCard.vue";
import { HUES, hueForCategory } from "./pastel";

const props = defineProps({
  heading: { type: String, required: true },
  subtitle: { type: String, default: "" },
  services: { type: Array, required: true },
  categories: { type: Array, default: null }, // null = tanpa tab kategori
  totalLabel: { type: String, default: "Total Permohonan" },
  total: { type: Number, default: 0 },
  searchPlaceholder: { type: String, default: "Ketik jenis surat..." },
  topLeft: { type: String, default: "" }, // teks kecil di atas hero
  backLabel: { type: String, default: "" },
  fixedHue: { type: String, default: "" }, // bila diisi, semua kartu & tab memakai hue ini (mis. Perizinan)
});
const emit = defineEmits(["select", "back", "top-action"]);

const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const activeCategory = ref(
  props.categories?.some((c) => c.value === route.query.category)
    ? route.query.category
    : props.categories?.[0]?.value ?? null,
);

watch(() => route.query.category, (q) => {
  if (q && q !== activeCategory.value) activeCategory.value = q;
});

// warna kategori seragam: permohonan = biru, keterangan = pink, dst. (lihat CATEGORY_HUES di pastel.js)
const hueOfCategory = (category) => props.fixedHue || hueForCategory(category.value, category.label);
const tabHue = (category) => HUES[hueOfCategory(category)];
const cardHue = (service) =>
  props.fixedHue || hueForCategory(service.category, props.categories?.find((c) => c.value === service.category)?.label);

function selectCategory(value) {
  activeCategory.value = value;
  router.replace({ query: { ...route.query, category: value } });
}

const filtered = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  return props.services.filter((s) => {
    const okCategory = !props.categories || s.category === activeCategory.value;
    const okKeyword = !keyword
      || s.title.toLowerCase().includes(keyword)
      || (s.shortCode ?? "").toLowerCase().includes(keyword)
      || s.description.toLowerCase().includes(keyword)
      || (s.keywords ?? []).some((k) => k.toLowerCase().includes(keyword));
    return okCategory && okKeyword;
  });
});
</script>

<template>
  <div class="relative">
    <!-- latar pastel lembut -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-violet-50 via-sky-50/60 to-transparent" />

    <div class="relative p-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between gap-3 mb-4">
        <p class="text-xs text-[var(--color-text-muted)]">
          <slot name="top-left" />
        </p>
        <slot name="top-action" />
      </div>

      <!-- Hero (warna navy seperti versi lama) -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2d5580] p-6 sm:p-8 shadow-sm">
        <span class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span class="pointer-events-none absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-white/10" />

        <div class="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold !text-white">{{ heading }}</h1>
            <p class="text-sm mt-1 max-w-xl !text-white/85">{{ subtitle }}</p>
          </div>

          <div v-if="total" class="flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur px-4 py-3 shrink-0 shadow-lg">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f]">
              <i class="pi pi-file" />
            </span>
            <div class="leading-tight">
              <p class="text-[10px] tracking-wide uppercase text-[var(--color-text-muted)]">{{ totalLabel }}</p>
              <p class="text-lg font-semibold text-[var(--color-text-h)]">{{ total.toLocaleString("id-ID") }}</p>
            </div>
          </div>
        </div>
      </div>

      <slot name="notice" />

      <!-- Search -->
      <div class="mt-6 rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6 shadow-sm">
        <label class="text-sm font-semibold text-[var(--color-text-h)] flex items-center gap-2" for="service-search">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-sky-200 text-sky-700"><i class="pi pi-search text-xs" /></span>
          Cari Layanan Mandiri
        </label>
        <IconField class="mt-3 block">
          <InputIcon class="pi pi-search" />
          <InputText
            id="service-search"
            v-model="searchQuery"
            class="w-full !border-2 !border-sky-200 focus:!border-sky-400 !rounded-xl !py-3 !bg-white"
            :placeholder="searchPlaceholder"
          />
        </IconField>
      </div>

      <!-- Tab kategori -->
      <div v-if="categories" class="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3" role="group" aria-label="Kategori surat">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          class="w-full sm:w-auto min-w-0 truncate rounded-full border-2 px-4 py-2 text-center text-sm font-medium leading-5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:px-5"
          :class="activeCategory === category.value ? tabHue(category).chipOn : tabHue(category).chipOff"
          :aria-pressed="activeCategory === category.value"
          @click="selectCategory(category.value)"
        >
          {{ category.label }}
        </button>
      </div>

      <!-- Grid -->
      <div v-if="filtered.length" class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServiceCard v-for="s in filtered" :key="s.slug" :service="s" :hue="cardHue(s)" @select="emit('select', $event)" />
      </div>

      <div v-else class="mt-6 rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-10 text-center">
        <i class="pi pi-inbox text-2xl text-amber-500" />
        <p class="mt-3 text-sm text-[var(--color-text-muted)]">
          Tidak ada layanan surat yang cocok dengan pencarian atau kategori ini.
        </p>
      </div>
    </div>
  </div>
</template>