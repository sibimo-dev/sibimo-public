<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { FilterMatchMode } from '@primevue/core/api'
import { fetchComplaints } from '@/services/complaints.js'

const router = useRouter()
const complaints = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    complaints.value = await fetchComplaints()
  } catch (err) {
    console.error('Gagal memuat aduan:', err)
  } finally {
    loading.value = false
  }
})

/* ---------------- Kategori & Status ----------------
   PENTING: value di sini SENGAJA disamakan persis dengan yang dipakai
   admin dan dengan ComplaintFormView.vue (publik). Kalau menambah/mengubah
   kategori atau status, ubah juga di kedua file tersebut. */
const categoryMeta = {
  Infrastructure: { label: 'Infrastruktur', chip: 'bg-amber-50 text-amber-700 border-amber-200', iconClass: 'pi pi-wrench' },
  'Public Service': { label: 'Pelayanan Publik', chip: 'bg-violet-50 text-violet-700 border-violet-200', iconClass: 'pi pi-users' },
  Environment: { label: 'Lingkungan', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconClass: 'pi pi-sun' },
  Security: { label: 'Keamanan', chip: 'bg-sky-50 text-sky-700 border-sky-200', iconClass: 'pi pi-shield' },
  Other: { label: 'Lainnya', chip: 'bg-rose-50 text-rose-700 border-rose-200', iconClass: 'pi pi-exclamation-triangle' },
}
function getCategoryMeta(value) {
  return categoryMeta[value] ?? { label: value ?? '-', chip: 'bg-slate-100 text-slate-600 border-slate-200', iconClass: 'pi pi-circle' }
}
const categoryLabelMap = Object.fromEntries(Object.entries(categoryMeta).map(([k, v]) => [k, v.label]))

const statusMeta = {
  Submitted: { label: 'Menunggu Verifikasi', severity: 'warn', icon: 'pi pi-eye' },
  'In Progress': { label: 'Sedang Diproses', severity: 'info', icon: 'pi pi-spin pi-cog' },
  Resolved: { label: 'Selesai', severity: 'success', icon: 'pi pi-check-circle' },
  Rejected: { label: 'Ditolak', severity: 'danger', icon: 'pi pi-times-circle' },
}
const statusLabelMap = Object.fromEntries(Object.entries(statusMeta).map(([k, v]) => [k, v.label]))
const statusSeverityMap = Object.fromEntries(Object.entries(statusMeta).map(([k, v]) => [k, v.severity]))
const statusIconMap = Object.fromEntries(Object.entries(statusMeta).map(([k, v]) => [k, v.icon]))

function formatComplaintDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function maskPhoneNumber(phone) {
  const digits = (phone || '').replace(/\D/g, '')
  if (!digits) return '-'
  const visibleStart = digits.slice(0, 2) 
  const stars = '*'.repeat(Math.max(digits.length - 2, 0))
  return `${visibleStart}${stars}`
}

// Teks lokasi singkat untuk kolom tabel (di-truncate agar tidak memicu scroll horizontal di desktop).
function locationSummary(location) {
  return location?.text?.trim() || null
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov']

function attachmentUrl(file) {
  return typeof file === 'string' ? file : (file?.file_path || file?.url)
}
function attachmentName(file) {
  return typeof file === 'string' ? file : (file?.file_name || file?.name || 'Lampiran')
}
function getAttachmentKind(file) {
  // Kalau backend/dummy sudah menandai type-nya secara eksplisit, pakai itu.
  const explicitType = (typeof file === 'object' && file?.type) || ''
  if (explicitType === 'image' || explicitType === 'video' || explicitType === 'link') return explicitType

  const url = (attachmentUrl(file) || '').toLowerCase().split('?')[0]
  const mime = (typeof file === 'object' && file?.mime_type) || ''

  if (mime.includes('video') || VIDEO_EXTENSIONS.some((ext) => url.endsWith(ext))) return 'video'
  if (mime.includes('image') || IMAGE_EXTENSIONS.some((ext) => url.endsWith(ext))) return 'image'
  return 'link' // URL ada, tapi bukan file gambar/video langsung -> perlakukan sebagai tautan biasa
}

function initialsOf(name) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
}

/* ---------------- Ringkasan statistik ---------------- */
const totalCount = computed(() => complaints.value.length)
const submittedCount = computed(() => complaints.value.filter((c) => c.status === 'Submitted').length)
const inProgressCount = computed(() => complaints.value.filter((c) => c.status === 'In Progress').length)
const resolvedCount = computed(() => complaints.value.filter((c) => c.status === 'Resolved').length)

const statCards = computed(() => [
  { id: 'total', label: 'Total Aduan', value: totalCount.value, icon: 'pi pi-inbox', accent: 'from-indigo-500 to-violet-600', iconBg: 'bg-indigo-100 text-indigo-600' },
  { id: 'submitted', label: 'Menunggu Verifikasi', value: submittedCount.value, icon: 'pi pi-eye', accent: 'from-amber-400 to-amber-500', iconBg: 'bg-amber-100 text-amber-600' },
  { id: 'in-progress', label: 'Sedang Diproses', value: inProgressCount.value, icon: 'pi pi-cog', accent: 'from-sky-400 to-sky-500', iconBg: 'bg-sky-100 text-sky-600' },
  { id: 'resolved', label: 'Selesai', value: resolvedCount.value, icon: 'pi pi-check-circle', accent: 'from-emerald-400 to-emerald-500', iconBg: 'bg-emerald-100 text-emerald-600' },
])

/* ---------------- Filter bawaan DataTable ---------------- */
function createEmptyFilters() {
  return {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    category: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
  }
}
const filters = ref(createEmptyFilters())
const hasActiveFilters = computed(() => !!filters.value.global.value || !!filters.value.category.value || !!filters.value.status.value)
function clearAllFilters() {
  filters.value = createEmptyFilters()
}

function goToComplaintForm() {
  router.push({ name: 'complaints-form' })
}

/* ---------------- Detail popup ---------------- */
const showDetailDialog = ref(false)
const selectedComplaint = ref(null)

function openDetail(data) {
  selectedComplaint.value = data
  showDetailDialog.value = true
}
function onRowClick(event) {
  openDetail(event.data)
}

const tablePt = {
  bodyRow: () => ({
    class: ['cursor-pointer', 'transition-all duration-150 ease-out', 'hover:translate-x-0.5 hover:bg-slate-50', 'hover:shadow-[inset_3px_0_0_0_#6366f1]'],
  }),
}
</script>

<template>
  <div class="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 md:px-6">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-16 top-24 -z-10 h-64 w-64 animate-pulse rounded-full bg-amber-400/10 blur-3xl motion-reduce:animate-none" />
    <div class="pointer-events-none absolute left-1/4 bottom-0 -z-10 h-56 w-56 animate-pulse rounded-full bg-emerald-400/10 blur-3xl motion-reduce:animate-none" />

    <Transition appear enter-active-class="transition-all duration-500 ease-out" enter-from-class="opacity-0 translate-y-3 scale-[0.98]" enter-to-class="opacity-100 translate-y-0 scale-100">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2">
            <span class="h-2 w-2 animate-pulse rounded-full bg-indigo-500 motion-reduce:animate-none" />
            <span class="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">Suarakan</span>
          </div>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
            Daftar
            <span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Aduan</span>
            Masyarakat
          </h1>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">Pantau seluruh laporan yang masuk beserta status penanganannya.</p>
        </div>
        <Button
          label="Laporkan Aduan"
          icon="pi pi-plus"
          unstyled
          class="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 active:translate-y-0 active:scale-[0.97]"
          @click="goToComplaintForm"
        />
      </div>
    </Transition>

    <div class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      <Transition
        v-for="(stat, index) in statCards"
        :key="stat.id"
        appear
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
      >
        <div class="relative origin-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" :style="{ transitionDelay: `${60 + index * 60}ms` }">
          <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r" :class="stat.accent" />
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-lg" :class="stat.iconBg"><i :class="stat.icon" /></span>
            <div class="min-w-0">
              <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
              <p class="truncate text-xs font-medium text-slate-500">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="loading" class="mt-6 py-16 text-center text-slate-400">Memuat data aduan...</div>
    <Transition v-else appear enter-active-class="transition-all duration-500 ease-out" enter-from-class="opacity-0 translate-y-3 scale-[0.98]" enter-to-class="opacity-100 translate-y-0 scale-100">
      <div class="relative mt-6 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-lg shadow-indigo-100/50" style="transition-delay: 200ms">
        <span class="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />

        <DataTable
          v-model:filters="filters"
          :value="complaints"
          :globalFilterFields="['title', 'citizen.full_name']"
          filterDisplay="menu"
          paginator
          :rows="5"
          dataKey="complaint_id"
          responsiveLayout="scroll"
          :pt="tablePt"
          @row-click="onRowClick"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-3">
              <span class="text-sm font-semibold text-slate-600">Klik baris untuk lihat detail aduan.</span>
              <div class="flex items-center gap-2">
                <IconField>
                  <InputIcon class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Cari judul aduan atau nama pelapor..." />
                </IconField>
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <button v-if="hasActiveFilters" type="button" @click="clearAllFilters" class="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50">
                    <i class="pi pi-times" />
                    Reset Filter
                  </button>
                </Transition>
              </div>
            </div>
          </template>

          <template #empty>
            <div class="flex flex-col items-center gap-2 py-12 text-center">
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400"><i class="pi pi-inbox" /></span>
              <p class="text-sm font-medium text-slate-500">Tidak ada aduan yang cocok dengan pencarian/filter ini.</p>
              <button v-if="hasActiveFilters" type="button" @click="clearAllFilters" class="text-xs font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-700">Reset filter</button>
            </div>
          </template>

          <Column header="Pelapor" style="width: 17%; max-width: 160px">
            <template #body="{ data }">
              <div class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-bold text-white shadow-sm shadow-indigo-500/30">
                  {{ initialsOf(data.citizen?.full_name) }}
                </span>
                <span class="truncate text-sm font-medium text-slate-700">{{ data.citizen?.full_name ?? '-' }}</span>
              </div>
            </template>
          </Column>

          <Column field="title" header="Judul Aduan/Topik">
            <template #body="{ data }"><span class="line-clamp-1 text-sm font-semibold text-slate-800" :title="data.title">{{ data.title }}</span></template>
          </Column>

          <Column header="Lokasi" style="width: 15%; max-width: 150px">
            <template #body="{ data }">
              <span
                v-if="locationSummary(data.location)"
                class="flex items-center gap-1 text-xs text-slate-500"
                :title="locationSummary(data.location)"
              >
                <i class="pi pi-map-marker flex-none text-[11px] text-rose-400" />
                <span class="truncate">{{ locationSummary(data.location) }}</span>
              </span>
              <span v-else class="text-xs text-slate-300">-</span>
            </template>
          </Column>

          <Column field="category" header="Kategori" style="width: 15%; max-width: 140px">
            <template #body="{ data }">
              <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold" :class="getCategoryMeta(data.category).chip">
                <i :class="getCategoryMeta(data.category).iconClass" class="text-[11px]" />
                {{ categoryLabelMap[data.category] ?? data.category }}
              </span>
            </template>
          </Column>

          <Column field="submitted_at" header="Tanggal" style="width: 12%; max-width: 110px" sortable>
            <template #body="{ data }">
              <span class="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <i class="pi pi-calendar text-xs text-slate-400" />
                {{ formatComplaintDate(data.submitted_at) }}
              </span>
            </template>
          </Column>

          <Column field="status" header="Status" style="width: 14%; max-width: 140px">
            <template #body="{ data }">
              <Tag :value="statusLabelMap[data.status] ?? data.status" :severity="statusSeverityMap[data.status]" :icon="statusIconMap[data.status]" />
            </template>
          </Column>
        </DataTable>
      </div>
    </Transition>

    <!-- ============ Popup Detail Aduan ============ -->
    <Dialog v-model:visible="showDetailDialog" modal dismissableMask :style="{ width: '34rem' }" class="mx-4">
      <template #header>
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-indigo-500" />
          <span class="text-sm font-bold uppercase tracking-wider text-indigo-600">Detail Aduan</span>
        </div>
      </template>

      <div v-if="selectedComplaint" class="flex flex-col gap-6">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold" :class="getCategoryMeta(selectedComplaint.category).chip">
            <i :class="getCategoryMeta(selectedComplaint.category).iconClass" class="text-[11px]" />
            {{ categoryLabelMap[selectedComplaint.category] ?? selectedComplaint.category }}
          </span>
          <Tag :value="statusLabelMap[selectedComplaint.status] ?? selectedComplaint.status" :severity="statusSeverityMap[selectedComplaint.status]" :icon="statusIconMap[selectedComplaint.status]" />
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm shadow-indigo-500/30">
              {{ initialsOf(selectedComplaint.citizen?.full_name) }}
            </span>
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Nama Pelapor</p>
              <p class="text-sm font-semibold text-slate-800">{{ selectedComplaint.citizen?.full_name ?? '-' }}</p>
            </div>
            <div class="ml-auto flex items-center gap-1.5 text-xs text-slate-500">
              <i class="pi pi-calendar text-[10px]" />
              {{ formatComplaintDate(selectedComplaint.submitted_at) }}
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-xs">
              <i class="pi pi-phone text-slate-400" />
              <div>
                <p class="font-bold uppercase tracking-wide text-slate-400">Telepon</p>
                <p class="mt-0.5 font-mono text-slate-700">{{ maskPhoneNumber(selectedComplaint.citizen?.phone_number) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-xs">
              <i class="pi pi-map-marker text-rose-400" />
              <div class="min-w-0">
                <p class="font-bold uppercase tracking-wide text-slate-400">Lokasi</p>
                <p class="mt-0.5 truncate text-slate-700" :title="locationSummary(selectedComplaint.location) ?? ''">
                  {{ locationSummary(selectedComplaint.location) ?? 'Tidak dicantumkan' }}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Judul Aduan/Topik</p>
            <p class="mt-1 text-base font-bold text-slate-900">{{ selectedComplaint.title }}</p>
          </div>

          <div v-if="selectedComplaint.description" class="rounded-xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Deskripsi Laporan</p>
            <p class="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-slate-700">{{ selectedComplaint.description }}</p>
          </div>
        </div>

        <div v-if="selectedComplaint.attachments?.length">
          <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Bukti Pendukung</p>
          <div class="mt-2 grid grid-cols-3 gap-2">
            <template v-for="file in selectedComplaint.attachments" :key="file.attachment_id ?? attachmentUrl(file)">
              <!-- Gambar / video: tampil sebagai thumbnail -->
              <a
                v-if="getAttachmentKind(file) !== 'link'"
                :href="attachmentUrl(file)"
                target="_blank"
                rel="noopener"
                class="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              >
                <video v-if="getAttachmentKind(file) === 'video'" :src="attachmentUrl(file)" class="h-full w-full object-cover" muted />
                <img v-else :src="attachmentUrl(file)" :alt="attachmentName(file)" class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                <span v-if="getAttachmentKind(file) === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/20">
                  <i class="pi pi-play-circle text-2xl text-white drop-shadow" />
                </span>
              </a>

              <!-- Bukan file gambar/video langsung: tampil sebagai kartu tautan, bukan dipaksa jadi thumbnail -->
              <a
                v-else
                :href="attachmentUrl(file)"
                target="_blank"
                rel="noopener"
                class="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2 text-center transition-colors hover:border-indigo-300 hover:bg-indigo-50"
              >
                <i class="pi pi-external-link text-lg text-slate-400 group-hover:text-indigo-500" />
                <span class="line-clamp-2 break-all text-[11px] font-medium text-slate-500 group-hover:text-indigo-600">
                  {{ attachmentName(file) }}
                </span>
              </a>
            </template>
          </div>
        </div>
        <div v-else class="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-400">
          <i class="pi pi-image" />
          Tidak ada bukti pendukung yang dilampirkan.
        </div>
      </div>

      <template #footer>
        <Button label="Tutup" unstyled class="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200" @click="showDetailDialog = false" />
      </template>
    </Dialog>
  </div>
</template>