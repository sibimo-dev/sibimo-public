<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import ProgressSpinner from 'primevue/progressspinner'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})


const heroImageUrl = '/images/kalurahan-bimo.jpeg'
const heroImageLoaded = ref(false)
const mounted = ref(false)

const heroTitleWords = 'Profil Kalurahan Bimomartani'.split(' ')

const heroOffset = ref(0)
let rafId = null
function onHeroScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    heroOffset.value = Math.min(window.scrollY * 0.12, 40)
    rafId = null
  })
}

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

const accentStyles = [
  { border: '!border-l-blue-600', soft: '!from-blue-50', avatarBg: 'bg-blue-600', statBorder: 'border-blue-100', statIconBg: 'bg-blue-100', statIconText: 'text-blue-600', statHover: 'group-hover:bg-blue-600' },
  { border: '!border-l-violet-600', soft: '!from-violet-50', avatarBg: 'bg-violet-600', statBorder: 'border-violet-100', statIconBg: 'bg-violet-100', statIconText: 'text-violet-600', statHover: 'group-hover:bg-violet-600' },
  { border: '!border-l-teal-600', soft: '!from-teal-50', avatarBg: 'bg-teal-600', statBorder: 'border-teal-100', statIconBg: 'bg-teal-100', statIconText: 'text-teal-600', statHover: 'group-hover:bg-teal-600' },
  { border: '!border-l-amber-600', soft: '!from-amber-50', avatarBg: 'bg-amber-600', statBorder: 'border-amber-100', statIconBg: 'bg-amber-100', statIconText: 'text-amber-600', statHover: 'group-hover:bg-amber-600' },
  { border: '!border-l-rose-600', soft: '!from-rose-50', avatarBg: 'bg-rose-600', statBorder: 'border-rose-100', statIconBg: 'bg-rose-100', statIconText: 'text-rose-600', statHover: 'group-hover:bg-rose-600' },
  { border: '!border-l-indigo-600', soft: '!from-indigo-50', avatarBg: 'bg-indigo-600', statBorder: 'border-indigo-100', statIconBg: 'bg-indigo-100', statIconText: 'text-indigo-600', statHover: 'group-hover:bg-indigo-600' },
]
const accentHex = ['#2563eb', '#7c3aed', '#0d9488', '#d97706', '#e11d48', '#4f46e5']
function accentHexFor(i) {
  return accentHex[i % accentHex.length]
}
function accentFor(i) {
  return accentStyles[i % accentStyles.length]
}

/* Content data */
const missions = [
  'Meningkatkan kualitas pelayanan publik berbasis teknologi informasi.',
  'Mengembangkan potensi ekonomi lokal melalui pemberdayaan UMKM dan BUMDes.',
  'Melestarikan nilai-nilai budaya dan kearifan lokal masyarakat.',
  'Membangun infrastruktur desa yang memadai dan berwawasan lingkungan.',
]


function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
}

function person(name, title, desc) {
  return { name, title, desc, initials: initials(name) }
}

/* ============ STRUKTUR ORGANISASI ============
   - Hanya Lurah yang tampil sebagai kartu unggulan (pimpinan: true).
   - Carik digabung ke level kesekretariatan bersama para Kaur.
   - Setiap perangkat (selain Lurah) diberi deskripsi jobdesk singkat
     (field `desc`) yang dirender di kartu grid/slider. */
const orgStructure = [
  {
    level: 'Lurah',
    pimpinan: true,
    people: [
      person(
        'Tutik Wahyuningsih, S.Sos., M.AP',
        'Lurah',
        'Memimpin penyelenggaraan pemerintahan Kalurahan Bimomartani.'
      ),
    ],
  },
  {
    level: 'Sekretariat & Keuangan',
    people: [
      person('Yudi Priyo Utomo, SE', 'Carik', 'Memimpin sekretariat & mengoordinasikan seluruh urusan administrasi kalurahan.'),
      person('Nanda Mutiara Dewi, S.Psi', 'Kaur Danarta', 'Mengelola administrasi dan pelaporan keuangan kalurahan.'),
      person('Rasyifa Anom Sudaryono, Amd.Kes', 'Kaur Tata Laksana', 'Mengelola tata naskah dan pelayanan administrasi umum.'),
      person('Hanang Tri Nugroho, S.Kom', 'Kaur Pangripta', 'Menyusun perencanaan dan pelaporan pembangunan kalurahan.'),
    ],
  },
  {
    level: 'Kepala Seksi',
    people: [
      person('Sutriyana, S.Ag', 'Kamituwa', 'Mengoordinasikan kesejahteraan dan pemberdayaan masyarakat.'),
      person('Yordan Ardi Tamara, S.Kom', 'Ulu-Ulu', 'Mengelola tata guna lahan, irigasi, dan sektor pertanian.'),
      person('Rifai Nurmansyah, S.Pd., M.Pd', 'Jagabaya', 'Menjaga ketenteraman, ketertiban, dan keamanan wilayah.'),
    ],
  },
  {
    level: 'Dukuh (Kepala Padukuhan)',
    slider: true,
    people: [
      person('Jaka Widada', 'Dukuh I Krebet', 'Kepala wilayah Padukuhan Krebet.'),
      person('Angga Wahyu Indra Irawan, S.Pd', 'Dukuh II Rogobangsan', 'Kepala wilayah Padukuhan Rogobangsan.'),
      person('Umi Solikah', 'Dukuh III Kalibulus', 'Kepala wilayah Padukuhan Kalibulus.'),
      person('Kaharudin', 'Dukuh IV Macanan', 'Kepala wilayah Padukuhan Macanan.'),
      person('Mucharom', 'Dukuh V Cokrogaten', 'Kepala wilayah Padukuhan Cokrogaten.'),
      person('TH Dwi Wahyu P, Amd', 'Dukuh VI Purwobinangun', 'Kepala wilayah Padukuhan Purwobinangun.'),
      person('Sukirman', 'Dukuh VII Pondok Suruh', 'Kepala wilayah Padukuhan Pondok Suruh.'),
      person('Sunaryo', 'Dukuh VIII Balong', 'Kepala wilayah Padukuhan Balong.'),
      person('Suharyono', 'Dukuh IX Kragilan', 'Kepala wilayah Padukuhan Kragilan.'),
      person('Basuki Wibowo', 'Dukuh X Banjarharjo', 'Kepala wilayah Padukuhan Banjarharjo.'),
      person('Drs. Jazim Thoyibi', 'Dukuh XI Sorasan', 'Kepala wilayah Padukuhan Sorasan.'),
      person('Purnomo', 'Dukuh XII Koroulon Kidul', 'Kepala wilayah Padukuhan Koroulon Kidul.'),
    ],
  },
  {
    level: 'Staff Pamong Kalurahan',
    slider: true,
    people: [
      person('Ratna Kurnia Dewi', 'Staff Pamong Kalurahan', 'Membantu administrasi keuangan kalurahan.'),
      person('Khoirunnisa Hidaya', 'Staff Pamong Kalurahan', 'Membantu administrasi perkantoran kalurahan.'),
      person('Mega Dwi Jayanti', 'Staff Pamong Kalurahan', 'Membantu pelayanan kesehatan dan sosial masyarakat.'),
      person('Sigit Raharjo', 'Staff Pamong Kalurahan', 'Membantu pelaksanaan tugas kepamongan kalurahan.'),
      person('Linggar Yudha Pranata', 'Staff Pamong Kalurahan', 'Membantu administrasi dan kearsipan kalurahan.'),
      person('Riyanto', 'Staff Pamong Kalurahan', 'Membantu pelaksanaan tugas kepamongan kalurahan.'),
    ],
  },
]

const stats = reactive([
  { icon: 'pi pi-users', label: 'Total Penduduk', target: 4521, value: 0, suffix: '' },
  { icon: 'pi pi-home', label: 'Kepala Keluarga', target: 1120, value: 0, suffix: '' },
  { icon: 'pi pi-map', label: 'Luas Wilayah', target: 245, value: 0, suffix: ' Ha' },
  { icon: 'pi pi-sitemap', label: 'Jumlah RT/RW', target: 24, value: 0, suffix: ' / 6' },
])

let statsAnimated = false
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

const REVEAL_HIDDEN = ['opacity-0', 'translate-y-4']
const REVEAL_VISIBLE = ['opacity-100', 'translate-y-0']

let observer

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(...REVEAL_HIDDEN)
          entry.target.classList.add(...REVEAL_VISIBLE)
          if (entry.target.dataset.trigger === 'stats') animateStats()
          if (entry.target.dataset.section) activeSection.value = entry.target.dataset.section
        }
      })
    },
    { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' }
  )

  nextTick(() => {
    document
      .querySelectorAll('.js-reveal, [data-section], [data-trigger]')
      .forEach((el) => observer.observe(el))
  })

  initMap()

  window.addEventListener('scroll', onHeroScroll, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  leafletMap?.remove()
  window.removeEventListener('scroll', onHeroScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

const mapEl = ref(null)
const mapStatus = ref('loading')
let leafletMap = null

const VILLAGE_CENTER = [-7.7132, 110.4551]
const VILLAGE_QUERY = 'Bimomartani, Ngemplak, Sleman, Daerah Istimewa Yogyakarta, Indonesia'

async function initMap() {
  if (!mapEl.value) return

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

  leafletMap.on('click', () => leafletMap.scrollWheelZoom.enable())
  mapEl.value.addEventListener('mouseleave', () => leafletMap.scrollWheelZoom.disable())

  const marker = L.marker(VILLAGE_CENTER)
    .addTo(leafletMap)
    .bindPopup('<b>Kalurahan Bimomartani</b><br/>Kapanewon Ngemplak, Kabupaten Sleman')

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&limit=1&q=${encodeURIComponent(
        VILLAGE_QUERY
      )}`
    )
    if (!res.ok) throw new Error('Failed to reach the map service')
    const data = await res.json()

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
      mapStatus.value = 'ok'
    } else {
      mapStatus.value = 'no-boundary'
    }
  } catch (e) {
    console.warn('Failed to load the boundary polygon from OpenStreetMap:', e)
    mapStatus.value = 'error'
  }
}
</script>

<template>
  <div class="bg-white text-slate-800">
    <!-- ===== HERO ===== -->
    <section class="relative px-4 py-6 md:px-6 md:py-8">
      <div class="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
        <!-- Background photo with parallax (scroll) + a one-shot zoom-out on load -->
        <div
          class="absolute inset-0 -z-20 overflow-hidden bg-slate-900 motion-reduce:!transform-none"
          :style="{ transform: `translateY(${heroOffset}px)` }"
        >
          <div
            class="h-[130%] w-[110%] -m-[6%] bg-cover bg-[center_30%] transition-transform duration-[9000ms] ease-out motion-reduce:transition-none"
            :class="mounted ? 'scale-100' : 'scale-110'"
            :style="{ backgroundImage: `url(${heroImageUrl})` }"
          />
          <img
            :src="heroImageUrl"
            alt=""
            class="hidden"
            @load="heroImageLoaded = true"
            @error="heroImageLoaded = false"
          />
        </div>

        <!-- Gradient fallback for when the photo hasn't loaded yet -->
        <div
          class="absolute inset-0 -z-20 bg-gradient-to-br from-[#0a0f1c] via-[#101a2e] to-[#0d1526] transition-opacity duration-700"
          :class="heroImageLoaded ? 'opacity-0' : 'opacity-100'"
        />

        <!-- Left-to-right dark overlay so the left-side text stays readable -->
        <div class="absolute inset-0 -z-10 bg-gradient-to-r from-[rgba(5,9,20,0.92)] via-[rgba(5,9,20,0.55)] to-[rgba(5,9,20,0.1)]" />
        <div class="absolute inset-0 -z-10 bg-gradient-to-b from-[rgba(5,9,20,0.45)] via-transparent to-[rgba(5,9,20,0.55)]" />

        <!-- Subtle dot texture -->
        <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[length:22px_22px] opacity-20" />

        <!-- Accent blobs -->
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
        <div class="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl motion-safe:animate-[pulse_9s_ease-in-out_infinite]" />

        <!-- Content -->
        <div class="relative flex min-h-[440px] items-center px-6 py-14 md:min-h-[520px] md:px-14 md:py-20">
          <div class="max-w-xl">
            <div
              class="inline-flex items-center gap-3 transition-all duration-500 ease-out motion-reduce:transition-none"
              :class="mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'"
            >
              <span class="h-2.5 w-2.5 flex-none rotate-45 bg-gradient-to-br from-sky-400 to-violet-500 motion-safe:animate-pulse" />
              <span class="text-xs font-semibold uppercase tracking-[0.3em] bg-gradient-to-r from-sky-300 to-violet-300 bg-clip-text text-transparent">
                Tentang Kami
              </span>
            </div>

            <h1 class="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              <span
                v-for="(word, i) in heroTitleWords"
                :key="i"
                class="inline-block text-slate-100 [text-shadow:0_2px_24px_rgba(15,23,42,0.35)] transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!blur-none motion-reduce:!translate-y-0"
                :class="[
                  mounted ? 'opacity-100 translate-y-0 blur-none' : 'opacity-0 translate-y-8 blur-sm',
                  i === heroTitleWords.length - 1
                    ? '!bg-gradient-to-r !from-sky-400 !via-indigo-500 !to-purple-500 !bg-clip-text !text-transparent drop-shadow-[0_2px_18px_rgba(99,102,241,0.45)]'
                    : '',
                ]"
                :style="{ transitionDelay: `${300 + i * 160}ms` }"
              >
                {{ word }}<span v-if="i !== heroTitleWords.length - 1">&nbsp;</span>
              </span>
            </h1>

            <!-- Accent underline that grows once the words have appeared -->
            <span
              class="mt-4 block h-[3px] w-16 origin-left rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500 transition-transform duration-700 ease-out motion-reduce:transition-none"
              :class="mounted ? 'scale-x-100' : 'scale-x-0'"
              style="transition-delay: 1100ms"
            />

            <p
              class="mt-5 text-sm leading-relaxed !text-slate-200 md:text-base transition-all duration-700 ease-out motion-reduce:transition-none"
              :class="mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
              style="transition-delay: 950ms"
            >
              Mengenal lebih dekat sejarah, visi misi, dan potensi wilayah desa kami
              yang kaya akan warisan budaya dan keindahan alam.
            </p>

            <div
              class="mt-4 flex items-center gap-2 text-xs font-medium !text-slate-300 transition-all duration-700 ease-out motion-reduce:transition-none"
              :class="mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
              style="transition-delay: 1100ms"
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

    <!-- ===== HISTORY (amber / heritage tone) ===== -->
    <section id="history" data-section="history" class="relative overflow-hidden bg-gradient-to-b from-amber-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />
      <span class="pointer-events-none absolute -right-4 top-6 select-none text-[9rem] font-extrabold leading-none text-amber-500 opacity-[0.08]">
        1946
      </span>

      <div class="relative mx-auto max-w-4xl">
        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 flex items-center gap-3">
          <span class="h-px w-8 bg-amber-500" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-amber-700">Sejak 1946</span>
        </div>
        <h2 class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-2 text-2xl font-semibold text-slate-900">
          Sejarah Kalurahan Bimomartani
        </h2>

        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-6 space-y-5 border-l-2 border-amber-200 pl-6 text-slate-600 leading-relaxed">
          <p class="relative">
            <span class="absolute -left-[2.05rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500 shadow-[0_0_0_2px_#f59e0b]" />
            Nama Kalurahan Bimomartani terbentuk pada tanggal 29 April 1946 yang merupakan
            gabungan dari tiga kalurahan yaitu kalurahan Jatisari, Cokrosari dan Opaksari.
          </p>
          <p class="relative">
            <span class="absolute -left-[2.05rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500 shadow-[0_0_0_2px_#f59e0b]" />
            Awal terbentuknya Kalurahan Bimomartani, kalurahan ini baru dipimpin oleh empat
            orang lurah. Sedangkan struktur organisasi dan tata kerja pemerintah kalurahan
            (SOTK) terbaru saat ini sesuai dengan Peraturan Bupati Sleman Nomor 46 Tahun 2016
            tentang Pedoman SOTK dan Peraturan Kalurahan Bimomartani Nomor 1 Tahun 2020
            tentang Susunan Organisasi dan Tata Kerja Tahun 2020.
          </p>
          <p class="relative">
            <span class="absolute -left-[2.05rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500 shadow-[0_0_0_2px_#f59e0b]" />
            Pemerintah Kalurahan Bimomartani terdiri dari Lurah dan Perangkat Kalurahan.
            Perangkat Kalurahan terdiri dari Sekretaris Kalurahan, Pelaksana Teknis, dan
            Pelaksana Kewilayahan. Sekretaris Kalurahan dipimpin oleh Carik yang berada di
            bawah dan bertanggungjawab kepada Lurah. Sekretaris Kalurahan terdiri dari Urusan
            Tata Usaha Umum, Urusan Keuangan, dan Urusan Perencanaan. Urusan dalam hal ini
            dipimpin oleh Kepala Urusan yang berada dibawah dan bertanggungjawab kepada Lurah
            melalui Carik. Pelaksana Kewilayahan Kalurahan Bimomartani terdiri dari 12 Padukuhan.
          </p>
        </div>

        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            class="!rounded-xl overflow-hidden !border !border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(217,119,6,0.14)]"
            :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }"
          >
            <template #content>
              <div class="flex h-40 items-center justify-center gap-2 text-sm text-amber-600/70">
                <i class="pi pi-camera" /> Foto Balai Desa
              </div>
            </template>
          </Card>
          <Card
            class="!rounded-xl overflow-hidden !border !border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(217,119,6,0.14)]"
            :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }"
          >
            <template #content>
              <div class="flex h-40 items-center justify-center gap-2 text-sm text-amber-600/70">
                <i class="pi pi-camera" /> Foto Kegiatan Warga
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- ===== VISION & MISSION (indigo / violet tone) ===== -->
    <section id="vision-mission" data-section="vision-mission" class="relative overflow-hidden bg-gradient-to-b from-violet-50 via-indigo-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#c4b5fd_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />

      <div class="relative mx-auto max-w-4xl text-center">
        <Card
          class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 relative mx-auto max-w-2xl !rounded-2xl !border-0 bg-gradient-to-b from-white to-violet-50/40 !shadow-[0_16px_40px_rgba(124,58,237,0.14)]"
          :pt="{ content: { class: '!p-8 relative' } }"
        >
          <template #content>
            <span class="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-violet-600 to-blue-600" />
            <span class="block font-serif text-5xl leading-none bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              &ldquo;
            </span>
            <h2 class="mt-1 text-2xl font-semibold text-slate-900">Visi</h2>
            <p class="mx-auto mt-3 text-slate-600">
              "Mewujudkan Kalurahan Bimomartani yang Mandiri, Sejahtera, dan Berbudaya melalui
              Tata Kelola Pemerintahan yang Transparan dan Pembangunan Berkelanjutan."
            </p>
          </template>
        </Card>

        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-14 flex items-center justify-center gap-3">
          <span class="h-px w-8 bg-violet-600" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-violet-700">Arah Kami</span>
        </div>
        <h2 class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-2 text-2xl font-semibold text-slate-900">
          Misi
        </h2>

        <div class="mt-6 space-y-3 text-left">
          <Card
            v-for="(item, i) in missions"
            :key="i"
            class="js-reveal opacity-0 translate-y-4 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 !rounded-xl !border !border-slate-100 !border-l-4 bg-gradient-to-r !to-white hover:-translate-y-0.5 hover:shadow-lg"
            :class="[accentFor(i).border, accentFor(i).soft]"
            :style="{ transitionDelay: `${i * 60}ms` }"
            :pt="{ content: { class: '!p-4' } }"
          >
            <template #content>
              <div class="flex items-start gap-4">
                <Avatar
                  :label="String(i + 1)"
                  shape="circle"
                  class="flex-none !text-white font-semibold text-sm"
                  :style="{ backgroundColor: accentHexFor(i) }"
                />
                <p class="pt-1 text-slate-600">{{ item }}</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- ===== ORGANIZATION STRUCTURE (blue tone) ===== -->
    <section id="org-structure" data-section="org-structure" class="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />

      <div class="relative mx-auto max-w-5xl">
        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 flex items-center gap-3">
          <span class="h-px w-8 bg-blue-600" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-blue-700">Tata Kelola</span>
        </div>
        <h2 class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-2 text-2xl font-semibold text-slate-900">
          Struktur Organisasi Pemerintah Desa
        </h2>

        <div class="mt-10">
          <div v-for="(level, li) in orgStructure" :key="level.level" :class="li > 0 ? 'mt-10' : ''">
            <!-- Connector line to the level above -->
            <div v-if="li > 0" class="relative mx-auto mb-8 h-8 w-px bg-blue-300">
              <span class="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500" />
            </div>

            <!-- Label level: bullet + teks uppercase, rata kiri (mengikuti
                 referensi desain). Tidak ditampilkan untuk level "pimpinan"
                 (Lurah) karena nama levelnya sudah tampil sebagai eyebrow
                 di dalam kartu unggulan itu sendiri. -->
            <div v-if="!level.pimpinan" class="mb-5 flex items-center gap-2">
              <span class="h-2 w-2 flex-none rounded-full bg-blue-600" />
              <p class="text-xs font-bold uppercase tracking-widest text-blue-700/80">{{ level.level }}</p>
            </div>

            <!-- Lurah: kartu unggulan (featured card) — foto di kiri,
                 identitas + dua Tag beratribusi di kanan. Hanya Lurah yang
                 tampil di sini; Carik sudah dipindah ke level sekretariat. -->
            <div v-if="level.pimpinan" class="flex flex-col items-center gap-5">
              <Card
                v-for="(p, pi) in level.people"
                :key="p.title + p.name"
                class="js-reveal opacity-0 translate-y-4 w-full max-w-3xl overflow-hidden !rounded-2xl !border !border-blue-200 !shadow-md transition-all duration-300 hover:-translate-y-1 hover:!shadow-xl motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0"
                :style="{ transitionDelay: `${pi * 90}ms` }"
                :pt="{ content: { class: '!p-5 sm:!p-6' } }"
              >
                <template #content>
                  <div class="flex flex-col gap-5 sm:flex-row">
                    <Avatar
                      icon="pi pi-user"
                      shape="square"
                      size="xlarge"
                      class="!aspect-[3/4] !h-auto !w-full flex-none !rounded-xl !bg-blue-600 !text-5xl !text-white sm:!w-44"
                    />
                    <div class="flex flex-col justify-center text-left">
                      <span class="text-xs font-bold uppercase tracking-wider text-blue-600">{{ level.level }}</span>
                      <h3 class="mt-1 text-xl font-bold leading-tight text-blue-950 sm:text-2xl">{{ p.name }}</h3>
                      <p class="mt-2 text-sm leading-relaxed text-slate-500">{{ p.desc }}</p>
                      <div class="mt-4 flex flex-wrap gap-2">
                        <Tag
                          icon="pi pi-map-marker"
                          value="Kalurahan Bimomartani"
                          class="!rounded-full !border-none !bg-blue-50 !text-blue-700"
                        />
                        <Tag
                          icon="pi pi-verified"
                          :value="p.title"
                          class="!rounded-full !border-none !bg-blue-50 !text-blue-700"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <!-- Level dengan `slider: true` (Dukuh & Staff Pamong Kalurahan) ->
                 horizontal scroll/slider (native scroll-snap via Tailwind),
                 start-aligned supaya kartu paling kiri/kanan selalu tampil
                 FULL dan tidak kepotong saat digeser di mobile. Avatar
                 dibuat persegi (aspect-square) agar tidak terlalu dominan,
                 dan setiap kartu diberi deskripsi jobdesk singkat. -->
            <div
              v-else-if="level.slider"
              class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 flex snap-x snap-proximity gap-4 overflow-x-auto scroll-pl-4 pb-3 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-200"
              :class="level.centerOnDesktop ? 'justify-start lg:justify-center' : 'justify-start'"
            >
              <div
                v-for="p in level.people"
                :key="p.title + p.name"
                class="flex w-44 flex-none flex-col snap-start overflow-hidden rounded-xl border border-slate-100 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:w-48"
              >
                <Avatar
                  icon="pi pi-image"
                  shape="square"
                  size="xlarge"
                  class="!aspect-square !h-auto !w-full !flex-none !rounded-none !bg-blue-600 !text-3xl !text-white"
                />
                <div class="flex flex-1 flex-col px-3 py-3">
                  <p class="text-sm font-bold leading-tight text-slate-900">{{ p.name }}</p>
                  <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600">{{ p.title }}</p>
                  <p class="mt-2 text-[11px] leading-snug text-slate-400 line-clamp-2">{{ p.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Level lain (Sekretariat & Keuangan — termasuk Carik, dan
                 Kepala Seksi): grid portrait card ala foto jajaran pejabat —
                 foto persegi di bagian atas, nama tebal + jabatan biru huruf
                 kapital, lalu deskripsi jobdesk singkat di bawahnya. -->
            <div v-else class="flex flex-wrap justify-center gap-4">
              <div
                v-for="(p, pi) in level.people"
                :key="p.title + p.name"
                class="js-reveal opacity-0 translate-y-4 flex w-44 flex-none flex-col overflow-hidden rounded-xl border border-slate-100 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg sm:w-48 motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0"
                :style="{ transitionDelay: `${(li * 3 + pi) * 60}ms` }"
              >
                <Avatar
                  icon="pi pi-image"
                  shape="square"
                  size="xlarge"
                  class="!aspect-square !h-auto !w-full !flex-none !rounded-none !bg-blue-600 !text-3xl !text-white"
                />
                <div class="flex flex-1 flex-col px-3 py-3">
                  <p class="text-sm font-bold leading-tight text-slate-900">{{ p.name }}</p>
                  <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-600">{{ p.title }}</p>
                  <p class="mt-2 text-[11px] leading-snug text-slate-400 line-clamp-3">{{ p.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== REGION & DEMOGRAPHICS (emerald / green tone) ===== -->
    <section id="wilayah" data-section="wilayah" class="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-6 py-20">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#6ee7b7_1px,transparent_1px)] bg-[length:20px_20px] opacity-25" />

      <div class="relative mx-auto max-w-4xl">
        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 flex items-center gap-3">
          <span class="h-px w-8 bg-emerald-600" />
          <span class="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-emerald-700">Fakta &amp; Angka</span>
        </div>
        <h2 class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-2 text-2xl font-semibold text-slate-900">
          Data Wilayah &amp; Demografi
        </h2>

        <div
          class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 mt-6 grid grid-cols-2 gap-4 md:grid-cols-4"
          data-trigger="stats"
        >
          <Card
            v-for="(s, i) in stats"
            :key="s.label"
            class="group !rounded-xl border bg-gradient-to-br to-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            :class="accentFor(i).statBorder"
            :style="{ transitionDelay: `${i * 70}ms` }"
            :pt="{ content: { class: '!p-5' } }"
          >
            <template #content>
              <Avatar
                :icon="s.icon"
                shape="circle"
                class="text-lg transition-all duration-300 group-hover:!text-white group-hover:scale-110"
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

        <div class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 my-10 h-px w-full bg-emerald-100" />

        <!-- ===== INTERACTIVE MAP ===== -->
        <Card
          class="js-reveal opacity-0 translate-y-4 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!translate-y-0 isolate overflow-hidden !rounded-2xl !border !border-emerald-200 !shadow-[0_14px_32px_rgba(5,150,105,0.1)]"
          :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }"
        >
          <template #content>
            <div class="relative h-80 w-full">
              <div ref="mapEl" class="h-full w-full" />

              <div
                v-if="mapStatus === 'loading'"
                class="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]"
              >
                <span class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-500 shadow">
                  <ProgressSpinner class="h-4 w-4" stroke-width="6" />
                  Memuat batas wilayah dari OpenStreetMap...
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
              <Tag v-if="mapStatus === 'no-boundary'" severity="warn" value="Poligon batas belum tersedia — menampilkan titik lokasi saja." class="!text-xs" />
              <Tag v-else-if="mapStatus === 'error'" severity="danger" value="Gagal memuat data batas wilayah." class="!text-xs" />
            </div>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>