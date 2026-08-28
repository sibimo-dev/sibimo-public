<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/* ---------------- 1. Kategori Aduan ---------------- */
const categories = [
  { id: 'infrastruktur', label: 'Infrastruktur', icon: '🛠️' },
  { id: 'pelayanan-publik', label: 'Pelayanan Publik', icon: '👥' },
  { id: 'lingkungan', label: 'Lingkungan', icon: '🌿' },
  { id: 'lainnya', label: 'Lainnya', icon: '⚠️' },
]
const selectedCategory = ref(null)

/* Per-category color identity so the selection state (and the drag & drop
   zone once a category is picked) */
const categoryStyles = {
  infrastruktur: {
    active: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    idleHover: 'hover:border-amber-300 hover:bg-amber-50',
  },
  'pelayanan-publik': {
    active: 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/30',
    idleHover: 'hover:border-violet-300 hover:bg-violet-50',
  },
  lingkungan: {
    active: 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    idleHover: 'hover:border-emerald-300 hover:bg-emerald-50',
  },
  lainnya: {
    active: 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30',
    idleHover: 'hover:border-rose-300 hover:bg-rose-50',
  },
}
function catStyle(id) {
  return categoryStyles[id] ?? { active: 'border-slate-800 bg-slate-800 text-white', idleHover: 'hover:border-slate-300 hover:bg-slate-50' }
}

/* ---------------- 2. Detail Aduan ---------------- */
const judul = ref('')
const deskripsi = ref('')
const MIN_DESC_LENGTH = 50
const descCount = computed(() => deskripsi.value.length)
const descValid = computed(() => descCount.value >= MIN_DESC_LENGTH)

/* --- Lokasi Kejadian: geolokasi real-time + reverse geocoding (OpenStreetMap Nominatim) --- */
const locationText = ref('')
const locationCoords = ref(null) // { lat, lng }
const locatingStatus = ref('idle') // 'idle' | 'loading' | 'success' | 'error'
const locationErrorMsg = ref('')

function useCurrentLocation() {
  if (!('geolocation' in navigator)) {
    locatingStatus.value = 'error'
    locationErrorMsg.value = 'Perangkat/browser Anda tidak mendukung geolokasi.'
    return
  }

  // Geolocation API browser hanya berfungsi di HTTPS atau localhost.
  locatingStatus.value = 'loading'
  locationErrorMsg.value = ''

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords
      locationCoords.value = { lat: latitude, lng: longitude }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        )
        if (!res.ok) throw new Error('Gagal reverse-geocode')
        const data = await res.json()
        locationText.value =
          data?.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      } catch (e) {
        locationText.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      } finally {
        locatingStatus.value = 'success'
      }
    },
    (err) => {
      locatingStatus.value = 'error'
      if (err.code === err.PERMISSION_DENIED) {
        locationErrorMsg.value =
          'Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di pengaturan browser Anda.'
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        locationErrorMsg.value = 'Lokasi tidak dapat dideteksi saat ini.'
      } else if (err.code === err.TIMEOUT) {
        locationErrorMsg.value = 'Waktu permintaan lokasi habis. Coba lagi.'
      } else {
        locationErrorMsg.value = 'Gagal mendapatkan lokasi Anda.'
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

/* ---------------- 3. Bukti Pendukung (drag & drop upload) ---------------- */
const MAX_FILES = 3
const MAX_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'video/mp4']

const files = ref([]) 
const fileError = ref('')
const isDragging = ref(false)
const fileInputEl = ref(null)

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function addFiles(fileList) {
  fileError.value = ''
  const incoming = Array.from(fileList || [])

  for (const f of incoming) {
    if (files.value.length >= MAX_FILES) {
      fileError.value = `Maksimal ${MAX_FILES} file.`
      break
    }
    if (!ACCEPTED_TYPES.includes(f.type)) {
      fileError.value = `Format "${f.name}" tidak didukung. Gunakan JPG, PNG, atau MP4.`
      continue
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      fileError.value = `"${f.name}" melebihi ukuran maksimal ${MAX_SIZE_MB}MB.`
      continue
    }
    files.value.push({
      id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2)}`,
      file: f,
      name: f.name,
      sizeLabel: formatSize(f.size),
      previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
    })
  }
}

function clearFiles() {
  files.value.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
  files.value = []
  fileError.value = ''
}

function removeFile(id) {
  const idx = files.value.findIndex((f) => f.id === id)
  if (idx !== -1) {
    if (files.value[idx].previewUrl) URL.revokeObjectURL(files.value[idx].previewUrl)
    files.value.splice(idx, 1)
  }
}

function onDrop(e) {
  isDragging.value = false
  addFiles(e.dataTransfer.files)
}

function onFileInputChange(e) {
  addFiles(e.target.files)
  e.target.value = ''
}

function openFilePicker() {
  fileInputEl.value?.click()
}

onBeforeUnmount(() => {
  files.value.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
})

/* ---------------- Draft (simpan sementara di perangkat) ---------------- */
const DRAFT_KEY = 'aduan-warga-draft'
const draftSavedMsg = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (raw) {
      const draft = JSON.parse(raw)
      selectedCategory.value = draft.selectedCategory ?? null
      judul.value = draft.judul ?? ''
      deskripsi.value = draft.deskripsi ?? ''
      locationText.value = draft.locationText ?? ''
    }
  } catch {
  }
})

function saveDraft() {
  const draft = {
    selectedCategory: selectedCategory.value,
    judul: judul.value,
    deskripsi: deskripsi.value,
    locationText: locationText.value,
  }
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  draftSavedMsg.value = true
  setTimeout(() => (draftSavedMsg.value = false), 2500)
}

/* ---------------- Submit ---------------- */
const canSubmit = computed(
  () => !!selectedCategory.value && judul.value.trim().length > 0 && descValid.value
)
const submitting = ref(false)
const submitSuccess = ref(false)

async function submitReport() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true

  await new Promise((resolve) => setTimeout(resolve, 900))

  submitting.value = false
  submitSuccess.value = true
  localStorage.removeItem(DRAFT_KEY)

  // scroll ke atas supaya notifikasi sukses langsung terlihat oleh pengguna
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* ---------------- Batal ----------------
   Sekarang "Batal" hanya mereset seluruh isian form ke kondisi awal
   dan tetap berada di halaman ini. */
function resetForm() {
  selectedCategory.value = null
  judul.value = ''
  deskripsi.value = ''
  locationText.value = ''
  locationCoords.value = null
  locatingStatus.value = 'idle'
  locationErrorMsg.value = ''
  clearFiles()
}

function handleCancel() {
  resetForm()
  localStorage.removeItem(DRAFT_KEY)
}
</script>

<template>
  <div class="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 md:px-6">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-16 top-24 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl animate-blob-float" />
    <div class="pointer-events-none absolute left-1/4 bottom-0 -z-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl animate-blob-float-slow" />

    <div class="fade-in-up">
      <div class="inline-flex items-center gap-2">
        <span class="header-kicker-dot h-2 w-2 rounded-full bg-indigo-500" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">Suarakan</span>
      </div>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
        Laporkan <span class="heading-accent">Aduan</span>
      </h1>
      <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
        Sampaikan permasalahan infrastruktur, pelayanan publik, atau kejadian di lingkungan desa.
        Laporan Anda membantu kami membangun desa yang lebih baik.
      </p>
    </div>

    <!-- Notifikasi sukses kirim -->
    <Transition name="pop">
      <div
        v-if="submitSuccess"
        class="success-banner mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3.5 text-sm text-emerald-700 shadow-sm"
      >
        <span class="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500 text-xs text-white success-check">
          ✓
        </span>
        <div>
          <p class="font-semibold">Laporan aduan Anda berhasil terkirim!</p>
          <p class="mt-0.5 text-emerald-600">
            Laporan akan segera diproses oleh tim terkait. Terima kasih atas partisipasi Anda.
          </p>
        </div>
      </div>
    </Transition>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- ===== FORM UTAMA ===== -->
      <form class="fade-in-up space-y-8 lg:col-span-2" style="animation-delay: 60ms" @submit.prevent="submitReport">
        <!-- Section 1: Kategori -->
        <section>
          <div class="flex items-center gap-2.5">
            <span class="step-badge flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">1</span>
            <h2 class="text-base font-semibold text-slate-900">Kategori Aduan</h2>
          </div>
          <div class="mt-3 border-b border-slate-100 pb-6">
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                @click="selectedCategory = cat.id"
                class="category-tile relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 active:scale-95"
                :class="
                  selectedCategory === cat.id
                    ? [catStyle(cat.id).active, 'category-tile--active']
                    : ['border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:shadow-md', catStyle(cat.id).idleHover]
                "
              >
                <span
                  v-if="selectedCategory === cat.id"
                  class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] text-white shadow success-check"
                >
                  ✓
                </span>
                <span class="text-2xl transition-transform duration-200" :class="selectedCategory === cat.id && 'scale-110'">{{ cat.icon }}</span>
                <span class="text-xs font-semibold leading-tight">{{ cat.label }}</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Section 2: Detail Aduan -->
        <section>
          <div class="flex items-center gap-2.5">
            <span class="step-badge flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">2</span>
            <h2 class="text-base font-semibold text-slate-900">Detail Aduan</h2>
          </div>

          <div class="mt-4 space-y-5 border-b border-slate-100 pb-6">
            <div>
              <label class="mb-1.5 block text-xs font-semibold text-slate-500">Judul Laporan</label>
              <input
                v-model="judul"
                type="text"
                placeholder="Contoh: Jalan berlubang di Jl. Merdeka"
                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-shadow focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <div class="mb-1.5 flex items-center justify-between">
                <label class="text-xs font-semibold text-slate-500">Deskripsi Laporan</label>
                <span
                  class="text-xs font-medium transition-colors"
                  :class="descValid ? 'text-emerald-600' : 'text-slate-400'"
                >
                  {{ descCount }}/{{ MIN_DESC_LENGTH }} karakter minimal
                </span>
              </div>
              <textarea
                v-model="deskripsi"
                rows="4"
                placeholder="Ceritakan secara detail mengenai masalah yang Anda temui. Kapan terjadi? Apa dampaknya?"
                class="w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition-shadow focus:outline-none focus:ring-2"
                :class="
                  deskripsi.length > 0 && !descValid
                    ? 'border-amber-300 focus:border-amber-400 focus:ring-amber-100'
                    : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
                "
              />
              <!-- Progress bar toward the minimum character count -->
              <div class="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="descValid ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'"
                  :style="{ width: `${Math.min((descCount / MIN_DESC_LENGTH) * 100, 100)}%` }"
                />
              </div>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-slate-500">Lokasi Kejadian</label>
              <div
                class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 transition-shadow focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100"
              >
                <span class="text-rose-500">📍</span>
                <input
                  v-model="locationText"
                  type="text"
                  placeholder="Masukkan detail alamat atau patokan lokasi"
                  class="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  @click="useCurrentLocation"
                  :disabled="locatingStatus === 'loading'"
                  class="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span
                    v-if="locatingStatus === 'loading'"
                    class="h-3 w-3 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600"
                  />
                  {{ locatingStatus === 'loading' ? 'Mendeteksi lokasi...' : 'Gunakan Lokasi Saat Ini' }}
                </button>
              </div>

              <p v-if="locatingStatus === 'error'" class="mt-1.5 text-xs text-red-500">
                {{ locationErrorMsg }}
              </p>
              <p v-else-if="locatingStatus === 'success' && locationCoords" class="mt-1.5 text-xs text-slate-400">
                Koordinat terdeteksi: {{ locationCoords.lat.toFixed(6) }}, {{ locationCoords.lng.toFixed(6) }}
              </p>
            </div>
          </div>
        </section>

        <!-- Section 3: Bukti Pendukung -->
        <section>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="step-badge flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">3</span>
              <h2 class="text-base font-semibold text-slate-900">Bukti Pendukung</h2>
            </div>
            <span class="text-xs text-slate-400">(Opsional, sangat disarankan)</span>
          </div>

          <div class="mt-4">
            <div
              class="dropzone flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200"
              :class="isDragging ? 'dropzone--active border-indigo-400 bg-indigo-50 scale-[1.01]' : 'border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/40 hover:border-indigo-300 hover:bg-indigo-50/60'"
              @click="openFilePicker"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <span class="dropzone-icon flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm">☁️</span>
              <p class="text-sm font-medium text-slate-600">
                Tarik &amp; Lepas file di sini<br />
                atau klik untuk memilih file
              </p>
              <p class="text-xs text-slate-400">
                Maks. {{ MAX_FILES }} file (JPG, PNG, MP4). Ukuran maksimal {{ MAX_SIZE_MB }}MB/file.
              </p>
              <input
                ref="fileInputEl"
                type="file"
                class="hidden"
                multiple
                accept="image/jpeg,image/png,video/mp4"
                @change="onFileInputChange"
              />
            </div>

            <p v-if="fileError" class="mt-2 text-xs text-red-500">{{ fileError }}</p>

            <TransitionGroup v-if="files.length" tag="ul" name="file-item" class="mt-3 space-y-2">
              <li
                v-for="f in files"
                :key="f.id"
                class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm"
              >
                <img
                  v-if="f.previewUrl"
                  :src="f.previewUrl"
                  alt=""
                  class="h-10 w-10 flex-none rounded-lg object-cover"
                />
                <span v-else class="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-50 text-lg">🎞️</span>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-700">{{ f.name }}</p>
                  <p class="text-xs text-slate-400">{{ f.sizeLabel }}</p>
                </div>

                <button
                  type="button"
                  @click="removeFile(f.id)"
                  class="flex h-7 w-7 flex-none items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                  aria-label="Hapus file"
                >
                  ✕
                </button>
              </li>
            </TransitionGroup>
          </div>
        </section>

        <!-- Aksi -->
        <div class="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Transition name="fade">
            <span v-if="draftSavedMsg" class="mr-auto text-xs font-medium text-emerald-600">
              Draf tersimpan di perangkat ini.
            </span>
          </Transition>

          <button
            type="button"
            @click="handleCancel"
            class="action-btn rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          >
            Batal
          </button>
          <button
            type="button"
            @click="saveDraft"
            class="action-btn rounded-xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-slate-300"
          >
            Simpan Draf
          </button>
          <button
            type="submit"
            :disabled="!canSubmit || submitting"
            class="action-btn submit-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            <span v-if="submitting" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            <span>▷</span>
            {{ submitting ? 'Mengirim...' : 'Kirim Laporan' }}
          </button>
        </div>
      </form>

      <!-- ===== SIDEBAR ===== -->
      <aside class="fade-in-up sidebar-card relative h-fit overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg shadow-indigo-100/50" style="animation-delay: 120ms">
        <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />

        <div class="flex items-center gap-2">
          <span class="h-px w-6 bg-indigo-500" />
          <h3 class="text-base font-bold text-slate-900">Mengapa Melapor?</h3>
        </div>
        <p class="mt-3 text-sm leading-relaxed text-slate-500">
          Partisipasi Anda adalah kunci kemajuan desa. Setiap laporan yang tervalidasi akan
          ditindaklanjuti oleh aparat terkait.
        </p>

        <ul class="mt-5 space-y-4">
          <li class="benefit-item flex gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-x-0.5 hover:bg-emerald-50">
            <span class="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-transform duration-200 group-hover:scale-110">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4.5 w-4.5">
                <path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" />
              </svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Tepat Sasaran</p>
              <p class="text-xs text-slate-500">Langsung diteruskan ke penanggung jawab.</p>
            </div>
          </li>
          <li class="benefit-item flex gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-x-0.5 hover:bg-sky-50">
            <span class="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4.5 w-4.5">
                <path d="M10 3.5c-4.5 0-8 3.6-8 6.5s3.5 6.5 8 6.5 8-3.6 8-6.5-3.5-6.5-8-6.5Zm0 10.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                <circle cx="10" cy="10" r="1.8" />
              </svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Transparan</p>
              <p class="text-xs text-slate-500">Pantau status laporan secara real-time.</p>
            </div>
          </li>
          <li class="benefit-item flex gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-x-0.5 hover:bg-violet-50">
            <span class="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4.5 w-4.5">
                <path d="M10 1.7 3 4.2v5.1c0 4.4 3 8.1 7 9 4-.9 7-4.6 7-9V4.2L10 1.7Zm-1.1 11.2L5.8 9.8l1.2-1.2 1.9 1.9 4.1-4.1 1.2 1.2-5.3 5.3Z" />
              </svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Aman &amp; Rahasia</p>
              <p class="text-xs text-slate-500">Identitas pelapor dapat disembunyikan.</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<style scoped>
/* ---- page entrance ---- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.fade-in-up {
  animation: fadeInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.header-kicker-dot {
  animation: kickerPulse 2.2s ease-in-out infinite;
}
@keyframes kickerPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

.heading-accent {
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-16px, 18px) scale(1.08); }
}
.animate-blob-float {
  animation: blobFloat 10s ease-in-out infinite;
}
@keyframes blobFloatSlow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(14px, -12px) scale(1.05); }
}
.animate-blob-float-slow {
  animation: blobFloatSlow 13s ease-in-out infinite;
}

/* Success banner pop-in */
.pop-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}
.pop-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.success-check {
  animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes checkPop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

/* Step number badges: gentle pop on mount */
.step-badge {
  animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes badgePop {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Category tiles: bouncier press feedback than a plain color swap */
.category-tile {
  transform-origin: center;
}
.category-tile--active {
  animation: tilePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes tilePop {
  0% { transform: scale(0.94); }
  60% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

/* Drag & drop zone: icon bounces while a file is being dragged over it */
.dropzone-icon {
  transition: transform 0.2s ease;
}
.dropzone--active .dropzone-icon {
  animation: dropBounce 0.6s ease-in-out infinite;
}
@keyframes dropBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.08); }
}

/* Uploaded file rows: slide/scale in and out */
.file-item-enter-from {
  opacity: 0;
  transform: translateX(-8px) scale(0.97);
}
.file-item-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.file-item-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  position: absolute;
}
.file-item-leave-to {
  opacity: 0;
  transform: translateX(8px) scale(0.97);
}
.file-item-move {
  transition: transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

/* Action buttons: consistent lift-and-press feel */
.action-btn:active {
  transform: translateY(0) scale(0.97);
}
.submit-btn {
  background-size: 160% 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.4s ease;
}
.submit-btn:not(:disabled):hover {
  background-position: 100% 0;
}

.sidebar-card {
  transition: box-shadow 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .header-kicker-dot,
  .animate-blob-float,
  .animate-blob-float-slow,
  .pop-enter-active,
  .success-check,
  .step-badge,
  .category-tile--active,
  .dropzone--active .dropzone-icon,
  .file-item-enter-active,
  .file-item-leave-active,
  .file-item-move,
  .fade-enter-active,
  .fade-leave-active,
  .action-btn,
  .submit-btn {
    animation: none !important;
    transition: none !important;
  }
}
</style>