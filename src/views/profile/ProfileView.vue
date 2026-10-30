<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import heroImageUrl from '@/assets/hero/hero1.jpeg'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import ProgressSpinner from 'primevue/progressspinner'
import Image from 'primevue/image'
import Carousel from 'primevue/carousel'
import Message from 'primevue/message'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import api from '@/services/api'
import {
  getHistories,
  getVisionMissions,
  getOrganizationalStructures,
  getRegions,
  getRegionAreas,
  profileMediaUrl,
  readProfileCache,
  writeProfileCache,
} from '@/services/profile'

/* -------------------------------------------------------------------------- */
/*  Pengurus RW / RT dari /region-areas                                       */
/*  Bentuk: [{ dusun, rws: [{ rw, head_name, head, rts: [...] }] }]          */
/*  Objek `head` (biodata, riwayat) ikut diteruskan ke popup detail.          */
/* -------------------------------------------------------------------------- */
const EMPTY_LEADERS = { rw: [], rt: [] }

// Field detail ketua yang diisi dari admin (Data Wilayah > Kelola RW dan RT).
// Nomor HP sengaja tidak ikut diteruskan supaya tidak tampil di halaman publik.
const LEADER_DETAIL_KEYS = [
  'gender', 'birth_date', 'education', 'major', 'school_name', 'graduation_year',
  'sk_number', 'start_date', 'end_date', 'position_history',
]

function pickLeaderDetail(item) {
  const result = {}
  LEADER_DETAIL_KEYS.forEach((key) => {
    if (item?.[key] !== undefined && item[key] !== null) result[key] = item[key]
  })
  return result
}

// Biodata ada di `head`; masa jabatan & SK ada di assignments[0].
function leaderFromHead(head) {
  const a = Array.isArray(head?.assignments) ? head.assignments[0] : null
  return {
    ...(head ?? {}),
    start_date: head?.start_date ?? a?.start_date ?? null,
    end_date: head?.end_date ?? a?.end_date ?? null,
    sk_number: head?.sk_number ?? a?.sk_number ?? null,
  }
}

function leadersFromRegionAreas(areas) {
  const result = { rw: [], rt: [] }
  ;(Array.isArray(areas) ? areas : []).forEach((dusun) => {
    ;(Array.isArray(dusun?.rws) ? dusun.rws : []).forEach((rw) => {
      if (rw?.head_name) {
        result.rw.push({
          ...leaderFromHead(rw.head),
          name: rw.head_name,
          rw_number: rw.rw,
          padukuhan: dusun.dusun,
          is_active: true,
        })
      }
      ;(Array.isArray(rw?.rts) ? rw.rts : []).forEach((rt) => {
        if (!rt?.head_name) return
        result.rt.push({
          ...leaderFromHead(rt.head),
          name: rt.head_name,
          rt_number: rt.rt,
          rw_number: rw.rw,
          padukuhan: dusun.dusun,
          is_active: true,
        })
      })
    })
  })
  return result
}

/* -------------------------------------------------------------------------- */
/*  Leaflet default icon                                                      */
/* -------------------------------------------------------------------------- */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

/* -------------------------------------------------------------------------- */
/*  Tailwind class constants (ditulis utuh supaya terbaca oleh Tailwind)      */
/* -------------------------------------------------------------------------- */
const REVEAL_HIDDEN = ['opacity-0', 'translate-y-4']
const REVEAL_VISIBLE = ['opacity-100', 'translate-y-0']

const REVEAL =
  'js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0'
const REVEAL_CARD =
  'js-reveal opacity-0 translate-y-4 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0'

const STAGGER_DELAYS = ['delay-0', 'delay-75', 'delay-150', 'delay-200', 'delay-300', 'delay-500']
function staggerDelay(i) {
  return STAGGER_DELAYS[Math.min(i, STAGGER_DELAYS.length - 1)]
}

const HERO_WORD_DELAYS = ['delay-150', 'delay-[240ms]', 'delay-[330ms]', 'delay-[420ms]', 'delay-500']
function heroWordDelay(i) {
  return HERO_WORD_DELAYS[Math.min(i, HERO_WORD_DELAYS.length - 1)]
}

/* -------------------------------------------------------------------------- */
/*  State                                                                     */
/* -------------------------------------------------------------------------- */
const heroImageLoaded = ref(false)
const mounted = ref(false)

const heroTitleWords = 'Profil Kalurahan Bimomartani'.split(' ')

const historyData = ref(null)
const visionMission = ref(null)
const orgStructureData = ref(null)
const regions = ref([])
const neighborhoodLeaders = ref(EMPTY_LEADERS)
const profileLoading = ref(true)
const profileError = ref('')

const historyPoints = computed(() => (
  Array.isArray(historyData.value?.points) ? historyData.value.points.filter(Boolean) : []
))
const historyPhotos = computed(() => (
  Array.isArray(historyData.value?.photos) ? historyData.value.photos : []
))
const missionsData = computed(() => (
  Array.isArray(visionMission.value?.missions) ? visionMission.value.missions.filter(Boolean) : []
))
// Level Ketua RW / Ketua RT sudah ditampilkan di carousel "Ketua RW/RT Aktif",
// jadi disembunyikan dari daftar level supaya tidak dobel.
function isNeighborhoodLevel(level) {
  const name = String(level?.level ?? '')
  if (/\b(rw|rt)\b/i.test(name)) return true
  const people = Array.isArray(level?.people) ? level.people : []
  return people.length > 0 && people.every((p) => /ketua\s+(rw|rt)\b/i.test(String(p?.title ?? '')))
}

const orgStructure = computed(() => (
  Array.isArray(orgStructureData.value?.levels)
    ? orgStructureData.value.levels.filter((level) => !isNeighborhoodLevel(level))
    : []
))

const formerOfficials = computed(() => {
  const data = orgStructureData.value
  if (!data || !data.show_former_officials) return []
  return Array.isArray(data.former_officials) ? data.former_officials : []
})

const hasAnyProfileData = computed(() => Boolean(
  historyData.value || visionMission.value || orgStructureData.value || regions.value.length,
))

/* -------------------------------------------------------------------------- */
/*  RW / RT helpers                                                           */
/* -------------------------------------------------------------------------- */
function padNumber(value) {
  const v = String(value ?? '').trim()
  return /^\d+$/.test(v) ? v.padStart(2, '0') : v
}

// Hanya pengurus aktif, diurutkan per padukuhan lalu nomor.
function sortActiveLeaders(list, numberKey) {
  return (Array.isArray(list) ? list : [])
    .filter((item) => item && item.is_active !== false)
    .slice()
    .sort((a, b) => (
      String(a.padukuhan ?? '').localeCompare(String(b.padukuhan ?? ''))
      || Number(a[numberKey] ?? 0) - Number(b[numberKey] ?? 0)
      || Number(a.rw_number ?? 0) - Number(b.rw_number ?? 0)
    ))
}

// Ketua RW / RT yang diinput lewat admin (Struktur Organisasi) ikut tampil di sini.
function todayLocal() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const structureLeaders = computed(() => {
  const levels = Array.isArray(orgStructureData.value?.levels) ? orgStructureData.value.levels : []
  const people = levels.flatMap((level) => (Array.isArray(level?.people) ? level.people : []))
  const today = todayLocal()

  // Aktif jika belum ada tanggal selesai, atau tanggal selesainya belum lewat.
  const isActive = (p) => {
    const end = p.end_date || p.term_end_date
    return !end || String(end) >= today
  }

  const toLeader = (p) => ({
    ...p,
    name: p.name,
    rt_number: p.rt_number,
    rw_number: p.rw_number,
    padukuhan: p.padukuhan,
    is_active: isActive(p),
  })

  return {
    rw: people.filter((p) => /^ketua\s+rw\b/i.test(String(p?.title ?? ''))).map(toLeader),
    rt: people.filter((p) => /^ketua\s+rt\b/i.test(String(p?.title ?? ''))).map(toLeader),
  }
})

// Data dari endpoint/dummy tetap tampil (diurutkan), lalu data dari admin ditempel di belakangnya.
// Admin yang sama (nama + nomor) dengan data endpoint tidak ditampilkan dua kali.
function mergeLeaders(baseList, adminList, numberKey) {
  const base = sortActiveLeaders(baseList, numberKey)
  const keyOf = (item) => [
    String(item.name ?? '').trim().toLowerCase(),
    String(item.rw_number ?? ''),
    String(item.rt_number ?? ''),
  ].join('|')
  const seen = new Set(base.map(keyOf))
  const extra = (Array.isArray(adminList) ? adminList : [])
    .filter((item) => item && item.is_active !== false && !seen.has(keyOf(item)))
  return [...base, ...extra]
}

const activeRwLeaders = computed(() => mergeLeaders(
  neighborhoodLeaders.value?.rw,
  structureLeaders.value.rw,
  'rw_number',
))
const activeRtLeaders = computed(() => mergeLeaders(
  neighborhoodLeaders.value?.rt,
  structureLeaders.value.rt,
  'rt_number',
))

const leaderGroups = computed(() => [
  { key: 'rw', title: 'Ketua RW Aktif', role: 'Ketua RW', accentOffset: 0, items: activeRwLeaders.value },
  { key: 'rt', title: 'Ketua RT Aktif', role: 'Ketua RT', accentOffset: 3, items: activeRtLeaders.value },
].filter((group) => group.items.length))

function leaderBadge(group, item) {
  const label = group.key === 'rw' ? 'RW' : 'RT'
  const number = padNumber(group.key === 'rw' ? item.rw_number : item.rt_number)
  return number ? `${label} ${number}` : label
}

// Klik kartu Ketua RW/RT aktif -> buka popup detail yang sama dengan pejabat lain.
function openLeaderDetail(group, item) {
  openDetail(
    {
      ...item,
      title: `${group.role} ${padNumber(group.key === 'rw' ? item.rw_number : item.rt_number)}`.trim(),
      wilayah: leaderLocation(group, item),
      hidePhoto: true,
    },
    { level: group.title },
  )
}

function leaderLocation(group, item) {
  const padukuhan = item.padukuhan ? `Padukuhan ${item.padukuhan}` : 'Padukuhan —'
  if (group.key === 'rw') return padukuhan
  const rw = padNumber(item.rw_number)
  return rw ? `RW ${rw} · ${padukuhan}` : padukuhan
}

const leaderAccents = [
  { cardBorder: 'border-amber-400', titleText: 'text-amber-600', badgeBg: '!bg-amber-600' },
  { cardBorder: 'border-violet-400', titleText: 'text-violet-600', badgeBg: '!bg-violet-600' },
  { cardBorder: 'border-emerald-400', titleText: 'text-emerald-600', badgeBg: '!bg-emerald-600' },
  { cardBorder: 'border-sky-400', titleText: 'text-sky-600', badgeBg: '!bg-sky-600' },
  { cardBorder: 'border-rose-400', titleText: 'text-rose-600', badgeBg: '!bg-rose-600' },
  { cardBorder: 'border-indigo-400', titleText: 'text-indigo-600', badgeBg: '!bg-indigo-600' },
]
function leaderAccentFor(i) {
  return leaderAccents[i % leaderAccents.length]
}

const leaderCarouselBreakpoints = [
  { breakpoint: '1280px', numVisible: 4, numScroll: 1 },
  { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
  { breakpoint: '768px', numVisible: 2, numScroll: 1 },
  { breakpoint: '480px', numVisible: 1, numScroll: 1 },
]

/* -------------------------------------------------------------------------- */
/*  Former officials (DataTable)                                              */
/* -------------------------------------------------------------------------- */
const formerTablePt = {
  table: { class: 'min-w-[560px]' },
}
const formerColumnPt = {
  headerCell: { class: '!bg-blue-50 !text-xs !font-bold !uppercase !tracking-wider !text-blue-700' },
  bodyCell: { class: '!text-sm !text-slate-600' },
}

// Contoh: "Ketua RT 01", "Ketua RW 02".
function formatJabatanFormer(item) {
  if (item?.jabatan === 'Ketua RT' && item.rt_number) return `${item.jabatan} ${padNumber(item.rt_number)}`
  if (item?.jabatan === 'Ketua RW' && item.rw_number) return `${item.jabatan} ${padNumber(item.rw_number)}`
  return item?.jabatan ?? ''
}

// Contoh: "RW 02, Padukuhan Krebet" (RT) atau "Padukuhan Krebet" (RW).
function formatWilayahFormer(item) {
  const parts = []
  if (item?.jabatan === 'Ketua RT' && item.rw_number) parts.push(`RW ${padNumber(item.rw_number)}`)
  if ((item?.jabatan === 'Ketua RT' || item?.jabatan === 'Ketua RW') && item.padukuhan) {
    parts.push(`Padukuhan ${item.padukuhan}`)
  }
  return parts.length ? parts.join(', ') : '—'
}

// Masa jabatan pejabat terdahulu: tanggal lengkap (tgl bulan tahun); kalau tanggal tidak ada, jatuh ke tahun saja.
function formatMasaPoint(item, dateKeys, yearKey) {
  const rawDate = dateKeys.map((key) => item?.[key]).find(Boolean)
  return formatDate(rawDate) || item?.[yearKey] || '?'
}

function formatMasaJabatan(item) {
  const startKeys = ['start_date', 'term_start_date', 'tanggal_mulai']
  const endKeys = ['end_date', 'term_end_date', 'tanggal_selesai']
  const hasStart = item?.start_year || startKeys.some((key) => item?.[key])
  const hasEnd = item?.end_year || endKeys.some((key) => item?.[key])
  if (!hasStart && !hasEnd) return '—'
  return `${formatMasaPoint(item, startKeys, 'start_year')} – ${formatMasaPoint(item, endKeys, 'end_year')}`
}

/* -------------------------------------------------------------------------- */
/*  Hero parallax                                                             */
/* -------------------------------------------------------------------------- */
const heroOffset = ref(0)
let rafId = null
function onHeroScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    heroOffset.value = Math.min(window.scrollY * 0.12, 40)
    rafId = null
  })
}

/* -------------------------------------------------------------------------- */
/*  Section nav (scroll-spy)                                                  */
/* -------------------------------------------------------------------------- */
const sections = [
  { id: 'history', label: 'Sejarah' },
  { id: 'vision-mission', label: 'Visi & Misi' },
  { id: 'org-structure', label: 'Struktur Organisasi' },
  { id: 'wilayah', label: 'Wilayah & Demografi' },
]
const activeSection = ref('history')

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onTabChange(id) {
  activeSection.value = id
  scrollTo(id)
}

/* -------------------------------------------------------------------------- */
/*  Accent styles                                                             */
/* -------------------------------------------------------------------------- */
const accentStyles = [
  { border: '!border-l-blue-600', soft: '!from-blue-50', avatarBg: '!bg-blue-600', statBorder: 'border-blue-100', statIconBg: 'bg-blue-100', statIconText: 'text-blue-600', statHover: 'group-hover:bg-blue-600' },
  { border: '!border-l-violet-600', soft: '!from-violet-50', avatarBg: '!bg-violet-600', statBorder: 'border-violet-100', statIconBg: 'bg-violet-100', statIconText: 'text-violet-600', statHover: 'group-hover:bg-violet-600' },
  { border: '!border-l-teal-600', soft: '!from-teal-50', avatarBg: '!bg-teal-600', statBorder: 'border-teal-100', statIconBg: 'bg-teal-100', statIconText: 'text-teal-600', statHover: 'group-hover:bg-teal-600' },
  { border: '!border-l-amber-600', soft: '!from-amber-50', avatarBg: '!bg-amber-600', statBorder: 'border-amber-100', statIconBg: 'bg-amber-100', statIconText: 'text-amber-600', statHover: 'group-hover:bg-amber-600' },
  { border: '!border-l-rose-600', soft: '!from-rose-50', avatarBg: '!bg-rose-600', statBorder: 'border-rose-100', statIconBg: 'bg-rose-100', statIconText: 'text-rose-600', statHover: 'group-hover:bg-rose-600' },
  { border: '!border-l-indigo-600', soft: '!from-indigo-50', avatarBg: '!bg-indigo-600', statBorder: 'border-indigo-100', statIconBg: 'bg-indigo-100', statIconText: 'text-indigo-600', statHover: 'group-hover:bg-indigo-600' },
]
function accentFor(i) {
  return accentStyles[i % accentStyles.length]
}

const orgCardAccents = [
  { cardBorder: 'border-amber-400', titleText: 'text-amber-600', avatarBg: '!bg-amber-500' },
  { cardBorder: 'border-violet-400', titleText: 'text-violet-600', avatarBg: '!bg-violet-500' },
  { cardBorder: 'border-emerald-400', titleText: 'text-emerald-600', avatarBg: '!bg-emerald-500' },
  { cardBorder: 'border-indigo-400', titleText: 'text-indigo-600', avatarBg: '!bg-indigo-500' },
  { cardBorder: 'border-sky-400', titleText: 'text-sky-600', avatarBg: '!bg-sky-500' },
  { cardBorder: 'border-rose-400', titleText: 'text-rose-600', avatarBg: '!bg-rose-500' },
]
function orgAccentFor(i) {
  return orgCardAccents[i % orgCardAccents.length]
}

/* -------------------------------------------------------------------------- */
/*  Organization levels                                                       */
/* -------------------------------------------------------------------------- */
function isCarikLevel(level) {
  const name = String(level?.level ?? '').toLowerCase()
  if (name.includes('carik')) return true
  return Array.isArray(level?.people) && level.people.some((p) =>
    String(p?.title ?? '').toLowerCase().includes('carik'),
  )
}

const LEVEL_ROW_BASE =
  'flex snap-x snap-proximity gap-4 overflow-x-auto scroll-pl-4 pb-3 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-200'

// Slider: satu baris yang bisa digeser. Selain itu: wrap & rata tengah di layar >= sm.
// Level "Carik" selalu rata tengah.
function levelRowClass(level) {
  const carik = isCarikLevel(level)
  if (level?.slider) return `${LEVEL_ROW_BASE} ${carik ? 'justify-center' : 'justify-start'}`
  return `${LEVEL_ROW_BASE} sm:flex-wrap sm:overflow-x-visible sm:snap-none sm:pb-0 ${carik ? 'justify-center' : 'sm:justify-center'}`
}

/* -------------------------------------------------------------------------- */
/*  Detail pejabat (popup saat kartu diklik)                                  */
/* -------------------------------------------------------------------------- */
const detailVisible = ref(false)
const detail = ref(null)

function openDetail(person, level) {
  detail.value = { ...person, level: level?.level ?? '' }
  detailVisible.value = true
}

// Pejabat terdahulu memakai field `nama`/`jabatan`; dipetakan ke bentuk yang dipakai popup (name/title).
function openFormerDetail(item) {
  openDetail(
    { ...item, name: item?.nama, title: formatJabatanFormer(item) },
    { level: 'Pejabat Terdahulu' },
  )
}

const detailPhoto = computed(() => profileMediaUrl(detail.value?.photo))

// Nilai kosong ditampilkan sebagai "—" supaya detail selalu muncul.
const dash = (v) => (v === null || v === undefined || v === '' ? '—' : v)

function initials(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') || '?'
}

// Usia dihitung dari birth_date (tidak disimpan di database). Fallback ke `age` bila ada.
function calcAge(birthDate) {
  if (!birthDate) return null
  const raw = String(birthDate)
  const b = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw)
  if (Number.isNaN(b.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  const m = now.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age -= 1
  return age >= 0 ? age : null
}

function formatDate(value) {
  if (!value) return ''
  const raw = String(value)
  const date = new Date(raw.length === 10 ? `${raw}T00:00:00` : raw)
  if (Number.isNaN(date.getTime())) return raw
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDetailMasaJabatan(item) {
  if (item?.level === 'Pejabat Terdahulu') return formatMasaJabatan(item)
  if (item?.start_date) {
    return `${formatDate(item.start_date)} – ${item.end_date ? formatDate(item.end_date) : 'Sekarang'}`
  }
  if (!item?.start_year && !item?.end_year) return '—'
  if (item.start_year && !item.end_year) return `${item.start_year} – Sekarang`
  return `${item.start_year ?? '?'} – ${item.end_year}`
}

const detailItems = computed(() => {
  const p = detail.value ?? {}
  return [
    { icon: 'pi pi-user', label: 'Jenis Kelamin', value: dash(p.gender) },
    { icon: 'pi pi-id-card', label: 'Usia', value: (calcAge(p.birth_date) ?? p.age) ? `${calcAge(p.birth_date) ?? p.age} tahun` : '—' },    
    { icon: 'pi pi-book', label: 'Pendidikan', value: dash(p.education) },
    { icon: 'pi pi-bookmark', label: 'Jurusan', value: dash(p.major) },
    { icon: 'pi pi-building', label: 'Nama Sekolah', value: dash(p.school_name) },
    { icon: 'pi pi-graduation-cap', label: 'Tahun Lulus', value: dash(p.graduation_year) },
    ...(p.sk_number ? [{ icon: 'pi pi-file', label: 'Nomor SK', value: p.sk_number }] : []),
    ...(p.wilayah ? [{ icon: 'pi pi-map-marker', label: 'Wilayah', value: p.wilayah }] : []),
  ]
})

const detailTermEnd = computed(() => (
  formatDate(detail.value?.term_end_date || detail.value?.end_date) || '—'
))

// Riwayat jabatan: SK hanya berupa teks (nomor SK, atau nama file yang diunggah admin), tanpa tautan dokumen.
const detailHistory = computed(() => {
  const d = detail.value
  // assignments = penugasan (dari ERD baru), position_history = daftar SK tambahan di form admin.
  const raw = [
    ...(Array.isArray(d?.assignments) ? d.assignments : []),
    ...(Array.isArray(d?.position_history) ? d.position_history : []),
  ]
  const seen = new Set()
  return raw
    .map((h) => ({
      ...h,
      sk: h.sk || h.sk_number,
      date: h.date || h.sk_date,
      official: h.official || h.sk_issuer,
      document: h.document || h.sk_document,
    }))
    .filter((h) => h.sk || h.date || h.official || h.document)
    .filter((h) => {
      const key = `${h.sk ?? ''}|${h.document ?? ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((h) => ({
      ...h,
      title: h.sk || h.document_name || (h.document ? String(h.document).split('/').pop() : ''),
    }))
})

/* -------------------------------------------------------------------------- */
/*  Stats                                                                     */
/* -------------------------------------------------------------------------- */
const stats = reactive([
  { icon: 'pi pi-users', label: 'Total Penduduk', target: 0, value: 0, suffix: '' },
  { icon: 'pi pi-home', label: 'Kepala Keluarga', target: 0, value: 0, suffix: '' },
  { icon: 'pi pi-map', label: 'Luas Wilayah', target: 245, value: 0, suffix: ' Ha' },
  { icon: 'pi pi-sitemap', label: 'Jumlah RT/RW', target: 0, value: 0, suffix: ' / 0' },
])

let statsVisible = false
let statsAnimated = false

function applyRegionStats(regionList) {
  const totals = (Array.isArray(regionList) ? regionList : []).reduce(
    (result, region) => ({
      population: result.population + Number(region?.population ?? 0),
      kk: result.kk + Number(region?.kk_count ?? 0),
      rt: result.rt + Number(region?.rt_count ?? 0),
      rw: result.rw + Number(region?.rw_count ?? 0),
    }),
    { population: 0, kk: 0, rt: 0, rw: 0 },
  )

  const suffix = ` / ${totals.rw}`
  const changed = stats[0].target !== totals.population
    || stats[1].target !== totals.kk
    || stats[3].target !== totals.rt
    || stats[3].suffix !== suffix

  stats[0].target = totals.population
  stats[1].target = totals.kk
  stats[3].target = totals.rt
  stats[3].suffix = suffix

  // Data dari cache dan dari API sama -> tidak perlu animasi ulang.
  if (!changed) return

  stats.forEach((stat) => { stat.value = 0 })
  statsAnimated = false
  if (statsVisible) animateStats()
}

function animateStats() {
  if (statsAnimated) return
  statsAnimated = true
  stats.forEach((s) => {
    const duration = 1200
    const start = performance.now()
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      s.value = Math.floor(eased * s.target)
      if (progress < 1) requestAnimationFrame(tick)
      else s.value = s.target
    }
    requestAnimationFrame(tick)
  })
}

/* -------------------------------------------------------------------------- */
/*  Reveal observer                                                           */
/* -------------------------------------------------------------------------- */
let observer = null

function observeRevealElements() {
  if (!observer) return
  document
    .querySelectorAll('.js-reveal, [data-section], [data-trigger]')
    .forEach((el) => observer.observe(el))
}

/* -------------------------------------------------------------------------- */
/*  Map                                                                       */
/* -------------------------------------------------------------------------- */
const mapEl = ref(null)
const mapReady = ref(false)
const boundaryStatus = ref('loading')
let leafletMap = null

const VILLAGE_CENTER = [-7.7132, 110.4551]
const VILLAGE_QUERY = 'Bimomartani, Ngemplak, Sleman, Daerah Istimewa Yogyakarta, Indonesia'
const BOUNDARY_FETCH_TIMEOUT_MS = 6000

async function initMap() {
  if (!mapEl.value || leafletMap) return

  leafletMap = L.map(mapEl.value, {
    scrollWheelZoom: false,
    zoomControl: true,
  }).setView(VILLAGE_CENTER, 14)

  leafletMap.getPane('tilePane').style.zIndex = 1
  leafletMap.getPane('overlayPane').style.zIndex = 4
  leafletMap.getPane('markerPane').style.zIndex = 5
  leafletMap.getPane('popupPane').style.zIndex = 6
  const topLeft = leafletMap._controlCorners?.topleft
  const topRight = leafletMap._controlCorners?.topright
  if (topLeft) topLeft.style.zIndex = 10
  if (topRight) topRight.style.zIndex = 10

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  }).addTo(leafletMap)

  leafletMap.on('click', () => leafletMap?.scrollWheelZoom.enable())
  mapEl.value.addEventListener('mouseleave', () => leafletMap?.scrollWheelZoom.disable())

  const marker = L.marker(VILLAGE_CENTER)
    .addTo(leafletMap)
    .bindPopup('<b>Kalurahan Bimomartani</b><br/>Kapanewon Ngemplak, Kabupaten Sleman')

  mapReady.value = true

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), BOUNDARY_FETCH_TIMEOUT_MS)

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&limit=1&q=${encodeURIComponent(
        VILLAGE_QUERY,
      )}`,
      { signal: controller.signal },
    )
    if (!res.ok) throw new Error('Failed to reach the map service')
    const data = await res.json()

    // Peta bisa sudah dibongkar saat request selesai.
    if (!leafletMap) return

    if (data && data[0] && data[0].geojson) {
      const boundary = L.geoJSON(data[0].geojson, {
        style: {
          color: '#059669',
          weight: 3,
          fillColor: '#059669',
          fillOpacity: 0.08,
        },
      }).addTo(leafletMap)

      leafletMap.fitBounds(boundary.getBounds(), { padding: [24, 24] })
      marker.setLatLng(boundary.getBounds().getCenter())
      boundaryStatus.value = 'ok'
    } else {
      boundaryStatus.value = 'no-boundary'
    }
  } catch (e) {
    console.warn('Failed to load the boundary polygon from OpenStreetMap:', e)
    boundaryStatus.value = 'error'
  } finally {
    clearTimeout(timeoutId)
  }
}

/* -------------------------------------------------------------------------- */
/*  Load profile data                                                         */
/* -------------------------------------------------------------------------- */
async function loadProfile() {
  profileLoading.value = true
  const failedParts = []

  const cached = readProfileCache()
  if (cached) {
    historyData.value = cached.history ?? null
    visionMission.value = cached.visionMission ?? null
    orgStructureData.value = Array.isArray(cached.orgStructure)
      ? (cached.orgStructure[0] ?? null)
      : (cached.orgStructure ?? null)
    regions.value = cached.regions ?? []
    neighborhoodLeaders.value = leadersFromRegionAreas(cached.regionAreas)
    applyRegionStats(regions.value)
    nextTick(observeRevealElements)
  }

  const request = (promise, key, onData, cacheKey) => promise
    .then((data) => {
      onData(data)
      writeProfileCache({ [cacheKey]: data })
      nextTick(observeRevealElements)
    })
    .catch((error) => {
      console.warn(`[profile] Gagal memuat ${key}:`, error)
      failedParts.push(key)
    })

  await Promise.all([
    request(getHistories(), 'sejarah', (data) => { historyData.value = data }, 'history'),
    request(getVisionMissions(), 'visi-misi', (data) => { visionMission.value = data }, 'visionMission'),
    request(getOrganizationalStructures(), 'struktur organisasi', (data) => {
      orgStructureData.value = data?.[0] ?? null
    }, 'orgStructure'),
    request(getRegionAreas(), 'pengurus RT/RW', (data) => {
      neighborhoodLeaders.value = leadersFromRegionAreas(data)
    }, 'regionAreas'),
    request(getRegions(), 'wilayah', (data) => {
      regions.value = data ?? []
      applyRegionStats(regions.value)
    }, 'regions'),
  ])

  profileError.value = failedParts.length
    ? `Sebagian data profil belum dapat dimuat: ${failedParts.join(', ')}.`
    : ''
  profileLoading.value = false
  nextTick(observeRevealElements)
}

/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                 */
/* -------------------------------------------------------------------------- */
onMounted(() => {
  window.history.scrollRestoration = 'manual'
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

  requestAnimationFrame(() => {
    mounted.value = true
  })

  // Observer dibuat lebih dulu, sebelum loadProfile memanggil observeRevealElements.
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.remove(...REVEAL_HIDDEN)
        entry.target.classList.add(...REVEAL_VISIBLE)
        if (entry.target.dataset.trigger === 'stats') {
          statsVisible = true
          animateStats()
        }
        if (entry.target.dataset.trigger === 'map') initMap()
        if (entry.target.dataset.section) activeSection.value = entry.target.dataset.section
      })
    },
    { threshold: 0.2, rootMargin: '-80px 0px -10% 0px' },
  )

  window.addEventListener('scroll', onHeroScroll, { passive: true })
  nextTick(observeRevealElements)
  loadProfile()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  leafletMap?.remove()
  leafletMap = null
  window.history.scrollRestoration = 'auto'
  window.removeEventListener('scroll', onHeroScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="bg-white text-slate-800">
    <!-- ===== HERO ===== -->
    <section class="relative px-4 py-6 md:px-6 md:py-8">
      <div class="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
        <div
          class="absolute inset-x-0 -top-14 bottom-0 -z-20 overflow-hidden bg-slate-900 motion-reduce:!transform-none"
          :style="{ transform: `translateY(${heroOffset}px)` }"
        >
          <img
            :src="heroImageUrl"
            alt=""
            class="-m-[10%] h-[145%] w-[125%] max-w-none object-cover object-[center_30%] blur-md transition-transform duration-[3000ms] ease-out motion-reduce:transition-none"
            :class="mounted ? 'scale-100' : 'scale-110'"
            @load="heroImageLoaded = true"
            @error="heroImageLoaded = false"
          />
        </div>

        <div
          class="absolute inset-0 -z-20 bg-gradient-to-br from-[#0a0f1c] via-[#101a2e] to-[#0d1526] transition-opacity duration-700"
          :class="heroImageLoaded ? 'opacity-0' : 'opacity-100'"
        />
        <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[rgba(5,9,20,0.92)] via-[rgba(5,9,20,0.55)] to-[rgba(5,9,20,0.1)]" />
        <div class="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(5,9,20,0.45)] via-transparent to-[rgba(5,9,20,0.55)]" />

        <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[length:22px_22px] opacity-20" />

        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
        <div class="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl motion-safe:animate-[pulse_9s_ease-in-out_infinite]" />

        <div class="relative flex min-h-[440px] items-center px-6 py-14 md:min-h-[520px] md:px-14 md:py-20">
          <div class="max-w-xl">
            <div
              class="inline-flex items-center gap-3 transition-all duration-500 ease-out motion-reduce:transition-none"
              :class="mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'"
            >
              <span class="h-2.5 w-2.5 flex-none rotate-45 bg-gradient-to-br from-sky-400 to-violet-500 motion-safe:animate-pulse" />
              <span class="bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-xs font-semibold uppercase tracking-[0.3em] text-transparent">
                Tentang Kami
              </span>
            </div>

            <h1 class="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              <span
                v-for="(word, i) in heroTitleWords"
                :key="i"
                class="inline-block text-slate-100 [text-shadow:0_2px_24px_rgba(15,23,42,0.35)] transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!blur-none motion-reduce:!translate-y-0"
                :class="[
                  heroWordDelay(i),
                  mounted ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm',
                  i === heroTitleWords.length - 1
                    ? '!bg-gradient-to-r !from-sky-400 !via-indigo-500 !to-purple-500 !bg-clip-text !text-transparent drop-shadow-[0_2px_18px_rgba(99,102,241,0.45)]'
                    : '',
                ]"
              >
                {{ word }}<span v-if="i !== heroTitleWords.length - 1">&nbsp;</span>
              </span>
            </h1>

            <span
              class="mt-4 block h-[3px] w-16 origin-left rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500 transition-transform delay-500 duration-700 ease-out motion-reduce:transition-none"
              :class="mounted ? 'scale-x-100' : 'scale-x-0'"
            />

            <p
              class="mt-5 text-sm leading-relaxed !text-slate-200 transition-all delay-[450ms] duration-700 ease-out motion-reduce:transition-none md:text-base"
              :class="mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
            >
              Mengenal lebih dekat sejarah, visi misi, dan potensi wilayah desa kami
              yang kaya akan warisan budaya dan keindahan alam.
            </p>

            <div
              class="mt-4 flex items-center gap-2 text-xs font-medium !text-slate-300 transition-all delay-[550ms] duration-700 ease-out motion-reduce:transition-none"
              :class="mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
            >
              <span class="h-px w-6 bg-blue-400/50" />
              Kapanewon Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STICKY ANCHOR NAV (PrimeVue Tabs, scroll-spy) ===== -->
    <nav class="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div class="mx-auto max-w-4xl px-6">
        <Tabs :value="activeSection" @update:value="onTabChange" :pt="{ root: { class: 'bg-transparent' } }">
          <TabList
            :pt="{
              root: { class: 'border-none bg-transparent' },
              tabList: { class: 'gap-1 flex-nowrap overflow-x-auto border-none' },
              activeBar: { class: '!bg-blue-600 !h-0.5' },
            }"
          >
            <Tab
              v-for="s in sections"
              :key="s.id"
              :value="s.id"
              :pt="{
                root: ({ context }) => ({
                  class: [
                    'border-none bg-transparent px-3 py-4 text-sm font-medium whitespace-nowrap',
                    context.active ? 'text-blue-600' : 'text-slate-500',
                  ],
                }),
              }"
            >
              {{ s.label }}
            </Tab>
          </TabList>
        </Tabs>
      </div>
    </nav>

    <!-- ===== STATUS MEMUAT / ERROR ===== -->
    <div v-if="profileLoading && !hasAnyProfileData" class="flex items-center justify-center gap-3 px-6 pt-8 text-sm text-slate-500">
      <ProgressSpinner class="!h-6 !w-6" stroke-width="6" />
      Memuat data profil...
    </div>
    <div v-if="profileError" class="mx-auto max-w-4xl px-6 pt-6">
      <Message severity="warn" :closable="true" @close="profileError = ''">{{ profileError }}</Message>
    </div>

    <!-- ===== HISTORY (amber / heritage tone) ===== -->
    <section id="history" data-section="history" class="relative scroll-mt-14 overflow-hidden bg-gradient-to-b from-amber-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />
      <span class="pointer-events-none absolute -right-4 top-6 select-none text-[9rem] font-extrabold leading-none text-amber-500 opacity-[0.08]">
        {{ historyData?.year_founded ?? '—' }}
      </span>

      <div class="relative mx-auto max-w-4xl">
        <div :class="[REVEAL, 'flex items-center gap-3']">
          <span class="h-px w-8 bg-amber-500" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-amber-700">
            Sejak {{ historyData?.year_founded ?? '—' }}
          </span>
        </div>
        <h2 :class="[REVEAL, 'mt-2 text-2xl font-semibold text-slate-900']">
          {{ historyData?.title ?? 'Sejarah Kalurahan Bimomartani' }}
        </h2>

        <div :class="[REVEAL, 'mt-6 space-y-5 border-l-2 border-amber-200 pl-6 leading-relaxed text-slate-600']">
          <p v-for="(point, index) in historyPoints" :key="`${index}-${point}`" class="relative">
            <span class="absolute -left-[2.05rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500 shadow-[0_0_0_2px_#f59e0b]" />
            {{ point }}
          </p>
          <p v-if="!historyPoints.length" class="text-sm text-slate-400">Data sejarah belum tersedia.</p>
        </div>

        <div :class="[REVEAL, 'mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2']">
          <Card
            class="overflow-hidden !rounded-xl !border !border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(217,119,6,0.14)]"
            :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }"
          >
            <template #content>
              <Image
                v-if="profileMediaUrl(historyPhotos[0])"
                :src="profileMediaUrl(historyPhotos[0])"
                alt="Foto Balai Desa"
                :pt="{ image: { class: 'h-40 w-full object-cover' } }"
              />
              <div v-else class="flex h-40 items-center justify-center gap-2 text-sm text-amber-600/70">
                <i class="pi pi-camera" /> Foto Balai Desa
              </div>
            </template>
          </Card>
          <Card
            class="overflow-hidden !rounded-xl !border !border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(217,119,6,0.14)]"
            :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }"
          >
            <template #content>
              <Image
                v-if="profileMediaUrl(historyPhotos[1])"
                :src="profileMediaUrl(historyPhotos[1])"
                alt="Foto Kegiatan Warga"
                :pt="{ image: { class: 'h-40 w-full object-cover' } }"
              />
              <div v-else class="flex h-40 items-center justify-center gap-2 text-sm text-amber-600/70">
                <i class="pi pi-camera" /> Foto Kegiatan Warga
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- ===== VISION & MISSION (indigo / violet tone) ===== -->
    <section id="vision-mission" data-section="vision-mission" class="relative scroll-mt-14 overflow-hidden bg-gradient-to-b from-violet-50 via-indigo-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#c4b5fd_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />

      <div class="relative mx-auto max-w-4xl text-center">
        <Card
          :class="[REVEAL, 'relative mx-auto max-w-2xl !rounded-2xl !border-0 bg-gradient-to-b from-white to-violet-50/40 !shadow-[0_16px_40px_rgba(124,58,237,0.14)]']"
          :pt="{ content: { class: '!p-8 relative' } }"
        >
          <template #content>
            <span class="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-violet-600 to-blue-600" />
            <span class="block bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text font-serif text-5xl leading-none text-transparent">
              &ldquo;
            </span>
            <h2 class="mt-1 text-2xl font-semibold text-slate-900">Visi</h2>
            <p class="mx-auto mt-3 text-slate-600">
              {{ visionMission?.vision || 'Data visi belum tersedia.' }}
            </p>
          </template>
        </Card>

        <div :class="[REVEAL, 'mt-14 flex items-center justify-center gap-3']">
          <span class="h-px w-8 bg-violet-600" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-violet-700">Arah Kami</span>
        </div>
        <h2 :class="[REVEAL, 'mt-2 text-2xl font-semibold text-slate-900']">
          Misi
        </h2>

        <div class="mt-6 space-y-3 text-left">
          <Card
            v-for="(item, i) in missionsData"
            :key="i"
            :class="[
              REVEAL_CARD,
              staggerDelay(i),
              accentFor(i).border,
              accentFor(i).soft,
              '!rounded-xl !border !border-slate-100 !border-l-4 bg-gradient-to-r !to-white hover:-translate-y-0.5 hover:shadow-lg',
            ]"
            :pt="{ content: { class: '!p-4' } }"
          >
            <template #content>
              <div class="flex items-start gap-4">
                <Avatar
                  :label="String(i + 1)"
                  shape="circle"
                  class="flex-none text-sm font-semibold !text-white"
                  :class="accentFor(i).avatarBg"
                />
                <p class="pt-1 text-slate-600">{{ item }}</p>
              </div>
            </template>
          </Card>
          <p v-if="!missionsData.length" class="text-sm text-slate-400">Data misi belum tersedia.</p>
        </div>
      </div>
    </section>

    <!-- ===== ORGANIZATION STRUCTURE (blue tone) ===== -->
    <section id="org-structure" data-section="org-structure" class="relative scroll-mt-14 overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />

      <div class="relative mx-auto max-w-5xl">
        <div :class="[REVEAL, 'flex items-center gap-3']">
          <span class="h-px w-8 bg-blue-600" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-blue-700">Tata Kelola</span>
        </div>
        <h2 :class="[REVEAL, 'mt-2 text-2xl font-semibold text-slate-900']">
          Struktur Organisasi Pemerintah Kalurahan
        </h2>

        <div class="mt-10">
          <p v-if="!orgStructure.length" class="text-sm text-slate-400">Data struktur organisasi belum tersedia.</p>

          <div v-for="(level, li) in orgStructure" :key="level.level ?? li" :class="li > 0 ? 'mt-10' : ''">
            <div v-if="li > 0" class="relative mx-auto mb-8 h-8 w-px bg-blue-300">
              <span class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500" />
            </div>

            <div
              v-if="!level.pimpinan"
              class="mb-5 flex items-center gap-2"
              :class="isCarikLevel(level) ? 'justify-center' : ''"
            >
              <span class="h-2 w-2 flex-none rounded-full bg-blue-600" />
              <p class="text-xs font-bold uppercase tracking-widest text-blue-700/80">{{ level.level }}</p>
            </div>

            <!-- Pimpinan (Lurah) -->
            <div v-if="level.pimpinan" class="flex flex-col items-center gap-5">
              <Card
                v-for="(p, pi) in level.people"
                :key="p.title + p.name"
                role="button"
                tabindex="0"
                :aria-label="`Lihat detail ${p.name}`"
                :class="[
                  REVEAL_CARD,
                  staggerDelay(pi),
                  'relative w-full max-w-4xl cursor-pointer overflow-hidden !rounded-2xl !border-0 !bg-gradient-to-br !from-[#0d2c4d] !to-[#12395f] !shadow-lg hover:-translate-y-1 hover:!shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400',
                ]"
                :pt="{ content: { class: '!p-6 sm:!p-8' } }"
                @click="openDetail(p, level)"
                @keydown.enter.prevent="openDetail(p, level)"
                @keydown.space.prevent="openDetail(p, level)"
              >
                <template #content>
                  <!-- Batik kawung corner shadow -->
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 320 320"
                    class="pointer-events-none absolute bottom-0 right-0 h-52 w-52 opacity-25 sm:h-72 sm:w-72 sm:opacity-30 lg:h-80 lg:w-80 [mask-image:radial-gradient(circle_at_100%_100%,black_15%,transparent_72%)] [-webkit-mask-image:radial-gradient(circle_at_100%_100%,black_15%,transparent_72%)]"
                  >
                    <defs>
                      <pattern :id="`batik-kawung-lurah-${pi}`" width="64" height="64" patternUnits="userSpaceOnUse">
                        <g class="fill-none stroke-amber-200 stroke-[1.5]">
                          <ellipse cx="32" cy="16" rx="9" ry="17" />
                          <ellipse cx="32" cy="48" rx="9" ry="17" />
                          <ellipse cx="16" cy="32" rx="17" ry="9" />
                          <ellipse cx="48" cy="32" rx="17" ry="9" />
                        </g>
                        <circle cx="32" cy="32" r="3.5" class="fill-amber-300" />
                        <circle cx="0" cy="0" r="2.5" class="fill-amber-200" />
                        <circle cx="64" cy="0" r="2.5" class="fill-amber-200" />
                        <circle cx="0" cy="64" r="2.5" class="fill-amber-200" />
                        <circle cx="64" cy="64" r="2.5" class="fill-amber-200" />
                      </pattern>
                    </defs>
                    <rect width="320" height="320" :fill="`url(#batik-kawung-lurah-${pi})`" />
                  </svg>
                  <div class="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
                    <Avatar
                      v-if="profileMediaUrl(p.photo)"
                      :image="profileMediaUrl(p.photo)"
                      shape="square"
                      size="xlarge"
                      class="mx-auto !aspect-square !h-auto !w-48 flex-none !overflow-hidden !rounded-xl sm:!mx-0 sm:!w-56"
                      :pt="{ image: { class: '!h-full !w-full !object-cover' } }"
                    />
                    <Avatar
                      v-else
                      icon="pi pi-user"
                      shape="square"
                      size="xlarge"
                      class="mx-auto !aspect-square !h-auto !w-48 flex-none !rounded-xl !bg-amber-200 !text-7xl !text-amber-700 sm:!mx-0 sm:!w-56"
                    />
                    <div class="flex flex-col items-center justify-center text-center sm:items-start sm:text-left">
                      <span class="text-sm font-bold uppercase tracking-wider text-amber-400">{{ level.level }} Kalurahan Bimomartani</span>
                      <h3 class="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">{{ p.name }}</h3>
                      <p class="mt-3 text-base leading-relaxed text-blue-100/80">{{ p.desc }}</p>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <!-- Level lain: slider atau grid kartu -->
            <div v-else :class="[REVEAL, levelRowClass(level)]">
              <div
                v-for="(p, pi) in level.people"
                :key="p.title + p.name"
                role="button"
                tabindex="0"
                :aria-label="`Lihat detail ${p.name}`"
                class="flex w-44 flex-none cursor-pointer snap-start flex-col overflow-hidden rounded-xl border-2 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:w-48"
                :class="orgAccentFor(pi).cardBorder"
                @click="openDetail(p, level)"
                @keydown.enter.prevent="openDetail(p, level)"
                @keydown.space.prevent="openDetail(p, level)"
              >
                <Avatar
                  v-if="profileMediaUrl(p.photo)"
                  :image="profileMediaUrl(p.photo)"
                  shape="square"
                  size="xlarge"
                  class="!aspect-square !h-auto !w-full !flex-none !overflow-hidden !rounded-none"
                  :pt="{ image: { class: '!h-full !w-full !object-cover' } }"
                />
                <Avatar
                  v-else
                  icon="pi pi-image"
                  shape="square"
                  size="xlarge"
                  class="!aspect-square !h-auto !w-full !flex-none !rounded-none !text-3xl !text-white"
                  :class="orgAccentFor(pi).avatarBg"
                />
                <div class="flex flex-1 flex-col items-center px-3 py-3 text-center">
                  <p class="text-sm font-bold leading-tight text-slate-900">{{ p.name }}</p>
                  <p class="mt-1 text-xs font-semibold uppercase tracking-wide" :class="orgAccentFor(pi).titleText">{{ p.title }}</p>
                  <p class="mt-2 line-clamp-2 text-[11px] leading-snug text-slate-400">{{ p.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== KETUA RW & RT AKTIF ===== -->
        <div v-for="group in leaderGroups" :key="group.key" class="mt-10">
          <div class="relative mx-auto mb-8 h-8 w-px bg-blue-300">
            <span class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500" />
          </div>

          <div class="mb-5 flex items-center gap-2">
            <span class="h-2 w-2 flex-none rounded-full bg-blue-600" />
            <p class="text-xs font-bold uppercase tracking-widest text-blue-700/80">{{ group.title }}</p>
          </div>

          <div :class="REVEAL">
            <Carousel
              :value="group.items"
              :num-visible="4"
              :num-scroll="1"
              :responsive-options="leaderCarouselBreakpoints"
              :show-indicators="false"
            >
              <template #item="{ data, index }">
                <div class="h-full p-2">
                  <div
                    role="button"
                    tabindex="0"
                    :aria-label="`Lihat detail ${data.name}`"
                    class="flex h-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 bg-white px-4 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                    :class="leaderAccentFor(index + group.accentOffset).cardBorder"
                    @click="openLeaderDetail(group, data)"
                    @keydown.enter.prevent="openLeaderDetail(group, data)"
                    @keydown.space.prevent="openLeaderDetail(group, data)"
                  >
                    <Tag
                      :value="leaderBadge(group, data)"
                      class="!px-3 !text-xs !font-bold !tracking-wide !text-white"
                      :class="leaderAccentFor(index + group.accentOffset).badgeBg"
                      :pt="{ label: { class: '!font-bold !text-white' } }"
                    />
                    <p class="text-sm font-bold leading-tight text-slate-900">{{ data.name }}</p>
                    <p
                      class="text-xs font-semibold uppercase tracking-wide"
                      :class="leaderAccentFor(index + group.accentOffset).titleText"
                    >
                      {{ group.role }}
                    </p>
                    <p class="text-[11px] leading-snug text-slate-400">{{ leaderLocation(group, data) }}</p>
                  </div>
                </div>
              </template>
            </Carousel>
          </div>
        </div>

        <!-- ===== PEJABAT TERDAHULU (tampil jika diaktifkan admin) ===== -->
        <div v-if="formerOfficials.length" class="mt-16">
          <div :class="[REVEAL, 'flex items-center gap-3']">
            <span class="h-px w-8 bg-blue-600" />
            <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-blue-700">Riwayat Kepemimpinan</span>
          </div>
          <h2 :class="[REVEAL, 'mt-2 text-2xl font-semibold text-slate-900']">
            Pejabat Terdahulu
          </h2>

          <div :class="[REVEAL, 'mt-6 overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm']">
            <DataTable
              :value="formerOfficials"
              scrollable
              striped-rows
              row-hover
              :pt="formerTablePt"
            >
              <Column header="No" :pt="formerColumnPt">
                <template #body="{ index }">
                  <span class="text-slate-400">{{ index + 1 }}</span>
                </template>
              </Column>
              <Column header="Jabatan" :pt="formerColumnPt">
                <template #body="{ data }">
                  <span class="font-semibold text-blue-700">{{ formatJabatanFormer(data) }}</span>
                </template>
              </Column>
              <Column header="Nama" :pt="formerColumnPt">
                <template #body="{ data }">
                  <span class="font-medium text-slate-900">{{ data.nama }}</span>
                </template>
              </Column>
              <Column header="Wilayah" :pt="formerColumnPt">
                <template #body="{ data }">{{ formatWilayahFormer(data) }}</template>
              </Column>
              <Column header="Masa Jabatan" :pt="formerColumnPt">
                <template #body="{ data }">
                  <span class="whitespace-nowrap">{{ formatMasaJabatan(data) }}</span>
                </template>
              </Column>
              <Column header="Keterangan" :pt="formerColumnPt">
                <template #body="{ data }">
                  <span class="text-slate-500">{{ data.desc || '—' }}</span>
                </template>
              </Column>
              <Column header="Detail" :pt="formerColumnPt">
                <template #body="{ data }">
                  <Button
                    label="Detail"
                    icon="pi pi-eye"
                    size="small"
                    rounded
                    class="!whitespace-nowrap !text-xs !font-bold"
                    :aria-label="`Lihat detail ${data.nama}`"
                    @click="openFormerDetail(data)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== REGION & DEMOGRAPHICS (emerald / green tone) ===== -->
    <section id="wilayah" data-section="wilayah" class="relative scroll-mt-14 overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#6ee7b7_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />

      <div class="relative mx-auto max-w-4xl">
        <div :class="[REVEAL, 'flex items-center gap-3']">
          <span class="h-px w-8 bg-emerald-600" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-emerald-700">Fakta &amp; Angka</span>
        </div>
        <h2 :class="[REVEAL, 'mt-2 text-2xl font-semibold text-slate-900']">
          Data Wilayah &amp; Demografi
        </h2>

        <div
          :class="[REVEAL, 'mt-6 grid grid-cols-2 gap-4 md:grid-cols-4']"
          data-trigger="stats"
        >
          <Card
            v-for="(s, i) in stats"
            :key="s.label"
            class="group !rounded-xl border bg-gradient-to-br to-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            :class="[accentFor(i).statBorder, accentFor(i).soft, staggerDelay(i)]"
            :pt="{ content: { class: '!p-5' } }"
          >
            <template #content>
              <Avatar
                :icon="s.icon"
                shape="circle"
                class="text-lg transition-all duration-300 group-hover:scale-110 group-hover:!text-white"
                :class="[accentFor(i).statIconBg, accentFor(i).statIconText, accentFor(i).statHover]"
              />
              <p class="mt-4 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {{ s.label }}
              </p>
              <p class="mt-1 text-2xl font-bold text-slate-900">
                {{ s.value.toLocaleString('id-ID') }}<span class="text-base font-semibold text-slate-400">{{ s.suffix }}</span>
              </p>
            </template>
          </Card>
        </div>

        <div :class="[REVEAL, 'my-10 h-px w-full bg-emerald-100']" />

        <!-- ===== INTERACTIVE MAP ===== -->
        <Card
          :class="[REVEAL, 'isolate overflow-hidden !rounded-2xl !border !border-emerald-200 !shadow-[0_14px_32px_rgba(5,150,105,0.1)]']"
          :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }"
        >
          <template #content>
            <div class="relative h-80 w-full">
              <div ref="mapEl" data-trigger="map" class="h-full w-full" />

              <div
                v-if="!mapReady"
                class="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
              >
                <span class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow">
                  <ProgressSpinner class="!h-4 !w-4" stroke-width="6" />
                  Memuat peta...
                </span>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100 px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="inline-block h-2.5 w-4 rounded-sm bg-emerald-600/80" />
                <p class="text-xs text-slate-400">
                  Garis hijau menunjukkan batas administratif Kalurahan Bimomartani (data OpenStreetMap).
                </p>
              </div>
              <Tag v-if="boundaryStatus === 'no-boundary'" severity="warn" value="Poligon batas belum tersedia — menampilkan titik lokasi saja." class="!text-xs" />
              <Tag v-else-if="boundaryStatus === 'error'" severity="danger" value="Gagal memuat data batas wilayah." class="!text-xs" />
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- ===== POPUP DETAIL PEJABAT ===== -->
    <Dialog
      v-model:visible="detailVisible"
      modal
      dismissable-mask
      :show-header="false"
      :draggable="false"
      :pt="{
        root: { class: '!w-[34rem] !max-w-[94vw] !overflow-hidden !rounded-3xl !border-0 !shadow-2xl' },
        content: { class: '!p-0 !overflow-y-auto' },
      }"
    >
      <div v-if="detail">
        <!-- Banner -->
        <div
          class="relative overflow-hidden !bg-gradient-to-br !from-[#0d2c4d] !via-[#12395f] !to-[#1d4f85] px-6 pt-10 text-center"
          :class="detail.hidePhoto ? 'pb-8' : 'pb-24'"
        >          
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[length:18px_18px] opacity-10" />
          <button
            type="button"
            class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full !bg-white/20 text-white transition hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
            aria-label="Tutup"
            @click="detailVisible = false"
          >
            <i class="pi pi-times text-xs" />
          </button>

          <span class="relative inline-block rounded-full !bg-amber-400 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] !text-[#0d2c4d]">
            {{ detail.level }}
          </span>
        </div>

        <!-- Foto -->
        <div v-if="!detail.hidePhoto" class="relative z-10 -mt-16 flex justify-center">
          <div class="h-32 w-32 overflow-hidden rounded-2xl bg-white shadow-xl ring-4 ring-white">
            <img v-if="detailPhoto" :src="detailPhoto" :alt="`Foto ${detail.name}`" class="h-full w-full object-cover" />
            <div
              v-else
              class="flex h-full w-full items-center justify-center !bg-gradient-to-br !from-blue-500 !to-blue-700 text-4xl font-bold text-white"
            >
              {{ initials(detail.name) }}
            </div>
          </div>
        </div>

        <div class="px-5 pb-7 pt-5 sm:px-7">
          <!-- Identitas -->
          <div class="text-center">
            <h3 class="m-0 text-2xl font-bold leading-tight text-slate-900">{{ detail.name }}</h3>
            <div class="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                <i class="pi pi-briefcase text-[11px]" /> {{ detail.title }}
              </span>
              <span
                v-if="formatDetailMasaJabatan(detail) !== '—'"
                class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
              >
                <i class="pi pi-calendar text-[11px]" /> {{ formatDetailMasaJabatan(detail) }}
              </span>
            </div>
            <p v-if="detail.desc" class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500">{{ detail.desc }}</p>
          </div>

          <!-- Informasi pamong: selalu tampil -->
          <div class="mt-7">
            <div class="mb-3 flex items-center gap-2">
              <span class="h-px w-5 bg-blue-500" />
              <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">{{ detail.hidePhoto ? 'Informasi Ketua' : 'Informasi Pamong' }}</span>            
            </div>
            <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div
                v-for="item in detailItems"
                :key="item.label"
                class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <i :class="item.icon" class="text-sm" />
                </span>
                <div class="min-w-0">
                  <p class="m-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">{{ item.label }}</p>
                  <p
                    class="m-0 mt-0.5 break-words text-sm font-semibold leading-snug"
                    :class="item.value === '—' ? 'text-slate-300' : 'text-slate-800'"
                  >{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tanggal habis jabatan: selalu tampil -->
          <div class="mt-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <i class="pi pi-clock text-sm" />
            </span>
            <div>
              <p class="m-0 text-[10px] font-bold uppercase tracking-wider text-amber-700">Tanggal Habis Jabatan</p>
              <p
                class="m-0 mt-0.5 text-sm font-semibold"
                :class="detailTermEnd === '—' ? 'text-slate-300' : 'text-slate-800'"
              >{{ detailTermEnd }}</p>
            </div>
          </div>

          <!-- Riwayat jabatan: selalu tampil -->
          <div class="mt-7">
            <div class="mb-3 flex items-center gap-2">
              <span class="h-px w-5 bg-blue-500" />
              <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">Riwayat Jabatan</span>
            </div>

            <ol v-if="detailHistory.length" class="m-0 list-none space-y-3 border-l-2 border-blue-100 p-0 pl-5">
              <li v-for="(h, hi) in detailHistory" :key="hi" class="relative rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                <span class="absolute -left-[1.6rem] top-4 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_2px_#93c5fd]" />

                <p v-if="h.title" class="m-0 break-words text-sm font-bold text-slate-800">SK: {{ h.title }}</p>

                <div class="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span v-if="h.date" class="inline-flex items-center gap-1.5">
                    <i class="pi pi-calendar text-[10px] text-blue-500" /> Tgl: {{ formatDate(h.date) }}
                  </span>
                  <span v-if="h.official" class="inline-flex items-center gap-1.5">
                    <i class="pi pi-user text-[10px] text-blue-500" /> Pejabat: {{ h.official }}
                  </span>
                </div>
              </li>
            </ol>
            <p
              v-else
              class="m-0 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm text-slate-400"
            >
              Belum ada riwayat jabatan.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>