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

/* ---------------- Hero: background photo + parallax + title animation ---------------- */
const heroImageUrl = '/images/kalurahan-bimo.jpeg'
const heroImageLoaded = ref(false)

const heroTitleWords = 'Profil Desa Bimomartani'.split(' ')

const heroOffset = ref(0)
let rafId = null
function onHeroScroll() {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    // Subtle parallax: background moves slower than the page scroll
    heroOffset.value = Math.min(window.scrollY * 0.12, 40)
    rafId = null
  })
}

/* ---------------- Anchor nav (scroll-spy tabs) ---------------- */
/* IDs match the hash links defined in navMenu.js's "Profil Desa" dropdown
   (#history, #vision-mission, #org-structure) so clicking those items
   scrolls to the right section via the router's scrollBehavior. */
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

/* ---------------- Content data ---------------- */
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

// Tree structure consumed by PrimeVue's <OrganizationChart>.
// Assumes PrimeVue v3.x's `value` API (an array of root TreeNodes).
// If your project uses PrimeVue v4 / unstyled mode, check the
// OrganizationChart docs for the current node shape and CSS class names.
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

/* ---------------- Stats with count-up animation ---------------- */
const stats = reactive([
  { icon: '👥', label: 'Total Penduduk', target: 4521, value: 0, suffix: '' },
  { icon: '🏠', label: 'Kepala Keluarga', target: 1120, value: 0, suffix: '' },
  { icon: '🗺️', label: 'Luas Wilayah', target: 245, value: 0, suffix: ' Ha' },
  { icon: '🏘️', label: 'Jumlah RT/RW', target: 24, value: 0, suffix: ' / 6' },
])

let statsAnimated = false
function animateStats() {
  if (statsAnimated) return // avoid re-triggering every time the block re-enters the viewport
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

/* ---------------- Scroll reveal ---------------- */
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
  // FIX: the previous selector ('.reveal, [data-section]') did not match
  // elements carrying only [data-trigger], so the stats block was never
  // observed and animateStats() never ran (numbers stuck at 0).
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

/* ---------------- Interactive map (Leaflet + OSM boundary) ---------------- */
const mapEl = ref(null)
const mapStatus = ref('loading') // 'loading' | 'ok' | 'no-boundary' | 'error'
let leafletMap = null

// Approximate center point of Kalurahan Bimomartani, Kapanewon Ngemplak, Kabupaten Sleman, DIY.
// Used as a fallback / initial point before the boundary polygon finishes loading.
const VILLAGE_CENTER = [-7.7132, 110.4551]
const VILLAGE_QUERY = 'Bimomartani, Ngemplak, Sleman, Daerah Istimewa Yogyakarta, Indonesia'

async function initMap() {
  if (!mapEl.value) return

  leafletMap = L.map(mapEl.value, {
    scrollWheelZoom: false, // so page scroll doesn't get "trapped" inside the map
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
          color: '#dc2626', // red boundary line
          weight: 3,
          fillColor: '#dc2626',
          fillOpacity: 0.06,
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
    <!-- The background photo sits inside a rounded "card" with margin on
         the left/right/top (instead of a full-bleed section). Content is
         left-aligned inside the card. -->
    <section class="relative px-4 py-6 md:px-6 md:py-8">
      <div class="hero-card relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-2xl">
        <!-- Background photo layer: outer wrapper handles scroll parallax (JS),
             inner layer handles the Ken Burns effect (CSS). -->
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

        <!-- Blue accent blobs -->
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" />
        <div class="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/5 blur-3xl animate-float-slow" />

        <!-- Content: left-aligned, fixed card height (not a huge vertical padding) -->
        <div class="relative flex min-h-[440px] items-center px-6 py-14 md:min-h-[520px] md:px-14 md:py-20">
          <div class="max-w-xl">
            <div class="hero-pop inline-flex items-center gap-3">
              <span class="hero-kicker-dot h-2.5 w-2.5 flex-none rotate-45 bg-blue-500" />
              <span class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">Tentang Kami</span>
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
            <span class="hero-underline mt-4 block h-[3px] w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-300/40" />

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

    <!-- ===== HISTORY ===== -->
    <section id="history" data-section="history" class="mx-auto max-w-4xl px-6 py-20">
      <div class="reveal flex items-center gap-3">
        <span class="h-px w-8 bg-blue-500" />
        <h2 class="text-2xl font-semibold text-slate-900">Sejarah Desa Bimomartani</h2>
      </div>

      <div class="reveal mt-6 space-y-4 text-slate-600 leading-relaxed">
        <p>
          Nama Kalurahan Bimomartani terbentuk pada tanggal 29 April 1946 yang merupakan
          gabungan dari tiga kelurahan yaitu kelurahan Jatisari, Cokrosari dan Opaksari.
        </p>
        <p>
          Awal terbentuknya Kalurahan Bimomartani, kalurahan ini baru dipimpin oleh empat
          orang lurah. Sedangkan struktur organisasi dan tata kerja pemerintah kalurahan
          (SOTK) terbaru saat ini sesuai dengan Peraturan Bupati Sleman Nomor 46 Tahun 2016
          tentang Pedoman SOTK dan Peraturan Kalurahan Bimomartani Nomor 1 Tahun 2020
          tentang Susunan Organisasi dan Tata Kerja Tahun 2020.
        </p>
        <p>
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
            <div class="flex h-40 items-center justify-center text-blue-400/70 text-sm">
              Foto Balai Desa
            </div>
          </template>
        </Card>
        <Card class="photo-placeholder-card">
          <template #content>
            <div class="flex h-40 items-center justify-center text-blue-400/70 text-sm">
              Foto Kegiatan Warga
            </div>
          </template>
        </Card>
      </div>
    </section>

    <!-- ===== VISION & MISSION ===== -->
    <section id="vision-mission" data-section="vision-mission" class="bg-blue-50/50 px-6 py-20">
      <div class="mx-auto max-w-4xl text-center">
        <Card class="reveal vision-card mx-auto max-w-2xl">
          <template #content>
            <span class="text-5xl font-serif leading-none text-blue-300">&ldquo;</span>
            <h2 class="mt-1 text-2xl font-semibold text-slate-900">Visi</h2>
            <p class="mx-auto mt-3 text-slate-600">
              "Mewujudkan Desa Bimomartani yang Mandiri, Sejahtera, dan Berbudaya melalui
              Tata Kelola Pemerintahan yang Transparan dan Pembangunan Berkelanjutan."
            </p>
          </template>
        </Card>

        <h2 class="reveal mt-14 text-2xl font-semibold text-slate-900">Misi</h2>

        <div class="mt-6 space-y-3 text-left">
          <Card
            v-for="(item, i) in missions"
            :key="i"
            class="reveal mission-card"
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

    <!-- ===== ORGANIZATION STRUCTURE ===== -->
    <section id="org-structure" data-section="org-structure" class="mx-auto max-w-4xl px-6 py-20">
      <div class="reveal flex items-center gap-3">
        <span class="h-px w-8 bg-blue-500" />
        <h2 class="text-2xl font-semibold text-slate-900">Struktur Organisasi Pemerintah Desa</h2>
      </div>

      <Card class="reveal mt-6">
        <template #content>
          <p class="mb-6 text-center text-sm font-medium uppercase tracking-wide text-slate-400">
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
        <span class="text-blue-500">🗂️</span>
        <p class="text-sm font-medium text-slate-500">Deskripsi Tugas &amp; Fungsi</p>
      </div>

      <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          v-for="role in orgRoles"
          :key="role.no"
          class="reveal role-card"
          :style="{ transitionDelay: `${(role.no - 1) * 40}ms` }"
        >
          <template #content>
            <p class="font-semibold text-slate-900">
              <span class="text-blue-600">{{ role.no }}.</span> {{ role.title }}
            </p>
            <p class="mt-1.5 text-sm text-slate-500">{{ role.desc }}</p>
          </template>
        </Card>
      </div>
    </section>

    <!-- ===== REGION & DEMOGRAPHICS ===== -->
    <section id="wilayah" data-section="wilayah" class="mx-auto max-w-4xl px-6 py-20">
      <div class="reveal flex items-center gap-3">
        <span class="h-px w-8 bg-blue-500" />
        <h2 class="text-2xl font-semibold text-slate-900">Data Wilayah &amp; Demografi</h2>
      </div>

      <div class="reveal mt-6 grid grid-cols-2 gap-4 md:grid-cols-4" data-trigger="stats">
        <Card
          v-for="(s, i) in stats"
          :key="s.label"
          class="stat-card group"
          :style="{ transitionDelay: `${i * 70}ms` }"
        >
          <template #content>
            <Avatar :label="s.icon" shape="circle" class="stat-avatar transition-all duration-300 group-hover:!bg-blue-600 group-hover:scale-110" />
            <p class="mt-4 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {{ s.label }}
            </p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ s.value.toLocaleString('id-ID') }}<span class="text-base font-semibold text-slate-400">{{ s.suffix }}</span>
            </p>
          </template>
        </Card>
      </div>

      <div class="reveal my-10 h-px w-full bg-slate-100" />

      <!-- ===== INTERACTIVE MAP ===== -->
      <Card class="reveal isolate overflow-hidden" :pt="{ body: { class: '!p-0' }, content: { class: '!p-0' } }">
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

          <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="inline-block h-2.5 w-4 rounded-sm bg-red-600/80" />
              <p class="text-xs text-slate-400">
                Garis merah menunjukkan batas administratif Kalurahan Bimomartani (data OpenStreetMap).
              </p>
            </div>
            <Tag v-if="mapStatus === 'no-boundary'" severity="warn" value="Poligon batas belum tersedia — menampilkan titik lokasi saja." class="!text-xs" />
            <Tag v-else-if="mapStatus === 'error'" severity="danger" value="Gagal memuat data batas wilayah." class="!text-xs" />
          </div>
        </template>
      </Card>
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

/* Hero entrance: plays right on mount, not tied to scroll, so it still
   shows up when the page is opened via a deep link (e.g. #org-structure). */
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

/* Title: each word appears one by one with a blur-in + 3D rotation */
.hero-word {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(34px) rotateX(55deg) scale(0.92);
  transform-origin: bottom;
  color: #f8fafc;
  animation: heroWordIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes heroWordIn {
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) rotateX(0) scale(1);
  }
}

/* Last title word ("Bimomartani"): navbar-matching blue */
.hero-word--accent {
  color: #3b82f6;
}

/* Looping typewriter effect on the last title word */
.hero-typing {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
  width: 0;
  border-right: 3px solid #3b82f6;
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

/* ---------------- PrimeVue component styling overrides ---------------- */
/* Class names below (p-tab*, p-organizationchart-*, p-card, p-avatar,
   p-tag) target PrimeVue v5's default (non-unstyled) theme. If your
   project runs PrimeVue in unstyled mode with a Tailwind preset instead,
   these selectors may need to be adjusted to match your theme's class
   names. */

/* Anchor nav Tabs (replaces the removed TabMenu): strip the default look,
   restore the original underline-on-active-tab style. Since no TabPanels
   are used, only the Tabs/TabList/Tab class names below matter. */
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
  background: linear-gradient(to bottom right, #eff6ff, #dbeafe);
  border: 1px solid #dbeafe;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.photo-placeholder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.12);
}

.vision-card :deep(.p-card-content) {
  padding: 2rem;
}
.vision-card {
  border-radius: 1rem;
}

.mission-card :deep(.p-card-content) {
  padding: 1rem;
}
.mission-card {
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.mission-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}
.mission-avatar {
  background: #2563eb !important;
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
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.role-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08);
  transform: translateY(-2px);
}

.stat-card {
  border-radius: 0.75rem;
  border: 1px solid #f1f5f9;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.stat-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.12);
  transform: translateY(-4px);
}
.stat-avatar {
  background: #eff6ff !important;
  font-size: 1.125rem;
}

/* Organization chart node styling to match the site's card look */
.org-chart-wrap :deep(.p-organizationchart-node-content) {
  border-radius: 10px;
  border: 1px solid #dbeafe;
  background: #fff;
  padding: 10px 18px;
  box-shadow: 0 1px 2px rgba(30, 64, 175, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.org-chart-wrap :deep(.p-organizationchart-node-content:hover) {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.12);
}
.org-chart-node-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e3a8a;
}
.org-chart-wrap :deep(.p-organizationchart-line-down),
.org-chart-wrap :deep(.p-organizationchart-line-left),
.org-chart-wrap :deep(.p-organizationchart-line-right) {
  border-color: #bfdbfe;
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