<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import api from '@/services/api'
import { getLegalProducts } from '@/services/legalProducts'

const items = ref([])
const loading = ref(true)

const yearFilter = ref('all')
const typeFilter = ref('all')
const statusFilter = ref('all')
const search = ref('')
const first = ref(0)
const hasError = ref(false)

let legalPollTimer = null

onMounted(async () => {
  try {
    items.value = await getLegalProducts()
  } catch (err) {
    console.error('Gagal memuat produk hukum:', err)
    hasError.value = true
  } finally {
    loading.value = false
  }

  legalPollTimer = setInterval(async () => {
    try {
      items.value = await getLegalProducts()
    } catch { /* silent */ }
  }, 5000)
})

// Tahun: sekarang ± 30 tahun, digabung dengan tahun yang ada di data
const yearOptions = computed(() => buildYearOptions(items.value.map((i) => i.year)))

const typeOptions = computed(() => {
  const types = [...new Set(items.value.map((i) => i.type).filter(Boolean))].sort()
  return [{ label: 'Semua Kategori', value: 'all' }, ...types.map((t) => ({ label: t, value: t }))]
})

const statusOptions = computed(() => {
  const statuses = [...new Set(items.value.map((i) => i.status).filter(Boolean))].sort()
  return [{ label: 'Semua', value: 'all' }, ...statuses.map((s) => ({ label: s, value: s }))]
})

/* Filter Status hanya muncul bila data memang punya status */
const hasStatus = computed(() => statusOptions.value.length > 1)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return items.value.filter((i) => {
    if (yearFilter.value !== 'all' && i.year !== yearFilter.value) return false
    if (typeFilter.value !== 'all' && i.type !== typeFilter.value) return false
    if (statusFilter.value !== 'all' && i.status !== statusFilter.value) return false
    if (q && !`${i.title} ${i.number ?? ''} ${i.type} ${i.year ?? ''}`.toLowerCase().includes(q)) return false
    return true
  })
})

watch([yearFilter, typeFilter, statusFilter, search], () => {
  first.value = 0
})

/* ============ Helper tampilan ============ */
/* Warna badge kategori ditentukan dari nama jenis (hash), konsisten seperti halaman Berita */
const TYPE_BADGES = [
  'bg-sky-50 text-sky-700 border border-sky-200',
  'bg-rose-50 text-rose-700 border border-rose-200',
  'bg-amber-50 text-amber-700 border border-amber-200',
  'bg-violet-50 text-violet-700 border border-violet-200',
  'bg-emerald-50 text-emerald-700 border border-emerald-200',
]

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  return hash
}

function typeBadge(type) {
  if (!type) return TYPE_BADGES[0]
  return TYPE_BADGES[hashString(type) % TYPE_BADGES.length]
}

function statusSeverity(status) {
  return String(status).toLowerCase() === 'berlaku' ? 'success' : 'danger'
}

/* ============ Tombol aksi dokumen ============ */
const btnPreviewCls =
  '!rounded-lg !border-0 !bg-indigo-100 !px-4 !py-2 !text-[14px] !font-semibold !text-blue-900 hover:!bg-indigo-200'
const btnDownloadCls =
  '!rounded-lg !border-0 !bg-blue-900 !px-4 !py-2 !text-[14px] !font-semibold !text-white hover:!bg-blue-950'

const downloadingId = ref(null)

/* Unduh sebagai berkas sungguhan. Atribut `download` pada <a> diabaikan browser
   bila file ada di domain lain (backend), jadi berkas diambil dulu lalu disimpan. */
function downloadFile(item) {
  if (!item.file_url) return
  const a = document.createElement('a')
  a.href = `${api.defaults.baseURL}/legal-products/${item.id}/download`
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/* ============ Styling DataTable (tanpa CSS murni) ============
   Gaya header meniru kartu tabel di halaman Agenda:
   gradasi sky-50 → violet-50 dengan teks gelap. Gradasi dipasang di <thead>,
   sel header dibuat transparan lewat variabel tema PrimeVue. */
const tableCls = [
  '[&_thead]:bg-gradient-to-r [&_thead]:from-sky-50 [&_thead]:to-violet-50',
  '[--p-datatable-header-cell-background:transparent]',
  '[--p-datatable-header-cell-hover-background:var(--color-sky-100)]',
  '[--p-datatable-header-cell-color:var(--color-heading)]',
  '[--p-datatable-header-cell-hover-color:var(--color-heading)]',
  '[--p-datatable-header-cell-border-color:var(--color-border-default)]',
  '[--p-datatable-sort-icon-color:var(--color-sky-600)]',
  '[--p-datatable-sort-icon-hover-color:var(--color-violet-600)]',
  '[--p-datatable-row-striped-background:var(--color-primary-50)]',
].join(' ')

const headerBase =
  '!bg-transparent !text-heading !font-extrabold !text-[14.5px] !py-4 ' +
  '[&_.p-datatable-column-title]:!text-heading [&_.p-datatable-sort-icon]:!text-sky-600'

const headCenter = (extra = '') =>
  `${headerBase} [&_.p-datatable-column-header-content]:justify-center ${extra}`
const headStart = (extra = '') =>
  `${headerBase} [&_.p-datatable-column-header-content]:justify-start ${extra}`

const cellCenter = '!py-5 !align-middle !text-center !text-[15px]'
const cellStart = '!py-5 !align-middle !text-left !text-[15px]'

/* ---------- Deretan kategori yang bisa digeser (slider, sama dengan halaman Berita) ----------
   Ada tombol panah + efek pudar di tepi yang masih punya kelanjutan, supaya jelas bisa digeser. */
const chipScroller = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const nextLeftOption = ref(null);
const nextRightOption = ref(null);
let chipObserver = null;

/* Warna chip per kategori (otomatis dari nama, palet sama dengan halaman Berita) */
const CHIP_PALETTE = [
  { dot: "bg-sky-500", activeBadge: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-transparent shadow-lg shadow-sky-500/30", hoverRing: "hover:border-sky-300" },
  { dot: "bg-rose-500", activeBadge: "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30", hoverRing: "hover:border-rose-300" },
  { dot: "bg-amber-500", activeBadge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/30", hoverRing: "hover:border-amber-300" },
  { dot: "bg-violet-500", activeBadge: "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-transparent shadow-lg shadow-violet-500/30", hoverRing: "hover:border-violet-300" },
  { dot: "bg-emerald-500", activeBadge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-500/30", hoverRing: "hover:border-emerald-300" },
];
const chipStyle = (option) => CHIP_PALETTE[hashString(String(option.label)) % CHIP_PALETTE.length];

function updateScrollState() {
  const el = chipScroller.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 4;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;

  // Chip pertama yang masih tersembunyi di kiri/kanan -> warnanya dipakai untuk panah.
  const box = el.getBoundingClientRect();
  const chips = [...el.querySelectorAll("[data-index]")];
  const right = chips.find((c) => c.getBoundingClientRect().right > box.right + 2);
  const left = [...chips].reverse().find((c) => c.getBoundingClientRect().left < box.left - 2);
  nextRightOption.value = right ? typeOptions.value[Number(right.dataset.index)] : null;
  nextLeftOption.value = left ? typeOptions.value[Number(left.dataset.index)] : null;
}

const chipArrowStyle = (option) =>
  option && option.value !== "all"
    ? chipStyle(option).activeBadge
    : "border-transparent bg-primary-800 text-white shadow-lg shadow-primary-900/30";

function scrollChips(direction) {
  const el = chipScroller.value;
  if (!el) return;
  el.scrollBy({ left: direction * Math.max(200, el.clientWidth * 0.6), behavior: "smooth" });
}

// Pudarkan tepi kiri/kanan hanya bila masih ada chip di sisi itu.
const chipFadeStyle = computed(() => {
  const stops = [
    canScrollLeft.value ? "transparent 0" : "#000 0",
    canScrollLeft.value ? "#000 48px" : null,
    canScrollRight.value ? "#000 calc(100% - 64px)" : null,
    canScrollRight.value ? "transparent 100%" : "#000 100%",
  ].filter(Boolean);
  const mask = `linear-gradient(to right, ${stops.join(", ")})`;
  return { maskImage: mask, WebkitMaskImage: mask };
});

watch(chipScroller, (el) => {
  chipObserver?.disconnect();
  if (!el) return;
  chipObserver = new ResizeObserver(updateScrollState);
  chipObserver.observe(el);
  if (el.firstElementChild) chipObserver.observe(el.firstElementChild);
  nextTick(updateScrollState);
});
watch(typeOptions, () => nextTick(updateScrollState), { deep: true });
onBeforeUnmount(() => {
  chipObserver?.disconnect();
  if (legalPollTimer) clearInterval(legalPollTimer);
});

/* ---------- Helper dropdown filter (Tahun, Status, Bulan) ---------- */
// Pilihan tahun: tahun sekarang +/- 30 tahun, digabung dengan tahun yang ada di data.
function buildYearOptions(dataYears = [], span = 30, allLabel = "Semua") {
  const now = new Date().getFullYear();
  const years = new Set();
  for (let y = now - span; y <= now + span; y++) years.add(y);
  for (const raw of dataYears) {
    const y = Number(raw);
    if (Number.isFinite(y) && y > 0) years.add(y);
  }
  return [
    { label: allLabel, value: "all" },
    ...[...years].sort((a, b) => b - a).map((y) => ({ label: String(y), value: y })),
  ];
}

const optionLabelOf = (options, value) => options.find((o) => o.value === value)?.label ?? "";
</script>

<template>
  <div class="relative overflow-hidden py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-52 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

    <!-- ===== HEADER + PENCARIAN ===== -->
    <div v-reveal class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-sky-500" />
          <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-500">Transparansi</span>
        </div>
        <h1 class="mt-2 text-2xl font-extrabold text-heading sm:text-3xl">
          Produk
          <span class="bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
            Hukum
          </span>
        </h1>
        <p class="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-muted sm:text-[14.5px]">
          Daftar Surat Keputusan, Peraturan Desa, dan dokumen hukum lainnya yang diterbitkan
          Kalurahan Bimomartani. Dokumen dapat diunduh langsung.
        </p>
      </div>

      <IconField class="w-full shrink-0 lg:w-[300px]">
        <InputIcon class="pi pi-search text-muted" />
        <InputText
          v-model="search"
          type="search"
          placeholder="Cari judul, nomor, kata kunci..."
          class="w-full rounded-xl border-border-default py-2.5 text-[13.5px] focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </IconField>
    </div>

    <div class="mt-6 flex flex-col gap-5">
      <!-- ===== FILTER: kategori (slider, sama dengan Berita) + tahun & status (dropdown) ===== -->
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        <div class="relative min-w-0 lg:flex-1">
          <div
            ref="chipScroller"
            class="min-w-0 overflow-x-auto overscroll-x-contain scroll-smooth px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            :style="chipFadeStyle"
            role="tablist"
            aria-label="Filter kategori produk hukum"
            @scroll.passive="updateScrollState"
          >
            <div class="flex w-max flex-nowrap gap-2 pr-10">
              <button
                v-for="(option, index) in typeOptions"
                :key="option.value"
                type="button"
                role="tab"
                :aria-selected="typeFilter === option.value"
                :data-index="index"
                class="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-[12.5px] font-bold transition-all duration-200 active:scale-95"
                :class="
                  typeFilter === option.value
                    ? option.value === 'all'
                      ? 'border-transparent bg-gradient-to-r from-primary-800 to-primary-900 text-white shadow-md'
                      : [chipStyle(option).activeBadge, 'scale-105']
                    : ['border-border-default bg-surface text-default', option.value === 'all' ? '' : chipStyle(option).hoverRing]
                "
                @click="typeFilter = option.value"
              >
                <span
                  v-if="option.value !== 'all'"
                  class="h-1.5 w-1.5 rounded-full"
                  :class="typeFilter === option.value ? 'bg-white/80' : chipStyle(option).dot"
                />
                {{ option.label }}
                <span
                  v-if="option.count !== undefined"
                  class="rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold"
                  :class="typeFilter === option.value ? 'bg-white/20 text-white' : 'bg-surface-hover text-muted'"
                >
                  {{ option.count }}
                </span>
              </button>
            </div>
          </div>

          <!-- Panah penunjuk: hanya tampil di sisi yang masih punya kelanjutan -->
          <button
            v-if="canScrollLeft"
            type="button"
            aria-label="Geser kategori ke kiri"
            class="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border transition-all hover:scale-110 active:scale-95"
            :class="chipArrowStyle(nextLeftOption)"
            @click="scrollChips(-1)"
          >
            <i class="pi pi-chevron-left text-[11px]" />
          </button>
          <button
            v-if="canScrollRight"
            type="button"
            aria-label="Geser kategori ke kanan"
            class="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border transition-all hover:scale-110 active:scale-95"
            :class="chipArrowStyle(nextRightOption)"
            @click="scrollChips(1)"
          >
            <i class="pi pi-chevron-right text-[11px]" />
          </button>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
          <Select
            v-model="yearFilter"
            :options="yearOptions"
            optionLabel="label"
            optionValue="value"
            scrollHeight="280px"
            class="w-full !rounded-xl !border-border-default !bg-surface !shadow-none sm:w-auto sm:min-w-[11.5rem]"
            :pt="{ label: { class: '!py-2.5' } }"
          >
            <template #value="{ value }">
              <span class="flex items-center gap-2 text-[13.5px] font-semibold text-heading">
                <i class="pi pi-calendar text-[12px] text-primary-500" />
                <span class="font-bold text-muted">Tahun:</span>
                {{ optionLabelOf(yearOptions, value) }}
              </span>
            </template>
          </Select>
          <!-- Status (hanya bila data punya status) -->
          <Select
            v-model="statusFilter"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            scrollHeight="280px"
            class="w-full !rounded-xl !border-border-default !bg-surface !shadow-none sm:w-auto sm:min-w-[11.5rem]"
            :pt="{ label: { class: '!py-2.5' } }"
          >
            <template #value="{ value }">
              <span class="flex items-center gap-2 text-[13.5px] font-semibold text-heading">
                <span class="font-bold text-muted">Status:</span>
                {{ optionLabelOf(statusOptions, value) }}
              </span>
            </template>
          </Select>
        </div>
      </div>

      <!-- ===== TABEL ===== -->
      <div class="relative overflow-hidden rounded-xl border border-border-default bg-surface">
        <!-- garis gradasi di atas tabel (seperti halaman Agenda) -->
        <span class="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-sky-400 to-violet-500" />

        <DataTable
          v-model:first="first"
          :value="filtered"
          :loading="loading"
          data-key="id"
          sort-field="year"
          :sort-order="-1"
          striped-rows
          paginator
          :rows="10"
          :rows-per-page-options="[10, 25, 50, 100]"
          paginator-template="RowsPerPageDropdown CurrentPageReport PrevPageLink PageLinks NextPageLink"
          current-page-report-template="Menampilkan {first} sampai {last} dari {totalRecords} entri"
          removable-sort
          table-style="min-width: 52rem"
          :class="tableCls"
        >
        <template #empty>
          <div class="py-8 text-center text-[14px] text-muted">
            <i class="pi pi-inbox mb-2 block text-2xl text-primary-200" />
            {{ hasError ? 'Data produk hukum gagal dimuat. Coba muat ulang halaman.' : 'Tidak ada produk hukum yang cocok.' }}
          </div>
        </template>

          <!-- No -->
          <Column header="No" :header-class="headCenter('w-20')" :body-class="cellCenter">
            <template #body="{ index }">
              <span class="font-semibold text-default">{{ first + index + 1 }}</span>
            </template>
          </Column>

          <!-- Judul (tanpa sort/filter) -->
          <Column field="title" header="Judul Produk Hukum" :header-class="headStart()" :body-class="cellStart">
            <template #body="{ data }">
              <span class="text-[16px] font-semibold leading-snug text-heading">{{ data.title }}</span>
            </template>
          </Column>

          <!-- Kategori -->
          <Column field="type" header="Kategori" sortable :header-class="headCenter('w-44')" :body-class="cellCenter">
            <template #body="{ data }">
              <Tag
                unstyled
                :value="data.type"
                class="inline-flex whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold"
                :class="typeBadge(data.type)"
              />
            </template>
          </Column>

          <!-- Tahun -->
          <Column field="year" header="Tahun" sortable :header-class="headCenter('w-32')" :body-class="cellCenter">
            <template #body="{ data }">
              <span class="font-semibold text-default">{{ data.year ?? '-' }}</span>
            </template>
          </Column>

          <!-- Status -->
          <Column header="Status" :header-class="headCenter('w-36')" :body-class="cellCenter">
            <template #body="{ data }">
              <Tag
                v-if="data.status"
                :value="data.status"
                :severity="statusSeverity(data.status)"
                rounded
                class="!px-3.5 !py-1.5 !text-[13.5px]"
              />
              <span v-else class="text-muted">-</span>
            </template>
          </Column>

          <!-- Aksi -->
          <Column header="Aksi" :header-class="headCenter('w-64')" :body-class="cellCenter">
            <template #body="{ data }">
              <div class="flex items-center justify-center gap-2">
                <!-- Pratinjau: buka dokumen di tab baru -->
                <Button
                  v-if="data.file_url"
                  as="a"
                  :href="data.file_url"
                  target="_blank"
                  rel="noopener"
                  label="Pratinjau"
                  icon="pi pi-eye"
                  :class="btnPreviewCls"
                />
                <Button
                  v-else
                  label="Pratinjau"
                  icon="pi pi-eye"
                  disabled
                  title="Dokumen belum diunggah"
                  :class="btnPreviewCls"
                />

                <!-- Unduh: simpan dokumen sebagai berkas -->
                <Button
                  label="Unduh"
                  icon="pi pi-download"
                  :disabled="!data.file_url"
                  :loading="downloadingId === data.id"
                  :title="data.file_url ? 'Unduh dokumen' : 'Dokumen belum diunggah'"
                  :class="btnDownloadCls"
                  @click="downloadFile(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>