<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Image from "primevue/image";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import {
  statusMeta,
  categoryIcon,
  formatCurrency,
  formatDate,
  getDevelopmentBySlug,
  getRelatedDevelopments,
} from "@/services/development.js";

const props = defineProps({
  slug: { type: String, required: true },
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const item = ref(null);
const related = ref([]);
const loading = ref(true);

const CATEGORY_PALETTE = [
  {
    cardTop: "border-t-4 border-sky-400",
    imageGradient: "from-sky-100 via-cyan-100 to-sky-200",
    badge: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30",
    accentText: "text-sky-600",
  },
  {
    cardTop: "border-t-4 border-rose-400",
    imageGradient: "from-rose-100 via-pink-100 to-rose-200",
    badge: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30",
    accentText: "text-rose-600",
  },
  {
    cardTop: "border-t-4 border-amber-400",
    imageGradient: "from-amber-100 via-orange-100 to-amber-200",
    badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30",
    accentText: "text-amber-600",
  },
  {
    cardTop: "border-t-4 border-violet-400",
    imageGradient: "from-violet-100 via-purple-100 to-violet-200",
    badge: "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30",
    accentText: "text-violet-600",
  },
  {
    cardTop: "border-t-4 border-emerald-400",
    imageGradient: "from-emerald-100 via-teal-100 to-emerald-200",
    badge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
    accentText: "text-emerald-600",
  },
];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getCategoryStyle(category) {
  if (!category) return CATEGORY_PALETTE[0];
  return CATEGORY_PALETTE[hashString(category) % CATEGORY_PALETTE.length];
}

const categoryStyle = computed(() => getCategoryStyle(item.value?.category));

const ICON_COLORS = ["text-sky-500", "text-rose-500", "text-amber-500", "text-violet-500", "text-emerald-500"];

const PHOTO_SEVERITY = { 0: "secondary", 50: "info", 100: "success" };

// ===== Peta lokasi (Leaflet) =====
const mapEl = ref(null);
let leafletMap = null;

function destroyMap() {
  leafletMap?.remove();
  leafletMap = null;
}

function initMap() {
  destroyMap();
  const current = item.value;
  if (!mapEl.value || !current?.latitude || !current?.longitude) return;

  const position = [current.latitude, current.longitude];
  leafletMap = L.map(mapEl.value, { scrollWheelZoom: false, zoomControl: true }).setView(position, 16);

  leafletMap.getPane("tilePane").style.zIndex = 1;
  leafletMap.getPane("overlayPane").style.zIndex = 4;
  leafletMap.getPane("markerPane").style.zIndex = 5;
  leafletMap.getPane("popupPane").style.zIndex = 6;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);

  leafletMap.on("click", () => leafletMap?.scrollWheelZoom.enable());
  mapEl.value.addEventListener("mouseleave", () => leafletMap?.scrollWheelZoom.disable());

  const popup = document.createElement("div");
  const popupTitle = document.createElement("b");
  popupTitle.textContent = current.title;
  popup.append(popupTitle, document.createElement("br"), document.createTextNode(current.location));

  L.marker(position).addTo(leafletMap).bindPopup(popup);
}

onBeforeUnmount(destroyMap);

const mapsUrl = computed(() =>
  item.value?.latitude ? `https://www.google.com/maps?q=${item.value.latitude},${item.value.longitude}` : ""
);

watch(
  () => props.slug,
  async (slug) => {
    loading.value = true;
    destroyMap();
    try {
      item.value = await getDevelopmentBySlug(slug);
      related.value = await getRelatedDevelopments(item.value);
    } catch (err) {
      console.error("Gagal memuat detail pembangunan:", err);
      item.value = null;
      related.value = [];
    } finally {
      loading.value = false;
    }
    await nextTick();
    initMap();
  },
  { immediate: true }
);

const photoSlots = computed(() =>
  item.value?.photos?.length
    ? item.value.photos
    : [0, 50, 100].map((percent) => ({ percent, image: "" }))
);

const infoRows = computed(() => {
  if (!item.value) return [];
  return [
    { label: "Nama Kegiatan", value: item.value.title, icon: "pi pi-tag" },
    { label: "Alamat", value: item.value.location, icon: "pi pi-map-marker" },
    { label: "Volume", value: item.value.volume, icon: "pi pi-box" },
    { label: "Anggaran", value: formatCurrency(item.value.budget), icon: "pi pi-wallet" },
    { label: "Sumber Dana", value: item.value.fundingSource, icon: "pi pi-briefcase" },
    { label: "Pelaksana", value: item.value.contractor, icon: "pi pi-users" },
    { label: "Tahun Anggaran", value: String(item.value.year), icon: "pi pi-calendar" },
    { label: "Mulai", value: formatDate(item.value.startDate), icon: "pi pi-play" },
    { label: "Target Selesai", value: formatDate(item.value.endDate), icon: "pi pi-flag" },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-8 py-6 lg:py-8">
    <!-- ===== LOADING ===== -->
    <div v-if="loading" class="flex justify-center py-20">
      <ProgressSpinner :strokeWidth="4" class="!h-10 !w-10" />
    </div>

    <!-- ===== NOT FOUND ===== -->
    <div v-else-if="!item" class="flex flex-col items-start gap-4 py-10">
      <Message severity="warn" icon="pi pi-exclamation-triangle" class="w-full">
        Data pembangunan yang kamu cari tidak ditemukan atau sudah dipindahkan.
      </Message>
      <Button
        as="router-link"
        :to="{ name: 'development' }"
        label="Kembali ke Pembangunan Kalurahan"
        icon="pi pi-arrow-left"
      />
    </div>

    <!-- ===== DETAIL ===== -->
    <template v-else>
      <Button
        as="router-link"
        :to="{ name: 'development' }"
        label="Kembali ke Pembangunan Kalurahan"
        icon="pi pi-arrow-left"
        text
        class="w-fit"
      />

      <!-- judul + deskripsi singkat -->
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <Tag
            :value="statusMeta[item.status].label"
            :severity="statusMeta[item.status].severity"
            :icon="statusMeta[item.status].icon"
          />
          <Tag
            :value="item.category"
            :icon="categoryIcon(item.category)"
            unstyled
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
            :class="categoryStyle.badge"
          />
        </div>

        <h1
          class="bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent md:text-3xl"
        >
          {{ item.title }}
        </h1>

        <div class="flex items-center gap-1.5 text-sm font-medium text-muted">
          <i class="pi pi-map-marker" :class="categoryStyle.accentText" />
          {{ item.location }}
        </div>

        <p class="text-sm leading-relaxed text-default md:text-[15px]">{{ item.longDesc }}</p>
      </div>

      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px] lg:gap-8">
        <!-- ===== foto dokumentasi besar + 3 foto progres ===== -->
        <div class="flex flex-col gap-4">
          <div
            class="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-2xl border border-border-default bg-gradient-to-br lg:aspect-auto lg:h-[760px]"
            :class="item.documentationImage ? 'bg-surface' : categoryStyle.imageGradient"
          >
            <Image
              v-if="item.documentationImage"
              :src="item.documentationImage"
              :alt="`Dokumentasi ${item.title}`"
              preview
              class="!block h-full w-full"
              imageClass="h-full w-full object-contain"
            />
            <div v-else class="flex flex-col items-center gap-2" :class="categoryStyle.accentText">
              <i class="pi pi-image text-5xl" />
              <span class="text-sm">Foto dokumentasi belum diunggah</span>
            </div>
          </div>

          <!-- 3 kotak: foto progres 0%, 50%, 100% -->
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="photo in photoSlots"
              :key="photo.percent"
              class="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-border-default bg-gradient-to-br"
              :class="photo.image ? 'bg-surface-hover' : categoryStyle.imageGradient"
            >
              <Image
                v-if="photo.image"
                :src="photo.image"
                :alt="`Foto progres ${photo.percent}% - ${item.title}`"
                preview
                class="!block h-full w-full"
                imageClass="h-full w-full object-cover"
              />
              <i v-else class="pi pi-image text-2xl" :class="categoryStyle.accentText" />

              <Tag
                :value="`${photo.percent}%`"
                :severity="PHOTO_SEVERITY[photo.percent]"
                class="absolute left-2 top-2"
              />
            </div>
          </div>
        </div>

        <!-- ===== informasi kegiatan + peta ===== -->
        <div class="flex flex-col gap-6">
          <Card :class="categoryStyle.cardTop">
            <template #title>
              <span class="text-xs font-semibold uppercase tracking-wide" :class="categoryStyle.accentText">
                Informasi Kegiatan
              </span>
            </template>
            <template #content>
              <div v-for="(row, index) in infoRows" :key="row.label">
                <Divider v-if="index > 0" class="!my-3" />
                <div class="flex items-start gap-3">
                  <i :class="[row.icon, ICON_COLORS[index % ICON_COLORS.length]]" class="mt-0.5 text-sm" />
                  <div class="min-w-0">
                    <p class="text-xs font-medium text-muted">{{ row.label }}</p>
                    <p class="mt-0.5 text-sm font-semibold text-heading">{{ row.value }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <Card v-if="item.latitude && item.longitude" class="border-t-4 border-violet-400">
            <template #title>
              <span class="text-xs font-semibold uppercase tracking-wide text-violet-600">Lokasi Pembangunan</span>
            </template>
            <template #content>
              <div ref="mapEl" class="relative isolate z-0 h-60 w-full overflow-hidden rounded-xl" />
              <Button
                as="a"
                :href="mapsUrl"
                target="_blank"
                rel="noopener"
                label="Buka di Google Maps"
                icon="pi pi-external-link"
                outlined
                class="mt-4 w-full"
              />
            </template>
          </Card>
        </div>
      </div>

      <!-- related -->
      <div v-if="related.length" class="flex flex-col gap-5">
        <h2
          class="bg-gradient-to-r from-primary-600 via-sky-500 to-emerald-500 bg-clip-text text-lg font-bold text-transparent"
        >
          Pembangunan Lainnya
        </h2>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="relatedItem in related"
            :key="relatedItem.slug"
            :class="getCategoryStyle(relatedItem.category).cardTop"
          >
            <template #title>
              <span class="line-clamp-2 text-base font-bold leading-snug text-heading">{{ relatedItem.title }}</span>
            </template>
            <template #subtitle>
              <span class="flex items-center gap-1.5 text-xs text-muted">
                <i class="pi pi-map-marker" :class="getCategoryStyle(relatedItem.category).accentText" />
                <span class="truncate">{{ relatedItem.location }}</span>
              </span>
            </template>
            <template #content>
              <Tag
                :value="statusMeta[relatedItem.status].label"
                :severity="statusMeta[relatedItem.status].severity"
                :icon="statusMeta[relatedItem.status].icon"
              />
              <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{{ relatedItem.shortDesc }}</p>
            </template>
            <template #footer>
              <Button
                as="router-link"
                :to="{ name: 'development-detail', params: { slug: relatedItem.slug } }"
                label="Lihat Detail"
                icon="pi pi-arrow-right"
                iconPos="right"
                outlined
                class="w-full"
              />
            </template>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>