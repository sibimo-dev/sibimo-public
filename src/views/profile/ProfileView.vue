<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
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
import OrganizationChart from 'primevue/organizationchart'

/* Fix the default Leaflet marker icon path, which often breaks once bundled (Vite/Webpack) */
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

/* Hero: background photo + parallax + title animation */
const heroImageUrl = '/images/kalurahan-bimo.jpeg'
const heroImageLoaded = ref(false)

const heroTitleWords = 'Profil Desa Bimomartani'.split(' ')

const heroOffset = ref(0)
let rafId = null
function onHeroScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    heroOffset.value = Math.min(window.scrollY * 0.12, 40)
    rafId = null
  })
}

/* Anchor nav (scroll-spy tabs) */
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

// Fires when the user clicks a tab. Tabs' `value` is two-way bound to
// activeSection, so clicking already updates the highlighted tab; this
// just adds the actual scroll behavior on top of that.
function onTabChange(id) {
  activeSection.value = id
  scrollTo(id)
}

/* Color accents */
const accentPalette = ['blue', 'purple', 'teal', 'amber', 'rose', 'indigo']
function accentClass(i) {
  return `accent-${accentPalette[i % accentPalette.length]}`
}

/* Content data */
const missions = [
  'Meningkatkan kualitas pelayanan publik berbasis teknologi informasi.',
  'Mengembangkan potensi ekonomi lokal melalui pemberdayaan UMKM dan BUMDes.',
  'Melestarikan nilai-nilai budaya dan kearifan lokal masyarakat.',
  'Membangun infrastruktur desa yang memadai dan berwawasan lingkungan.',
]

const orgRoles = [
  { no: 1, title: 'Kepala Desa', desc: 'Memimpin penyelenggaraan pemerintahan desa.' },
  { no: 2, title: 'Sekretaris Desa', desc: 'Membantu Kepala Desa dalam bidang administrasi pemerintahan.' },
  { no: 3, title: 'Kaur Tata Usaha & Umum', desc: 'Mengurus administrasi persuratan, kearsipan, dan perlengkapan.' },
  { no: 4, title: 'Kaur Keuangan', desc: 'Mengelola administrasi keuangan desa.' },
  { no: 5, title: 'Kaur Perencanaan', desc: 'Menyusun rencana pembangunan dan monitoring.' },
  { no: 6, title: 'Kasi Pemerintahan', desc: 'Melaksanakan manajemen tata praja dan kependudukan.' },
  { no: 7, title: 'Kasi Kesejahteraan', desc: 'Melaksanakan pembangunan sarana prasarana dan sosial.' },
  { no: 8, title: 'Kasi Pelayanan', desc: 'Melaksanakan penyuluhan dan pembinaan masyarakat.' },
]

const orgChartLeaves = [
  'Kaur Tata Usaha & Umum',
  'Kaur Keuangan',
  'Kaur Perencanaan',
  'Kasi Pemerintahan',
  'Kasi Kesejahteraan',
  'Kasi Pelayanan',
]

const orgChartData = ref([
  {
    key: '0',
    label: 'Kepala Desa',
    children: [
      {
        key: '0-0',
        label: 'Sekretaris Desa',
        children: orgChartLeaves.map((label, index) => ({
          key: `0-0-${index}`,
          label,
        })),
      },
    ],
  },
])

/* Stats with count-up animation */
const stats = reactive([
  { icon: '👥', label: 'Total Penduduk', target: 4521, value: 0, suffix: '' },
  { icon: '🏠', label: 'Kepala Keluarga', target: 1120, value: 0, suffix: '' },
  { icon: '🗺️', label: 'Luas Wilayah', target: 245, value: 0, suffix: ' Ha' },
  { icon: '🏘️', label: 'Jumlah RT/RW', target: 24, value: 0, suffix: ' / 6' },
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

/* Scroll reveal */
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          if (entry.target.dataset.trigger === 'stats') animateStats()
          if (entry.target.dataset.section) activeSection.value = entry.target.dataset.section
        }
      })
    },
    { threshold: 0.2, rootMargin: '-80px 0px -40% 0px' }
  )
  document
    .querySelectorAll('.reveal, [data-section], [data-trigger]')
    .forEach((el) => observer.observe(el))

  initMap()

  window.addEventListener('scroll', onHeroScroll, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  leafletMap?.remove()
  window.removeEventListener('scroll', onHeroScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

/* Interactive map (Leaflet + OSM boundary) */
const mapEl = ref(null)
const mapStatus = ref('loading')
let leafletMap = null

// Used as a fallback / initial point before the boundary polygon finishes loading.
const VILLAGE_CENTER = [-7.7132, 110.4551]
const VILLAGE_QUERY = 'Bimomartani, Ngemplak, Sleman, Daerah Istimewa Yogyakarta, Indonesia'

async function initMap() {
  if (!mapEl.value) return

  leafletMap = L.map(mapEl.value, {
    scrollWheelZoom: false,
    zoomControl: true,
  }).setView(VILLAGE_CENTER, 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  }).addTo(leafletMap)

  // Enable scroll-zoom only after the map is clicked/focused, so it doesn't hijack page scroll
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
      <div class="hero-card relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
        <div
          class="hero-photo absolute inset-0 -z-20 overflow-hidden bg-slate-900"
          :style="{ transform: `translateY(${heroOffset}px)` }"
        >
          <div
            class="hero-photo__zoom h-[130%] w-[110%] -m-[6%] bg-cover bg-[center_30%]"
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
          class="absolute inset-0 -z-20 transition-opacity duration-700"
          :class="heroImageLoaded ? 'opacity-0' : 'opacity-100'"
          style="background: linear-gradient(135deg,#0a0f1c 0%,#101a2e 50%,#0d1526 100%)"
        />

        <!-- Left-to-right dark overlay so the left-side text stays readable
             while the photo remains visible on the right. -->
        <div
          class="absolute inset-0 -z-10"
          style="background: linear-gradient(90deg, rgba(5,9,20,0.92) 0%, rgba(5,9,20,0.72) 38%, rgba(5,9,20,0.35) 68%, rgba(5,9,20,0.12) 100%)"
        />
        <div
          class="absolute inset-0 -z-10"
          style="background: linear-gradient(180deg, rgba(5,9,20,0.45) 0%, rgba(5,9,20,0.05) 30%, rgba(5,9,20,0.05) 70%, rgba(5,9,20,0.55) 100%)"
        />

        <!-- Subtle dot texture -->
        <div class="hero-dots pointer-events-none absolute inset-0 -z-10 opacity-20" />

        <!-- Accent blobs (warmer, two-tone: blue + amber echoes the sections below) -->
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" />
        <div class="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl animate-float-slow" />

        <!-- Content: left-aligned, fixed card height (not a huge vertical padding) -->
        <div class="relative flex min-h-[440px] items-center px-6 py-14 md:min-h-[520px] md:px-14 md:py-20">
          <div class="max-w-xl">
            <div class="hero-pop inline-flex items-center gap-3">
              <span class="hero-kicker-dot h-2.5 w-2.5 flex-none rotate-45 bg-gradient-to-br from-sky-400 to-violet-500" />
              <span class="hero-kicker-label text-xs font-semibold uppercase tracking-[0.3em]">Tentang Kami</span>
            </div>

            <h1 class="mt-5 text-3xl font-bold leading-tight tracking-tight [perspective:800px] md:text-5xl">
              <span
                v-for="(word, i) in heroTitleWords"
                :key="i"
                class="hero-word inline-block"
                :class="{ 'hero-word--accent': i === heroTitleWords.length - 1 }"
                :style="{ animationDelay: `${0.3 + i * 0.16}s` }"
              >
                <span v-if="i === heroTitleWords.length - 1" class="hero-typing align-bottom">{{ word }}</span>
                <template v-else>{{ word }}<span>&nbsp;</span></template>
              </span>
            </h1>

            <!-- Accent underline that "grows" once the last word has appeared -->
            <span class="hero-underline mt-4 block h-[3px] w-16 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500" />

            <p class="hero-in mt-5 text-sm leading-relaxed !text-slate-200 md:text-base" style="animation-delay: 0.95s">
              Mengenal lebih dekat sejarah, visi misi, dan potensi wilayah desa kami
              yang kaya akan warisan budaya dan keindahan alam.
            </p>

            <div class="hero-in mt-4 flex items-center gap-2 text-xs font-medium !text-slate-300" style="animation-delay: 1.1s">
              <span class="h-px w-6 bg-blue-400/50" />
              Kapanewon Ngemplak, Kabupaten Sleman, Daerah Istimewa Yogyakarta
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STICKY ANCHOR NAV (PrimeVue Tabs, scroll-spy) ===== -->
    <nav class="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div class="anchor-tabs mx-auto max-w-4xl px-6">
        <Tabs :value="activeSection" @update:value="onTabChange">
          <TabList>
            <Tab v-for="s in sections" :key="s.id" :value="s.id">{{ s.label }}</Tab>
          </TabList>
        </Tabs>
      </div>
    </nav>

    <!-- ===== HISTORY (amber / heritage tone) ===== -->
    <section id="history" data-section="history" class="section-tint section-tint--amber relative overflow-hidden px-6 py-20">
      <div class="section-dots section-dots--amber pointer-events-none absolute inset-0" />
      <span class="section-year pointer-events-none absolute -right-4 top-6 select-none">1946</span>

      <div class="relative mx-auto max-w-4xl">
        <div class="reveal flex items-center gap-3">
          <span class="section-eyebrow-dash section-eyebrow-dash--amber" />
          <span class="section-eyebrow section-eyebrow--amber">Sejak 1946</span>
        </div>
        <h2 class="reveal mt-2 text-2xl font-semibold text-slate-900">Sejarah Desa Bimomartani</h2>

        <div class="reveal mt-6 space-y-5 border-l-2 border-amber-200 pl-6 text-slate-600 leading-relaxed">
          <p class="history-milestone">
            <span class="history-dot history-dot--amber" />
            Nama Kalurahan Bimomartani terbentuk pada tanggal 29 April 1946 yang merupakan
            gabungan dari tiga kelurahan yaitu kelurahan Jatisari, Cokrosari dan Opaksari.
          </p>
          <p class="history-milestone">
            <span class="history-dot history-dot--amber" />
            Awal terbentuknya Kalurahan Bimomartani, kalurahan ini baru dipimpin oleh empat
            orang lurah. Sedangkan struktur organisasi dan tata kerja pemerintah kalurahan
            (SOTK) terbaru saat ini sesuai dengan Peraturan Bupati Sleman Nomor 46 Tahun 2016
            tentang Pedoman SOTK dan Peraturan Kalurahan Bimomartani Nomor 1 Tahun 2020
            tentang Susunan Organisasi dan Tata Kerja Tahun 2020.
          </p>
          <p class="history-milestone">
            <span class="history-dot history-dot--amber" />
            Pemerintah Kalurahan Bimomartani terdiri dari Lurah dan Perangkat Kalurahan.
            Perangkat Kalurahan terdiri dari Sekretaris Kalurahan, Pelaksana Teknis, dan
            Pelaksana Kewilayahan. Sekretaris Kalurahan dipimpin oleh Carik yang berada di
            bawah dan bertanggungjawab kepada Lurah. Sekretaris Kalurahan terdiri dari Urusan
            Tata Usaha Umum, Urusan Keuangan, dan Urusan Perencanaan. Urusan dalam hal ini
            dipimpin oleh Kepala Urusan yang berada dibawah dan bertanggungjawab kepada Lurah
            melalui Carik. Pelaksana Kewilayahan Kalurahan Bimomartani terdiri dari 12 Padukuhan.
          </p>
        </div>

        <div class="reveal mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card class="photo-placeholder-card">
            <template #content>
              <div class="flex h-40 items-center justify-center text-amber-600/70 text-sm">
                📷 Foto Balai Desa
              </div>
            </template>
          </Card>
          <Card class="photo-placeholder-card">
            <template #content>
              <div class="flex h-40 items-center justify-center text-amber-600/70 text-sm">
                📷 Foto Kegiatan Warga
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- ===== VISION & MISSION (indigo / violet tone) ===== -->
    <section id="vision-mission" data-section="vision-mission" class="section-tint section-tint--violet relative overflow-hidden px-6 py-20">
      <div class="section-dots section-dots--violet pointer-events-none absolute inset-0" />

      <div class="relative mx-auto max-w-4xl text-center">
        <Card class="reveal vision-card mx-auto max-w-2xl">
          <template #content>
            <span class="vision-quote">&ldquo;</span>
            <h2 class="mt-1 text-2xl font-semibold text-slate-900">Visi</h2>
            <p class="mx-auto mt-3 text-slate-600">
              "Mewujudkan Desa Bimomartani yang Mandiri, Sejahtera, dan Berbudaya melalui
              Tata Kelola Pemerintahan yang Transparan dan Pembangunan Berkelanjutan."
            </p>
          </template>
        </Card>

        <div class="reveal mt-14 flex items-center justify-center gap-3">
          <span class="section-eyebrow-dash section-eyebrow-dash--violet" />
          <span class="section-eyebrow section-eyebrow--violet">Arah Kami</span>
        </div>
        <h2 class="reveal mt-2 text-2xl font-semibold text-slate-900">Misi</h2>

        <div class="mt-6 space-y-3 text-left">
          <Card
            v-for="(item, i) in missions"
            :key="i"
            class="reveal mission-card"
            :class="accentClass(i)"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <template #content>
              <div class="flex items-start gap-4">
                <Avatar :label="String(i + 1)" shape="circle" class="mission-avatar flex-none" />
                <p class="pt-1 text-slate-600">{{ item }}</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- ===== ORGANIZATION STRUCTURE (teal tone) ===== -->
    <section id="org-structure" data-section="org-structure" class="section-tint section-tint--teal relative overflow-hidden px-6 py-20">
      <div class="section-dots section-dots--teal pointer-events-none absolute inset-0" />

      <div class="relative mx-auto max-w-4xl">
        <div class="reveal flex items-center gap-3">
          <span class="section-eyebrow-dash section-eyebrow-dash--teal" />
          <span class="section-eyebrow section-eyebrow--teal">Tata Kelola</span>
        </div>
        <h2 class="reveal mt-2 text-2xl font-semibold text-slate-900">Struktur Organisasi Pemerintah Desa</h2>

        <Card class="reveal org-chart-card mt-6">
          <template #content>
            <p class="mb-6 text-center text-sm font-medium uppercase tracking-wide text-teal-600/70">
              Pemerintah Desa
            </p>

            <!-- PrimeVue OrganizationChart replaces the hand-rolled flowchart markup. -->
            <div class="org-chart-wrap overflow-x-auto">
              <OrganizationChart :value="orgChartData">
                <template #default="slotProps">
                  <span class="org-chart-node-label">{{ slotProps.node.label }}</span>
                </template>
              </OrganizationChart>
            </div>
          </template>
        </Card>

        <div class="mt-10 flex items-center gap-2">
          <span class="text-teal-600">🗂️</span>
          <p class="text-sm font-medium text-slate-500">Deskripsi Tugas &amp; Fungsi</p>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            v-for="role in orgRoles"
            :key="role.no"
            class="reveal role-card"
            :class="accentClass(role.no - 1)"
            :style="{ transitionDelay: `${(role.no - 1) * 40}ms` }"
          >
            <template #content>
              <div class="flex items-start gap-3">
                <span class="role-badge flex-none">{{ role.no }}</span>
                <div>
                  <p class="font-semibold text-slate-900">{{ role.title }}</p>
                  <p class="mt-1.5 text-sm text-slate-500">{{ role.desc }}</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- ===== REGION & DEMOGRAPHICS (emerald / green tone) ===== -->
    <section id="wilayah" data-section="wilayah" class="section-tint section-tint--emerald relative overflow-hidden px-6 py-20">
      <div class="section-dots section-dots--emerald pointer-events-none absolute inset-0" />

      <div class="relative mx-auto max-w-4xl">
        <div class="reveal flex items-center gap-3">
          <span class="section-eyebrow-dash section-eyebrow-dash--emerald" />
          <span class="section-eyebrow section-eyebrow--emerald">Fakta &amp; Angka</span>
        </div>
        <h2 class="reveal mt-2 text-2xl font-semibold text-slate-900">Data Wilayah &amp; Demografi</h2>

        <div class="reveal mt-6 grid grid-cols-2 gap-4 md:grid-cols-4" data-trigger="stats">
          <Card
            v-for="(s, i) in stats"
            :key="s.label"
            class="stat-card"
            :class="accentClass(i)"
            :style="{ transitionDelay: `${i * 70}ms` }"
          >
            <template #content>
              <Avatar :label="s.icon" shape="circle" class="stat-avatar transition-all duration-300" />
              <p class="mt-4 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {{ s.label }}
              </p>
              <p class="mt-1 text-2xl font-bold text-slate-900">
                {{ s.value.toLocaleString('id-ID') }}<span class="text-base font-semibold text-slate-400">{{ s.suffix }}</span>
              </p>
            </template>
          </Card>
        </div>

        <div class="reveal my-10 h-px w-full bg-emerald-100" />

        <!-- ===== INTERACTIVE MAP ===== -->
        <Card class="reveal map-card isolate overflow-hidden" :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }">
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

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Hero entrance */
.hero-in {
  opacity: 0;
  transform: translateY(14px);
  animation: heroFadeUp 0.7s ease forwards;
}
@keyframes heroFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* "TENTANG KAMI" kicker: pops in slightly, accent dot pulses gently */
.hero-pop {
  opacity: 0;
  transform: translateX(-8px);
  animation: heroKickerIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes heroKickerIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.hero-kicker-dot {
  animation: kickerPulse 2.4s ease-in-out infinite 0.8s;
}
@keyframes kickerPulse {
  0%, 100% { transform: rotate(45deg) scale(1); opacity: 1; }
  50% { transform: rotate(45deg) scale(1.25); opacity: 0.7; }
}

/* "Tentang Kami" kicker label: soft gradient text instead of flat blue-300 */
.hero-kicker-label {
  background: linear-gradient(90deg, #7dd3fc, #c4b5fd);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Title: each word appears one by one with a blur-in + 3D rotation */
.hero-word {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(34px) rotateX(55deg) scale(0.92);
  transform-origin: bottom;
  color: #f1f5f9;
  text-shadow: 0 2px 24px rgba(15, 23, 42, 0.35);
  animation: heroWordIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes heroWordIn {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) rotateX(0) scale(1);
  }
}

/* Last title word ("Bimomartani") */
.hero-word--accent {
  background: linear-gradient(90deg, #38bdf8 0%, #6366f1 55%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 18px rgba(99, 102, 241, 0.45));
}

/* Looping typewriter effect on the last title word */
.hero-typing {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  width: 0;
  border-right: 3px solid #a855f7;
  animation:
    heroTypingLoop 5s steps(11, end) infinite,
    heroCaretBlink 0.7s step-end infinite;
  animation-delay: 1.6s, 1.6s;
  animation-fill-mode: backwards, backwards;
}
@keyframes heroTypingLoop {
  0% { width: 0; }
  8% { width: 0; }
  45% { width: 11ch; }
  85% { width: 11ch; }
  100% { width: 0; }
}
@keyframes heroCaretBlink {
  50% { border-color: transparent; }
}

/* Accent underline: grows from the left once the last word has appeared */
.hero-underline {
  transform: scaleX(0);
  transform-origin: left;
  animation: underlineGrow 0.7s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  animation-delay: 1.15s;
}
@keyframes underlineGrow {
  to { transform: scaleX(1); }
}

/* Hero background photo: outer wrapper (scroll parallax) */
.hero-photo {
  transition: transform 0.05s linear;
  will-change: transform;
}
/* Inner layer: Ken Burns effect — a single smooth zoom-out on load */
.hero-photo__zoom {
  animation: heroKenBurns 9s ease-out forwards;
  will-change: transform;
}
@keyframes heroKenBurns {
  from { transform: scale(1.1); }
  to { transform: scale(1); }
}

/* Subtle dot texture over the hero photo/gradient */
.hero-dots {
  background-image: radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px);
  background-size: 22px 22px;
}

@keyframes pulse-slow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.15); opacity: 0.8; }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}

@keyframes float-slow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(12px, -14px); }
}
.animate-float-slow {
  animation: float-slow 9s ease-in-out infinite;
}

/* SECTION COLOR IDENTITIES */
.section-tint--amber {
  background: linear-gradient(180deg, #fffaf0 0%, #ffffff 85%);
}
.section-tint--violet {
  background: linear-gradient(180deg, #f5f3ff 0%, #eef2ff 55%, #ffffff 100%);
}
.section-tint--teal {
  background: linear-gradient(180deg, #f0fdfa 0%, #ffffff 85%);
}
.section-tint--emerald {
  background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 85%);
}

.section-dots {
  opacity: 0.5;
  background-size: 20px 20px;
}
.section-dots--amber {
  background-image: radial-gradient(#fcd34d 1px, transparent 1px);
  opacity: 0.25;
}
.section-dots--violet {
  background-image: radial-gradient(#c4b5fd 1px, transparent 1px);
  opacity: 0.25;
}
.section-dots--teal {
  background-image: radial-gradient(#5eead4 1px, transparent 1px);
  opacity: 0.22;
}
.section-dots--emerald {
  background-image: radial-gradient(#6ee7b7 1px, transparent 1px);
  opacity: 0.22;
}

/* Big translucent watermark year behind the history heading */
.section-year {
  font-size: 9rem;
  font-weight: 800;
  line-height: 1;
  color: #f59e0b;
  opacity: 0.08;
}

/* Small colored "eyebrow" label + dash, one variant per section hue */
.section-eyebrow-dash {
  height: 1px;
  width: 2rem;
}
.section-eyebrow-dash--amber { background: #f59e0b; }
.section-eyebrow-dash--violet { background: #7c3aed; }
.section-eyebrow-dash--teal { background: #0d9488; }
.section-eyebrow-dash--emerald { background: #059669; }

.section-eyebrow {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}
.section-eyebrow--amber { color: #b45309; }
.section-eyebrow--violet { color: #6d28d9; }
.section-eyebrow--teal { color: #0f766e; }
.section-eyebrow--emerald { color: #047857; }

/* History timeline dots marking each paragraph/milestone */
.history-milestone {
  position: relative;
}
.history-dot {
  position: absolute;
  left: -2.05rem;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px currentColor;
}
.history-dot--amber {
  background: #f59e0b;
  color: #f59e0b;
}

/* PrimeVue component styling overrides */
.anchor-tabs :deep(.p-tabs) {
  background: transparent;
}
.anchor-tabs :deep(.p-tablist) {
  border: none;
  background: transparent;
}
.anchor-tabs :deep(.p-tablist-tab-list) {
  gap: 0.25rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  border: none;
}
.anchor-tabs :deep(.p-tab) {
  border: none;
  background: transparent;
  padding: 1rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  white-space: nowrap;
}
.anchor-tabs :deep(.p-tab-active) {
  color: #2563eb;
  background: transparent;
}
.anchor-tabs :deep(.p-tablist-active-bar) {
  background: #2563eb;
  height: 2px;
}

/* Accent tokens */
.accent-blue {
  --accent: #2563eb;
  --accent-soft: #eff6ff;
  --accent-soft2: #dbeafe;
}
.accent-purple {
  --accent: #7c3aed;
  --accent-soft: #f5f3ff;
  --accent-soft2: #ede9fe;
}
.accent-teal {
  --accent: #0d9488;
  --accent-soft: #f0fdfa;
  --accent-soft2: #ccfbf1;
}
.accent-amber {
  --accent: #d97706;
  --accent-soft: #fffbeb;
  --accent-soft2: #fef3c7;
}
.accent-rose {
  --accent: #e11d48;
  --accent-soft: #fff1f2;
  --accent-soft2: #ffe4e6;
}
.accent-indigo {
  --accent: #4f46e5;
  --accent-soft: #eef2ff;
  --accent-soft2: #e0e7ff;
}

/* Card blocks used as generic content containers */
.photo-placeholder-card :deep(.p-card-body),
.role-card :deep(.p-card-body),
.mission-card :deep(.p-card-body),
.vision-card :deep(.p-card-body),
.stat-card :deep(.p-card-body) {
  padding: 0;
}
.photo-placeholder-card :deep(.p-card-content),
.stat-card :deep(.p-card-content) {
  padding: 1.25rem;
}
.photo-placeholder-card {
  border-radius: 0.75rem;
  overflow: hidden;
  background: linear-gradient(to bottom right, #fff7ed, #ffedd5);
  border: 1px solid #fed7aa;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.photo-placeholder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(217, 119, 6, 0.14);
}

/* Vision card: gradient top bar + a soft violet glow to stand out from the rest of the page */
.vision-card :deep(.p-card-content) {
  padding: 2rem;
  position: relative;
}
.vision-card {
  border-radius: 1rem;
  border: none;
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #faf9ff 100%);
  box-shadow: 0 16px 40px rgba(124, 58, 237, 0.14);
}
.vision-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  border-radius: 1rem 1rem 0 0;
  background: linear-gradient(90deg, #7c3aed, #2563eb);
}
.vision-quote {
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 3rem;
  line-height: 1;
  background: linear-gradient(90deg, #7c3aed, #2563eb);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mission-card :deep(.p-card-content) {
  padding: 1rem;
}
.mission-card {
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  border-left: 3px solid var(--accent, #2563eb);
  background: linear-gradient(90deg, var(--accent-soft, #eff6ff) 0%, #ffffff 14%);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.mission-card:hover {
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}
.mission-avatar {
  background: var(--accent, #2563eb) !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 0.875rem;
}

.role-card :deep(.p-card-content) {
  padding: 1.25rem;
}
.role-card {
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  border-top: 3px solid var(--accent, #2563eb);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.role-card:hover {
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}
.role-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: var(--accent-soft, #eff6ff);
  color: var(--accent, #2563eb);
  font-size: 0.8rem;
  font-weight: 700;
}

.stat-card {
  border-radius: 0.75rem;
  border: 1px solid var(--accent-soft2, #f1f5f9);
  background: linear-gradient(160deg, var(--accent-soft, #ffffff) 0%, #ffffff 65%);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.stat-card:hover {
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.1);
  transform: translateY(-4px);
}
.stat-avatar {
  background: var(--accent-soft2, #eff6ff) !important;
  color: var(--accent, #2563eb) !important;
  font-size: 1.125rem;
}
.stat-card:hover .stat-avatar {
  background: var(--accent, #2563eb) !important;
  color: #fff !important;
  transform: scale(1.1);
}

/* Org chart card + node styling: teal identity for the "Struktur Organisasi" section */
.org-chart-card {
  border-radius: 1rem;
  border: 1px solid #ccfbf1;
  box-shadow: 0 10px 30px rgba(13, 148, 136, 0.08);
}
.org-chart-wrap :deep(.p-organizationchart-node-content) {
  border-radius: 10px;
  border: 1px solid #99f6e4;
  background: linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%);
  padding: 10px 18px;
  box-shadow: 0 1px 2px rgba(13, 148, 136, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.org-chart-wrap :deep(.p-organizationchart-node-content:hover) {
  transform: translateY(-2px);
  border-color: #2dd4bf;
  box-shadow: 0 6px 16px rgba(13, 148, 136, 0.18);
}
.org-chart-node-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f766e;
}
.org-chart-wrap :deep(.p-organizationchart-line-down),
.org-chart-wrap :deep(.p-organizationchart-line-left),
.org-chart-wrap :deep(.p-organizationchart-line-right) {
  border-color: #5eead4;
}

/* Map card: emerald identity for the "Wilayah & Demografi" section */
.map-card {
  border-radius: 1rem;
  border: 1px solid #a7f3d0;
  box-shadow: 0 14px 32px rgba(5, 150, 105, 0.1);
}

/* Leaflet: keep the map controls (zoom, etc.) below the sticky nav's z-index */
:deep(.leaflet-pane),
:deep(.leaflet-top),
:deep(.leaflet-bottom) {
  z-index: 10;
}

@media (prefers-reduced-motion: reduce) {
  /* Decorative looping animations (blobs, dot pulse, kicker, Ken Burns, typing) fully disabled */
  .animate-pulse-slow, .animate-float-slow, .hero-word, .hero-word--accent,
  .hero-kicker-dot, .hero-photo__zoom, .hero-typing {
    animation: none !important;
  }
  .hero-word, .hero-word--accent {
    color: #ffffff !important;
    background: none !important;
    -webkit-background-clip: unset !important;
    filter: none !important;
  }
  .hero-word--accent {
    color: #3b82f6 !important;
  }
  .hero-typing {
    width: auto !important;
    border-right: none !important;
  }
  .hero-photo__zoom {
    transform: scale(1) !important;
  }
  /* "Entrance" animations stay visible but are sped up drastically, not removed entirely */
  .reveal, .hero-in, .hero-photo, .hero-pop, .hero-underline {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    transform: none !important;
  }
}
</style>