<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { RouterLink } from "vue-router";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from "primevue/select";
import Paginator from "primevue/paginator";
import Message from "primevue/message";
import Button from "primevue/button";
import ProgressSpinner from "primevue/progressspinner";
import Image from "primevue/image";
import Tag from "primevue/tag";
import api from "@/services/api";
import { fetchAllDevelopments, developmentStatusOptions, statusMeta, categoryIcon, formatDate } from "@/services/development.js";

const developments = ref([]);
const apiCategories = ref([]);
const loading = ref(true);
const hasError = ref(false);

async function loadCategories() {
  try {
    const response = await api.get("/development-categories");
    apiCategories.value = response.data.data ?? [];
  } catch (err) {
    apiCategories.value = [];
  }
}

onMounted(async () => {
  try {
    const [list] = await Promise.all([fetchAllDevelopments(), loadCategories()]);
    developments.value = list;
  } catch (err) {
    console.error("Gagal memuat data pembangunan:", err);
    hasError.value = true;
  } finally {
    loading.value = false;
  }
});

const searchQuery = ref("");
const activeStatus = ref("all");
const activeCategory = ref("all");
const activeYear = ref("all");

const pageSize = 6;
const currentPage = ref(1);

const categoryOptions = computed(() => {
  const fromApi = apiCategories.value.map((category) => category.name);
  const fromData = developments.value.map((item) => item.category);
  const names = [...new Set([...fromApi, ...fromData].filter(Boolean))];
  return [{ label: "Semua Kategori", value: "all" }, ...names.map((name) => ({ label: name, value: name }))];
});

const yearOptions = computed(() => [
  { label: "Semua Tahun", value: "all" },
  ...[...new Set(developments.value.map((item) => item.year).filter(Boolean))]
    .sort((a, b) => b - a)
    .map((year) => ({ label: String(year), value: year })),
]);

const selectedStatusLabel = computed(() => {
  if (activeStatus.value === "all") return "Semua";
  return developmentStatusOptions.find((option) => option.value === activeStatus.value)?.label ?? "Semua";
});

const selectedYearLabel = computed(() => (activeYear.value === "all" ? "Semua" : String(activeYear.value)));

const filteredDevelopments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return developments.value.filter((item) => {
    if (activeStatus.value !== "all" && item.status !== activeStatus.value) return false;
    if (activeCategory.value !== "all" && item.category !== activeCategory.value) return false;
    if (activeYear.value !== "all" && item.year !== activeYear.value) return false;
    if (!query) return true;
    return item.title.toLowerCase().includes(query) || item.location.toLowerCase().includes(query);
  });
});

const pagedDevelopments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredDevelopments.value.slice(start, start + pageSize);
});

const hasActiveFilter = computed(
  () =>
    searchQuery.value.trim() !== "" ||
    activeStatus.value !== "all" ||
    activeCategory.value !== "all" ||
    activeYear.value !== "all"
);

function onPageChange(event) {
  currentPage.value = event.page + 1;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetFilters() {
  searchQuery.value = "";
  activeStatus.value = "all";
  activeCategory.value = "all";
  activeYear.value = "all";
}

watch([searchQuery, activeStatus, activeCategory, activeYear], () => {
  currentPage.value = 1;
});

const CATEGORY_PALETTE = [
  {
    topBar: "bg-gradient-to-r from-sky-400 to-cyan-500",
    imageGradient: "from-sky-100 via-cyan-100 to-sky-200",
    badge: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30",
    softBadge: "bg-sky-50 text-sky-700 border border-sky-200",
    hoverRing: "hover:border-sky-300",
    tabActive: "border-sky-500 bg-sky-500 text-white shadow-sky-500/30",
    tabIdle: "border-border-default bg-surface text-default hover:border-sky-300 hover:bg-sky-50",
    dot: "bg-sky-500",
  },
  {
    topBar: "bg-gradient-to-r from-rose-400 to-pink-500",
    imageGradient: "from-rose-100 via-pink-100 to-rose-200",
    badge: "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30",
    softBadge: "bg-rose-50 text-rose-700 border border-rose-200",
    hoverRing: "hover:border-rose-300",
    tabActive: "border-rose-500 bg-rose-500 text-white shadow-rose-500/30",
    tabIdle: "border-border-default bg-surface text-default hover:border-rose-300 hover:bg-rose-50",
    dot: "bg-rose-500",
  },
  {
    topBar: "bg-gradient-to-r from-amber-400 to-orange-500",
    imageGradient: "from-amber-100 via-orange-100 to-amber-200",
    badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30",
    softBadge: "bg-amber-50 text-amber-700 border border-amber-200",
    hoverRing: "hover:border-amber-300",
    tabActive: "border-amber-500 bg-amber-500 text-white shadow-amber-500/30",
    tabIdle: "border-border-default bg-surface text-default hover:border-amber-300 hover:bg-amber-50",
    dot: "bg-amber-500",
  },
  {
    topBar: "bg-gradient-to-r from-violet-400 to-purple-500",
    imageGradient: "from-violet-100 via-purple-100 to-violet-200",
    badge: "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30",
    softBadge: "bg-violet-50 text-violet-700 border border-violet-200",
    hoverRing: "hover:border-violet-300",
    tabActive: "border-violet-500 bg-violet-500 text-white shadow-violet-500/30",
    tabIdle: "border-border-default bg-surface text-default hover:border-violet-300 hover:bg-violet-50",
    dot: "bg-violet-500",
  },
  {
    topBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    imageGradient: "from-emerald-100 via-teal-100 to-emerald-200",
    badge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
    softBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    hoverRing: "hover:border-emerald-300",
    tabActive: "border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30",
    tabIdle: "border-border-default bg-surface text-default hover:border-emerald-300 hover:bg-emerald-50",
    dot: "bg-emerald-500",
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

const ALL_TAB_ACTIVE = "border-slate-800 bg-slate-800 text-white shadow-slate-800/30";
const ALL_TAB_IDLE = "border-border-default bg-surface text-default hover:border-slate-300 hover:bg-slate-50";

function getTabClass(option, isActive) {
  const isAll = option.value === "all";
  if (isActive) return [isAll ? ALL_TAB_ACTIVE : getCategoryStyle(option.value).tabActive, "shadow-md"];
  return isAll ? ALL_TAB_IDLE : getCategoryStyle(option.value).tabIdle;
}

watch(
  () => categoryOptions.value.length,
  () => nextTick(updateScrollState)
);

const tabsRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
let tabsResizeObserver = null

const leftArrowClass = ref("bg-slate-800")
const rightArrowClass = ref("bg-slate-800")

function arrowClassFor(option) {
  return option.value === "all" ? "bg-slate-800" : getCategoryStyle(option.value).dot
}

function findChipIndexAt(x) {
  const chips = Array.from(tabsRef.value.children)
  let nearestIndex = 0
  let nearestDistance = Infinity
  chips.forEach((chip, index) => {
    const rect = chip.getBoundingClientRect()
    const distance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0
    if (distance < nearestDistance) {
      nearestIndex = index
      nearestDistance = distance
    }
  })
  return nearestIndex
}

function updateScrollState() {
  const el = tabsRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
  const rect = el.getBoundingClientRect()
  const leftOption = categoryOptions.value[findChipIndexAt(rect.left + 24)]
  const rightOption = categoryOptions.value[findChipIndexAt(rect.right - 24)]
  if (leftOption) leftArrowClass.value = arrowClassFor(leftOption)
  if (rightOption) rightArrowClass.value = arrowClassFor(rightOption)
}

function scrollTabs(direction) {
  const el = tabsRef.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" })
}

function selectCategory(value, event) {
  activeCategory.value = value
  event?.currentTarget?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
}

const tabsMaskClass = computed(() => {
  if (canScrollLeft.value && canScrollRight.value) {
    return "[mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)]"
  }
  if (canScrollRight.value) return "[mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)]"
  if (canScrollLeft.value) return "[mask-image:linear-gradient(to_left,black_calc(100%-3rem),transparent)]"
  return ""
})

onMounted(() => {
  updateScrollState()
  tabsResizeObserver = new ResizeObserver(updateScrollState)
  if (tabsRef.value) tabsResizeObserver.observe(tabsRef.value)
})

onBeforeUnmount(() => {
  tabsResizeObserver?.disconnect()
})
</script>

<template>
  <div class="relative flex flex-col gap-8 overflow-hidden py-6 lg:py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 animate-pulse rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-64 -z-10 h-64 w-64 animate-pulse rounded-full bg-rose-400/10 blur-3xl [animation-delay:0.4s]" />
    <div class="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-56 w-56 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:0.8s]" />

    <Transition
      appear
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-sky-500" />
            <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-500">
              Transparansi
            </span>
          </div>
          <h1 class="mt-2 text-2xl font-extrabold text-heading sm:text-3xl">
            Pembangunan
            <span class="bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              Kalurahan
            </span>
          </h1>
          <p class="mt-1 text-[13.5px] text-muted sm:text-[14.5px]">
            Pantau kegiatan pembangunan, anggaran, dan progres pelaksanaannya di Kalurahan Bimomartani.
          </p>
        </div>

        <IconField class="w-full shrink-0 lg:w-[300px]">
          <InputIcon class="pi pi-search text-muted" />
          <InputText v-model="searchQuery" placeholder="Cari kegiatan atau lokasi..." class="w-full" />
        </IconField>
      </div>
    </Transition>

    <div v-if="loading" class="flex justify-center py-20">
      <ProgressSpinner :strokeWidth="4" class="!h-10 !w-10" />
    </div>

    <Message v-else-if="hasError" severity="error" icon="pi pi-exclamation-triangle">
      Data pembangunan gagal dimuat. Silakan muat ulang halaman beberapa saat lagi.
    </Message>

    <template v-else>
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div class="relative min-w-0 lg:flex-1">
          <div v-if="canScrollLeft" class="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
            <Button
              unstyled
              aria-label="Geser ke kiri"
              class="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-colors duration-200 active:scale-95"
              :class="leftArrowClass"
              @click="scrollTabs(-1)"
            >
              <i class="pi pi-chevron-left text-xs" />
            </Button>
          </div>

          <div
            ref="tabsRef"
            role="tablist"
            class="flex snap-x snap-proximity gap-2 overflow-x-auto scroll-smooth px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            :class="tabsMaskClass"
            @scroll.passive="updateScrollState"
          >
            <Button
              v-for="option in categoryOptions"
              :key="option.value"
              unstyled
              role="tab"
              :aria-selected="activeCategory === option.value"
              class="flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 sm:text-sm"
              :class="getTabClass(option, activeCategory === option.value)"
              @click="selectCategory(option.value, $event)"
            >
              <span
                v-if="option.value !== 'all'"
                class="h-1.5 w-1.5 rounded-full"
                :class="activeCategory === option.value ? 'bg-white' : getCategoryStyle(option.value).dot"
              />
              <span>{{ option.label }}</span>
            </Button>
          </div>

          <div v-if="canScrollRight" class="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
            <Button
              unstyled
              aria-label="Geser ke kanan"
              class="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-colors duration-200 active:scale-95"
              :class="rightArrowClass"
              @click="scrollTabs(1)"
            >
              <i class="pi pi-chevron-right text-xs" />
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 lg:flex lg:shrink-0 lg:items-center">
          <Select
            v-model="activeStatus"
            :options="developmentStatusOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full lg:w-48"
          >
            <template #value>
              <span class="text-muted">Status:</span>
              <span class="ml-1 font-semibold text-heading">{{ selectedStatusLabel }}</span>
            </template>
          </Select>

          <Select
            v-model="activeYear"
            :options="yearOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full lg:w-44"
          >
            <template #value>
              <i class="pi pi-calendar mr-2 text-xs text-sky-500" />
              <span class="text-muted">Tahun:</span>
              <span class="ml-1 font-semibold text-heading">{{ selectedYearLabel }}</span>
            </template>
          </Select>

          <Button
            v-if="hasActiveFilter"
            label="Reset"
            icon="pi pi-filter-slash"
            severity="secondary"
            text
            class="col-span-2 lg:col-auto"
            @click="resetFilters"
          />
        </div>
      </div>

      <Message v-if="filteredDevelopments.length === 0" severity="info" icon="pi pi-inbox">
        Belum ada data pembangunan yang sesuai. Coba ubah kata kunci atau filter yang dipilih.
      </Message>

      <template v-else>
        <p class="text-[13px] text-muted">
          Menampilkan {{ filteredDevelopments.length }} dari {{ developments.length }} kegiatan pembangunan
        </p>

        <TransitionGroup
          tag="div"
          class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          move-class="transition-transform duration-500 ease-out"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-6 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
        >
          <RouterLink
          v-for="item in pagedDevelopments"
          :key="item.slug"
          :to="{ name: 'development-detail', params: { slug: item.slug } }"
          class="group relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-900/10"
        >
          <span
            class="absolute inset-x-0 top-0 z-10 h-1.5 origin-left scale-x-50 opacity-70 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100"
            :class="getCategoryStyle(item.category).topBar"
          />

          <div
            class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br"
            :class="item.image ? 'bg-primary-50' : getCategoryStyle(item.category).imageGradient"
          >
            <Image
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="!block h-full w-full"
              imageClass="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <i
                :class="categoryIcon(item.category)"
                class="text-4xl text-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
              />
            </div>

            <Tag
              :value="item.category"
              unstyled
              class="absolute left-3 top-3 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5"
              :class="getCategoryStyle(item.category).badge"
            />
            <Tag
              :value="statusMeta[item.status].label"
              :severity="statusMeta[item.status].severity"
              class="absolute right-3 top-3 !text-[10.5px]"
            />
          </div>

          <div class="flex flex-1 flex-col gap-2 p-4 sm:p-5">
            <h3 class="line-clamp-2 text-[14.5px] font-extrabold leading-snug text-heading transition-colors duration-300 group-hover:text-primary-700">
              {{ item.title }}
            </h3>
            <span class="flex flex-1 items-start gap-1.5 text-[12.5px] leading-relaxed text-muted">
              <i class="pi pi-map-marker mt-0.5 text-[11px] text-primary-500" />
              <span class="line-clamp-2">{{ item.location }}</span>
            </span>

            <div class="flex items-center justify-between border-t border-border-default pt-3 text-[11.5px] text-muted">
              <span class="flex items-center gap-1.5">
                <i class="pi pi-calendar text-[10.5px]" />
                {{ formatDate(item.startDate) }}
              </span>
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full text-primary-700 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110"
                :class="getCategoryStyle(item.category).softBadge"
              >
                <i class="pi pi-arrow-right text-[11px]" />
              </span>
            </div>
          </div>
        </RouterLink>
        </TransitionGroup>

        <Paginator
          v-if="filteredDevelopments.length > pageSize"
          :rows="pageSize"
          :totalRecords="filteredDevelopments.length"
          :first="(currentPage - 1) * pageSize"
          template="PrevPageLink PageLinks NextPageLink"
          @page="onPageChange"
        />
      </template>
    </template>
  </div>
</template>