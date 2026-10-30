<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { submitComplaint, uploadComplaintAttachment } from '@/services/complaints.js'

const router = useRouter()

/* ---------------- 1. Complaint category ----------------
   PENTING: value di sini ('Infrastructure', 'Public Service', dst.) SENGAJA
   disamakan persis dengan yang dipakai admin (lihat ComplaintListView admin),
   supaya data yang tersimpan tidak perlu dikonversi lagi nanti kalau sudah
   disambungkan ke backend. Kalau menambah/mengubah kategori di sini, ubah
   juga daftar yang sama di ComplaintListView.vue (publik) & halaman admin. */
const categories = [
  { value: 'Infrastructure', label: 'Infrastruktur', icon: '🛠️' },
  { value: 'Public Service', label: 'Pelayanan Publik', icon: '👥' },
  { value: 'Environment', label: 'Lingkungan', icon: '🌿' },
  { value: 'Security', label: 'Keamanan', icon: '🛡️' },
  { value: 'Other', label: 'Lainnya', icon: '⚠️' },
]
const selectedCategory = ref(null)

const categoryStyles = {
  Infrastructure: {
    active: 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    idleHover: 'hover:border-amber-300 hover:bg-amber-50',
  },
  'Public Service': {
    active: 'border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-500/30',
    idleHover: 'hover:border-violet-300 hover:bg-violet-50',
  },
  Environment: {
    active: 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
    idleHover: 'hover:border-emerald-300 hover:bg-emerald-50',
  },
  Security: {
    active: 'border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/30',
    idleHover: 'hover:border-sky-300 hover:bg-sky-50',
  },
  Other: {
    active: 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30',
    idleHover: 'hover:border-rose-300 hover:bg-rose-50',
  },
}
function getCategoryStyle(value) {
  return categoryStyles[value] ?? { active: 'border-slate-800 bg-slate-800 text-white', idleHover: 'hover:border-slate-300 hover:bg-slate-50' }
}

/* ---------------- 2. Data Pelapor & Detail Aduan ----------------
   Nama dan nomor telepon bersifat opsional agar warga tetap dapat melapor
   secara anonim. NIK & alamat sengaja tidak diminta. Struktur `citizen`
   yang dikirim ke store hanya berisi full_name & phone_number. */
const fullName = ref('')
const phoneNumber = ref('')

const title = ref('')
const description = ref('')

/* --- Lokasi kejadian: geolocation real-time + reverse geocoding (OpenStreetMap Nominatim) --- */
const locationText = ref('')
const locationCoordinates = ref(null)
const locatingStatus = ref('idle')
const locationErrorMessage = ref('')
const locationAccuracy = ref(null)

const TARGET_ACCURACY_M = 25
const MAX_WAIT_MS = 15000
let watchId = null
let watchTimer = null

function stopWatching() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
  if (watchTimer) {
    clearTimeout(watchTimer)
    watchTimer = null
  }
}

function formatAddress(a = {}) {
  const parts = [
    a.road,
    a.neighbourhood || a.hamlet,
    a.village || a.suburb,
    a.city_district || a.county,
    a.city || a.town || a.regency,
  ]
  return [...new Set(parts.filter(Boolean))].join(', ')
}

async function applyPosition(position) {
  const { latitude, longitude, accuracy } = position.coords
  const fallback = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
  locationCoordinates.value = { lat: latitude, lng: longitude }
  locationAccuracy.value = Math.round(accuracy)
  locationText.value = fallback

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=id`
    )
    if (!response.ok) throw new Error('Gagal reverse-geocode')
    const data = await response.json()
    locationText.value = formatAddress(data?.address) || data?.display_name || fallback
  } catch {
    locationText.value = fallback
  } finally {
    locatingStatus.value = 'success'
  }
}

function handleUseCurrentLocation() {
  if (!('geolocation' in navigator)) {
    locatingStatus.value = 'error'
    locationErrorMessage.value = 'Perangkat/browser Anda tidak mendukung geolokasi.'
    return
  }

  stopWatching()
  locatingStatus.value = 'loading'
  locationErrorMessage.value = ''
  locationAccuracy.value = null

  let best = null
  let done = false

  const finish = () => {
    if (done) return
    done = true
    stopWatching()
    if (best) applyPosition(best)
    else {
      locatingStatus.value = 'error'
      locationErrorMessage.value = 'Lokasi tidak dapat dideteksi saat ini.'
    }
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (!best || position.coords.accuracy < best.coords.accuracy) {
        best = position
        locationAccuracy.value = Math.round(position.coords.accuracy)
      }
      if (position.coords.accuracy <= TARGET_ACCURACY_M) finish()
    },
    (error) => {
      if (best) return finish()
      done = true
      stopWatching()
      locatingStatus.value = 'error'
      locationErrorMessage.value =
        error.code === error.PERMISSION_DENIED
          ? 'Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di pengaturan browser Anda.'
          : error.code === error.TIMEOUT
            ? 'Waktu permintaan lokasi habis. Coba lagi.'
            : 'Lokasi tidak dapat dideteksi saat ini.'
    },
    { enableHighAccuracy: true, timeout: MAX_WAIT_MS, maximumAge: 0 }
  )

  watchTimer = setTimeout(finish, MAX_WAIT_MS)
}

/* ---------------- 3. Bukti Pendukung (drag & drop upload) ---------------- */
const MAX_FILES = 3
const MAX_SIZE_MB = 10
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'video/mp4']

const uploadedFiles = ref([])
// Daftar semua file yang ditolak (bukan hanya yang terakhir), supaya tiap masalah terlihat.
const fileErrors = ref([])
const isDragging = ref(false)
const fileInputRef = ref(null)

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function addFiles(fileList) {
  fileErrors.value = []
  const incomingFiles = Array.from(fileList || [])

  for (const file of incomingFiles) {
    if (uploadedFiles.value.length >= MAX_FILES) {
      fileErrors.value.push(`Maksimal ${MAX_FILES} file. "${file.name}" tidak ditambahkan.`)
      continue
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      fileErrors.value.push(`Format "${file.name}" tidak didukung. Gunakan JPG, PNG, atau MP4.`)
      continue
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      fileErrors.value.push(`"${file.name}" berukuran ${formatFileSize(file.size)}, melebihi batas ${MAX_SIZE_MB}MB.`)
      continue
    }
    uploadedFiles.value.push({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      name: file.name,
      type: file.type,
      sizeLabel: formatFileSize(file.size),
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    })
  }
}

function clearFiles() {
  uploadedFiles.value.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
  uploadedFiles.value = []
  fileErrors.value = []
}

function removeFile(id) {
  const index = uploadedFiles.value.findIndex((f) => f.id === id)
  if (index !== -1) {
    if (uploadedFiles.value[index].previewUrl) URL.revokeObjectURL(uploadedFiles.value[index].previewUrl)
    uploadedFiles.value.splice(index, 1)
  }
  fileErrors.value = []
}

function handleDrop(event) {
  isDragging.value = false
  addFiles(event.dataTransfer.files)
}

function handleFileInputChange(event) {
  addFiles(event.target.files)
  event.target.value = ''
}

function openFilePicker() {
  fileInputRef.value?.click()
}

onBeforeUnmount(() => {
  uploadedFiles.value.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl))
  stopWatching()
})

/* ---------------- Draft (tersimpan sementara di perangkat ini) ---------------- */
const DRAFT_STORAGE_KEY = 'aduan-warga-draft'
const isDraftSaved = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (raw) {
      const draft = JSON.parse(raw)
      selectedCategory.value = draft.selectedCategory ?? null
      fullName.value = draft.fullName ?? ''
      phoneNumber.value = draft.phoneNumber ?? ''
      title.value = draft.title ?? ''
      description.value = draft.description ?? ''
      locationText.value = draft.locationText ?? ''
      locationCoordinates.value = draft.locationCoordinates ?? null
    }
  } catch {
    // draft rusak/korup, abaikan saja
  }
})

function saveDraft() {
  const draft = {
    selectedCategory: selectedCategory.value,
    fullName: fullName.value,
    phoneNumber: phoneNumber.value,
    title: title.value,
    description: description.value,
    locationText: locationText.value,
    locationCoordinates: locationCoordinates.value,
  }
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
  isDraftSaved.value = true
  setTimeout(() => (isDraftSaved.value = false), 2500)
}

/* ---------------- Validasi ----------------
   Tombol Kirim tidak lagi di-disable. Saat diklik dengan data belum lengkap,
   `showErrors` menyala: setiap bagian yang bermasalah diberi tanda merah +
   pesan, ringkasan ditampilkan di dekat tombol, dan halaman digulir ke
   bagian pertama yang bermasalah. Setelah itu error ikut hilang otomatis
   begitu pengguna memperbaikinya. */
const showErrors = ref(false)

const FIELD_IDS = {
  category: 'field-category',
  phone: 'field-phone',
  title: 'field-title',
  description: 'field-description',
}

function isPhoneValid(value) {
  const v = value.trim()
  if (!v) return true // opsional
  if (!/^[+\d\s\-()]+$/.test(v)) return false
  const digits = v.replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
}

// Urutan key = urutan tampil di halaman (dipakai untuk menggulir ke error pertama).
const errors = computed(() => {
  const e = {}
  if (!selectedCategory.value) e.category = 'Pilih salah satu kategori aduan.'
  if (!isPhoneValid(phoneNumber.value)) e.phone = 'Nomor telepon tidak valid. Gunakan 8–15 digit angka (boleh diawali +).'
  if (!title.value.trim()) e.title = 'Judul aduan wajib diisi.'
  if (!description.value.trim()) e.description = 'Deskripsi laporan wajib diisi.'
  return e
})

const errorList = computed(() =>
  Object.entries(errors.value).map(([key, message]) => ({ key, id: FIELD_IDS[key], message }))
)
const isFormValid = computed(() => errorList.value.length === 0)

function scrollToField(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  const focusable = el.matches('input,textarea,button') ? el : el.querySelector('input,textarea,button')
  focusable?.focus({ preventScroll: true })
}

/* ---------------- Submit ---------------- */
const isSubmitting = ref(false)
const isSubmitSuccess = ref(false)
const submitError = ref('')

async function submitReport() {
  if (isSubmitting.value) return

  showErrors.value = true
  submitError.value = ''
  if (!isFormValid.value) {
    scrollToField(errorList.value[0].id)
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      title: title.value.trim(),
      description: description.value.trim(),
      category: selectedCategory.value,
      reporter_name: fullName.value.trim(),
      reporter_phone: phoneNumber.value.trim(),
      location: locationText.value || null,
      latitude: locationCoordinates.value?.lat ?? null,
      longitude: locationCoordinates.value?.lng ?? null,
    }

    const complaint = await submitComplaint(payload)

    // upload lampiran satu-satu setelah complaint utama berhasil dibuat
    for (const uploaded of uploadedFiles.value) {
      await uploadComplaintAttachment(complaint.complaint_id, uploaded.file)
    }

    isSubmitSuccess.value = true
    showErrors.value = false
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error('Gagal mengirim aduan:', err)
    submitError.value = err.response?.data?.message || 'Gagal mengirim laporan, coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

function goToComplaintList() {
  router.push({ name: 'complaints' })
}

function resetForm() {
  selectedCategory.value = null
  fullName.value = ''
  phoneNumber.value = ''
  title.value = ''
  description.value = ''
  locationText.value = ''
  locationCoordinates.value = null
  locatingStatus.value = 'idle'
  locationErrorMessage.value = ''
  locationAccuracy.value = null
  showErrors.value = false
  submitError.value = ''
  clearFiles()
}

function handleCancel() {
  resetForm()
  localStorage.removeItem(DRAFT_STORAGE_KEY)
}

/* Kelas transisi bersama (dipakai lewat prop enter-active-class dkk pada
   <Transition>/<TransitionGroup>), menggantikan @keyframes di <style scoped>. */
const EASE_BOUNCE = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'
const fadeUpEnter = `transition duration-500 ${EASE_BOUNCE} motion-reduce:transition-none motion-reduce:duration-0`
const popEnterActive = `transition duration-400 ${EASE_BOUNCE} motion-reduce:transition-none motion-reduce:duration-0`
</script>

<template>
  <div class="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 md:px-6">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl motion-safe:animate-[pulse_10s_ease-in-out_infinite]" />
    <div class="pointer-events-none absolute -right-16 top-24 -z-10 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl motion-safe:animate-[pulse_13s_ease-in-out_infinite]" />
    <div class="pointer-events-none absolute left-1/4 bottom-0 -z-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl motion-safe:animate-[pulse_16s_ease-in-out_infinite]" />

    <Transition appear :enter-active-class="fadeUpEnter" enter-from-class="opacity-0 translate-y-3" enter-to-class="opacity-100 translate-y-0">
      <div class="mb-2">
        <Button text icon="pi pi-arrow-left" label="Kembali ke Daftar Aduan" class="!px-0 !text-slate-500 hover:!text-indigo-600" @click="goToComplaintList" />
      </div>
    </Transition>

    <Transition appear :enter-active-class="fadeUpEnter" enter-from-class="opacity-0 translate-y-3" enter-to-class="opacity-100 translate-y-0">
      <div>
        <div class="inline-flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-indigo-500 motion-safe:animate-pulse" />
          <span class="text-xs font-bold uppercase tracking-[0.25em] text-indigo-600">Suarakan</span>
        </div>
        <h1 class="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          Laporkan <span class="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Aduan</span>
        </h1>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Sampaikan permasalahan infrastruktur, pelayanan publik, atau kejadian di lingkungan kalurahan.
          Laporan Anda membantu kami membangun kalurahan yang lebih baik.
        </p>
      </div>
    </Transition>

    <Transition
      :enter-active-class="popEnterActive"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
    >
      <div v-if="isSubmitSuccess" class="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3.5 text-sm text-emerald-700 shadow-sm">
        <span class="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-500 text-xs text-white">✓</span>
        <div class="flex-1">
          <p class="font-semibold">Laporan aduan Anda berhasil terkirim!</p>
          <p class="mt-0.5 text-emerald-600">Laporan akan segera diproses oleh tim terkait. Terima kasih atas partisipasi Anda.</p>
          <button type="button" @click="goToComplaintList" class="mt-2 text-xs font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800">
            Lihat status di Daftar Aduan →
          </button>
        </div>
      </div>
    </Transition>

    <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Transition appear :enter-active-class="`${fadeUpEnter} delay-[60ms]`" enter-from-class="opacity-0 translate-y-3" enter-to-class="opacity-100 translate-y-0">
      <form class="space-y-8 lg:col-span-2" novalidate @submit.prevent="submitReport">
        <!-- Section 1: Kategori -->
        <section>
          <div class="flex items-center gap-2.5">
            <Transition appear :enter-active-class="popEnterActive" enter-from-class="scale-50 opacity-0" enter-to-class="scale-100 opacity-100">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">1</span>
            </Transition>
            <h2 class="text-base font-semibold text-slate-900">Kategori Aduan <span class="text-rose-500">*</span></h2>
          </div>
          <div class="mt-3 border-b border-slate-100 pb-6">
            <div
              id="field-category"
              class="grid grid-cols-2 gap-3 rounded-2xl sm:grid-cols-5"
              :class="showErrors && errors.category && 'p-2 ring-2 ring-rose-300 ring-offset-2'"
            >
              <button
                v-for="category in categories"
                :key="category.value"
                type="button"
                @click="selectedCategory = category.value"
                class="relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all duration-200 active:scale-95"
                :class="
                  selectedCategory === category.value
                    ? [getCategoryStyle(category.value).active, 'scale-[1.02]']
                    : ['border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:shadow-md', getCategoryStyle(category.value).idleHover]
                "
              >
                <Transition :enter-active-class="`transition duration-300 ${EASE_BOUNCE}`" enter-from-class="scale-0" enter-to-class="scale-100">
                  <span v-if="selectedCategory === category.value" class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] text-white shadow">✓</span>
                </Transition>
                <span class="text-2xl transition-transform duration-200" :class="selectedCategory === category.value && 'scale-110'">{{ category.icon }}</span>
                <span class="text-xs font-semibold leading-tight">{{ category.label }}</span>
              </button>
            </div>
            <p v-if="showErrors && errors.category" class="mt-2 text-xs font-medium text-rose-600" role="alert">{{ errors.category }}</p>
          </div>
        </section>

        <!-- Section 2: Data Pelapor & Detail Aduan -->
        <section>
          <div class="flex items-center gap-2.5">
            <Transition appear :enter-active-class="popEnterActive" enter-from-class="scale-50 opacity-0" enter-to-class="scale-100 opacity-100">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">2</span>
            </Transition>
            <h2 class="text-base font-semibold text-slate-900">Data Pelapor &amp; Detail Aduan</h2>
          </div>

          <div class="mt-4 space-y-5 border-b border-slate-100 pb-6">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label for="field-name" class="mb-1.5 block text-xs font-semibold text-slate-500">Nama Lengkap <span class="font-normal text-slate-400">(opsional)</span></label>
                <InputText id="field-name" v-model="fullName" placeholder="Boleh dikosongkan untuk anonim" class="w-full" />
              </div>
              <div>
                <label for="field-phone" class="mb-1.5 block text-xs font-semibold text-slate-500">Nomor Telepon <span class="font-normal text-slate-400">(opsional)</span></label>
                <InputText
                  id="field-phone"
                  v-model="phoneNumber"
                  inputmode="tel"
                  placeholder="Boleh dikosongkan untuk anonim"
                  class="w-full"
                  :invalid="showErrors && !!errors.phone"
                />
                <p v-if="showErrors && errors.phone" class="mt-1.5 text-xs font-medium text-rose-600" role="alert">{{ errors.phone }}</p>
              </div>
            </div>

            <div>
              <label for="field-title" class="mb-1.5 block text-xs font-semibold text-slate-500">Judul Aduan/Topik <span class="text-rose-500">*</span></label>
              <InputText
                id="field-title"
                v-model="title"
                placeholder="Contoh: Jalan berlubang di Jl. Merdeka"
                class="w-full"
                :invalid="showErrors && !!errors.title"
              />
              <p v-if="showErrors && errors.title" class="mt-1.5 text-xs font-medium text-rose-600" role="alert">{{ errors.title }}</p>
            </div>

            <div>
              <div>
                <label for="field-description" class="mb-1.5 block text-xs font-semibold text-slate-500">Deskripsi Laporan <span class="text-rose-500">*</span></label>
                <Textarea
                  id="field-description"
                  v-model="description"
                  rows="4"
                  placeholder="Ceritakan secara detail mengenai masalah yang Anda temui. Kapan terjadi? Apa dampaknya?"
                  class="w-full"
                  :invalid="showErrors && !!errors.description"
                />
              </div>

              <p v-if="showErrors && errors.description" class="mt-1.5 text-xs font-medium text-rose-600" role="alert">{{ errors.description }}</p>
            </div>

            <div>
              <label class="mb-1.5 block text-xs font-semibold text-slate-500">Lokasi Kejadian</label>
              <div class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 transition-shadow focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                <span class="shrink-0 text-rose-500">📍</span>
                <input
                  v-model="locationText"
                  type="text"
                  placeholder="Masukkan detail alamat atau patokan lokasi"
                  class="min-w-0 flex-1 truncate bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  @click="handleUseCurrentLocation"
                  :disabled="locatingStatus === 'loading'"
                  class="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span v-if="locatingStatus === 'loading'" class="h-3 w-3 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
                  <template v-if="locatingStatus === 'loading'">
                    <span class="sm:hidden">Mencari...</span>
                    <span class="hidden sm:inline">Mendeteksi lokasi...</span>
                  </template>
                  <template v-else>
                    <span class="sm:hidden">Lokasi Saya</span>
                    <span class="hidden sm:inline">Gunakan Lokasi Saat Ini</span>
                  </template>
                </button>
              </div>
              <p v-if="locatingStatus === 'loading' && locationAccuracy" class="mt-1.5 text-xs text-slate-400">
                Mengunci sinyal GPS... akurasi saat ini ±{{ locationAccuracy }} m
              </p>
              <p v-else-if="locatingStatus === 'error'" class="mt-1.5 text-xs text-red-500">{{ locationErrorMessage }}</p>
              <template v-else-if="locatingStatus === 'success' && locationCoordinates">
                <p class="mt-1.5 text-xs text-slate-400">
                  Koordinat: {{ locationCoordinates.lat.toFixed(6) }}, {{ locationCoordinates.lng.toFixed(6) }}
                  <template v-if="locationAccuracy">(akurasi ±{{ locationAccuracy }} m)</template>
                </p>
                <p v-if="locationAccuracy > 100" class="mt-1 text-xs text-amber-600">
                  Akurasi masih rendah. Coba di tempat terbuka atau dari HP, lalu periksa dan sesuaikan alamat/patokan di atas.
                </p>
              </template>
            </div>
          </div>
        </section>

        <!-- Section 3: Bukti Pendukung -->
        <section id="field-files">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <Transition appear :enter-active-class="popEnterActive" enter-from-class="scale-50 opacity-0" enter-to-class="scale-100 opacity-100">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white shadow-sm shadow-indigo-500/30">3</span>
              </Transition>
              <h2 class="text-base font-semibold text-slate-900">Bukti Pendukung</h2>
            </div>
            <span class="text-xs text-slate-400">(Opsional, sangat disarankan)</span>
          </div>

          <div class="mt-4">
            <div
              class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200"
              :class="
                isDragging
                  ? 'scale-[1.01] border-indigo-400 bg-indigo-50'
                  : fileErrors.length
                    ? 'border-rose-300 bg-rose-50/40 hover:border-rose-400'
                    : 'border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/40 hover:border-indigo-300 hover:bg-indigo-50/60'
              "
              @click="openFilePicker"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <span
                class="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm transition-transform duration-200"
                :class="isDragging && 'motion-safe:animate-bounce'"
              >☁️</span>
              <p class="text-sm font-medium text-slate-600">Tarik &amp; Lepas file di sini<br />atau klik untuk memilih file</p>
              <p class="text-xs text-slate-400">Maks. {{ MAX_FILES }} file (JPG, PNG, MP4). Ukuran maksimal {{ MAX_SIZE_MB }}MB/file.</p>
              <input ref="fileInputRef" type="file" class="hidden" multiple accept="image/jpeg,image/png,video/mp4" @change="handleFileInputChange" />
            </div>

            <div v-if="fileErrors.length" class="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5" role="alert">
              <p class="text-xs font-semibold text-rose-700">{{ fileErrors.length }} file tidak dapat ditambahkan:</p>
              <ul class="mt-1 list-disc space-y-0.5 pl-4 text-xs text-rose-600">
                <li v-for="(msg, i) in fileErrors" :key="i">{{ msg }}</li>
              </ul>
            </div>

            <TransitionGroup
              v-if="uploadedFiles.length"
              tag="ul"
              class="mt-3 space-y-2"
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-x-2 scale-95"
              leave-active-class="transition-all duration-200 ease-in absolute"
              leave-to-class="opacity-0 translate-x-2 scale-95"
              move-class="transition-transform duration-300"
            >
              <li v-for="uploadedFile in uploadedFiles" :key="uploadedFile.id" class="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
                <img v-if="uploadedFile.previewUrl" :src="uploadedFile.previewUrl" alt="" class="h-10 w-10 flex-none rounded-lg object-cover" />
                <span v-else class="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-indigo-50 text-lg">🎞️</span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-slate-700">{{ uploadedFile.name }}</p>
                  <p class="text-xs text-slate-400">{{ uploadedFile.sizeLabel }}</p>
                </div>
                <button type="button" @click="removeFile(uploadedFile.id)" class="flex h-7 w-7 flex-none items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500" aria-label="Hapus file">✕</button>
              </li>
            </TransitionGroup>
          </div>
        </section>

        <!-- Ringkasan kesalahan (muncul dekat tombol Kirim, setelah pengguna mencoba mengirim) -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-to-class="opacity-0"
        >
          <div v-if="showErrors && errorList.length" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700 shadow-sm" role="alert">
            <p class="font-semibold">Laporan belum bisa dikirim. Lengkapi {{ errorList.length }} bagian berikut:</p>
            <ul class="mt-2 list-disc space-y-1 pl-5">
              <li v-for="err in errorList" :key="err.key">
                <button type="button" class="text-left underline underline-offset-2 hover:text-rose-900" @click="scrollToField(err.id)">
                  {{ err.message }}
                </button>
              </li>
            </ul>
          </div>
        </Transition>

        <!-- Error dari server/jaringan -->
        <div v-if="submitError" class="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          <span class="mt-0.5">⚠️</span>
          <p>{{ submitError }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Transition
            enter-active-class="transition-opacity duration-300"
            leave-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <span v-if="isDraftSaved" class="mr-auto text-xs font-medium text-emerald-600">Draf tersimpan di perangkat ini.</span>
          </Transition>
          <Button type="button" label="Batal" severity="secondary" outlined @click="handleCancel" />
          <Button type="button" label="Simpan Draf" severity="secondary" @click="saveDraft" />
          <Button
            type="submit"
            :label="isSubmitting ? 'Mengirim...' : 'Kirim Laporan'"
            icon="pi pi-send"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="transition-transform duration-200 hover:-translate-y-0.5"
          />
        </div>
      </form>
      </Transition>

      <Transition appear :enter-active-class="`${fadeUpEnter} delay-[120ms]`" enter-from-class="opacity-0 translate-y-3" enter-to-class="opacity-100 translate-y-0">
      <aside class="relative h-fit overflow-hidden rounded-2xl border border-indigo-100 bg-white p-6 shadow-lg shadow-indigo-100/50 transition-shadow duration-300">
        <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" />
        <div class="flex items-center gap-2">
          <span class="h-px w-6 bg-indigo-500" />
          <h3 class="text-base font-bold text-slate-900">Mengapa Melapor?</h3>
        </div>
        <p class="mt-3 text-sm leading-relaxed text-slate-500">
          Partisipasi Anda adalah kunci kemajuan kalurahan. Setiap laporan yang tervalidasi akan ditindaklanjuti oleh aparat terkait.
        </p>
        <ul class="mt-5 space-y-4">
          <li class="flex gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-x-0.5 hover:bg-emerald-50">
            <span class="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4.5 w-4.5"><path fill-rule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clip-rule="evenodd" /></svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Tepat Sasaran</p>
              <p class="text-xs text-slate-500">Langsung diteruskan ke penanggung jawab.</p>
            </div>
          </li>
          <li class="flex gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-x-0.5 hover:bg-sky-50">
            <span class="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sky-100 text-sky-600">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4.5 w-4.5"><path d="M10 3.5c-4.5 0-8 3.6-8 6.5s3.5 6.5 8 6.5 8-3.6 8-6.5-3.5-6.5-8-6.5Zm0 10.5a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /><circle cx="10" cy="10" r="1.8" /></svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Transparan</p>
              <p class="text-xs text-slate-500">Pantau status laporan secara real-time.</p>
            </div>
          </li>
          <li class="flex gap-3 rounded-xl p-2 transition-all duration-200 hover:-translate-x-0.5 hover:bg-violet-50">
            <span class="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <svg viewBox="0 0 20 20" fill="currentColor" class="h-4.5 w-4.5"><path d="M10 1.7 3 4.2v5.1c0 4.4 3 8.1 7 9 4-.9 7-4.6 7-9V4.2L10 1.7Zm-1.1 11.2L5.8 9.8l1.2-1.2 1.9 1.9 4.1-4.1 1.2 1.2-5.3 5.3Z" /></svg>
            </span>
            <div>
              <p class="text-sm font-semibold text-slate-800">Aman &amp; Rahasia</p>
              <p class="text-xs text-slate-500">Identitas pelapor dapat disembunyikan.</p>
            </div>
          </li>
        </ul>
      </aside>
      </Transition>
    </div>
  </div>
</template>