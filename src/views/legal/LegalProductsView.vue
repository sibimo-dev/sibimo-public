<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import { getLegalProducts } from '@/services/legalProducts'

const items = ref([])
const loading = ref(true)

const yearFilter = ref('all')
const typeFilter = ref('all')
const statusFilter = ref('all')
const search = ref('')
const first = ref(0)

onMounted(async () => {
  try {
    items.value = await getLegalProducts()
  } finally {
    loading.value = false
  }
})

const yearOptions = computed(() => {
  const years = [...new Set(items.value.map((i) => i.year).filter(Boolean))].sort((a, b) => b - a)
  return [{ label: 'Semua Tahun Penerbitan', value: 'all' }, ...years.map((y) => ({ label: String(y), value: y }))]
})

const typeOptions = computed(() => {
  const types = [...new Set(items.value.map((i) => i.type).filter(Boolean))].sort()
  return [{ label: 'Semua', value: 'all' }, ...types.map((t) => ({ label: t, value: t }))]
})

const statusOptions = computed(() => {
  const statuses = [...new Set(items.value.map((i) => i.status).filter(Boolean))].sort()
  return [{ label: 'Semua', value: 'all' }, ...statuses.map((s) => ({ label: s, value: s }))]
})

/* Filter Status hanya muncul bila data memang punya status */
const hasStatus = computed(() => statusOptions.value.length > 1)

function labelOf(options, value) {
  return options.find((o) => o.value === value)?.label ?? ''
}

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
  'bg-teal-50 text-teal-700 border border-teal-200',
  'bg-violet-50 text-violet-700 border border-violet-200',
  'bg-amber-50 text-amber-700 border border-amber-200',
  'bg-rose-50 text-rose-700 border border-rose-200',
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
async function downloadFile(item) {
  if (!item.file_url) return
  downloadingId.value = item.id
  try {
    const res = await fetch(item.file_url)
    if (!res.ok) throw new Error('Gagal mengambil berkas')
    const blob = await res.blob()

    const ext = item.file_url.split('?')[0].split('.').pop()
    const safeTitle = String(item.title).replace(/[\\/:*?"<>|]+/g, '').trim() || 'produk-hukum'
    const fileName = `${safeTitle}.${ext && ext.length <= 5 ? ext : 'pdf'}`

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch {
    /* Cadangan: bila diblokir CORS, buka berkas di tab baru */
    window.open(item.file_url, '_blank', 'noopener')
  } finally {
    downloadingId.value = null
  }
}

/* ============ Styling filter bar (tanpa CSS murni) ============ */
const filterBoxCls =
  'w-full !rounded-xl !border-0 !bg-indigo-50 !shadow-none transition-colors hover:!bg-indigo-100/70'
const filterPt = { label: { class: '!py-3 !text-[14px] !font-medium !text-heading' } }

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
</script>

<template>
  <div class="relative overflow-hidden py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-52 -z-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

    <!-- ===== HEADER ===== -->
    <div v-reveal>
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

    <div class="mt-6 rounded-2xl border border-border-default bg-surface p-4 shadow-sm sm:p-6">
      <!-- ===== FILTER BAR: cari + tahun + kategori + status ===== -->
      <div
        class="grid gap-3 sm:grid-cols-2"
        :class="hasStatus ? 'lg:grid-cols-[1fr_15rem_12rem_12rem]' : 'lg:grid-cols-[1fr_15rem_12rem]'"
      >
        <IconField class="sm:col-span-2 lg:col-span-1">
          <InputIcon class="pi pi-search text-heading" />
          <InputText
            v-model="search"
            type="search"
            placeholder="Cari kata kunci, nomor, judul (cth: 'APBDes', 'Sampah')..."
            class="w-full !rounded-xl !border-0 !bg-indigo-50 !py-3 !text-[14px] !shadow-none"
          />
        </IconField>

        <!-- Tahun -->
        <Select
          v-model="yearFilter"
          :options="yearOptions"
          option-label="label"
          option-value="value"
          :class="filterBoxCls"
          :pt="filterPt"
        >
          <template #value="{ value }">
            <span class="flex items-center gap-2">
              <i class="pi pi-calendar text-[13px]" />
              {{ labelOf(yearOptions, value) }}
            </span>
          </template>
        </Select>

        <!-- Kategori -->
        <Select
          v-model="typeFilter"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          :class="filterBoxCls"
          :pt="filterPt"
        >
          <template #value="{ value }">Kategori: {{ labelOf(typeOptions, value) }}</template>
        </Select>

        <!-- Status (hanya bila data punya status) -->
        <Select
          v-if="hasStatus"
          v-model="statusFilter"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          :class="filterBoxCls"
          :pt="filterPt"
        >
          <template #value="{ value }">Status: {{ labelOf(statusOptions, value) }}</template>
        </Select>
      </div>

      <!-- ===== TABEL ===== -->
      <div class="relative mt-5 overflow-hidden rounded-xl border border-border-default bg-surface">
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
              Tidak ada produk hukum yang cocok.
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