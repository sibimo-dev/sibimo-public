<script setup>
import { ref, computed, watch } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'

const categories = [
  { slug: 'all', label: 'Semua', count: 24 },
  { slug: 'musyawarah', label: 'Musyawarah', count: 5 },
  { slug: 'kegiatan-sosial', label: 'Kegiatan Sosial', count: 8 },
  { slug: 'pembangunan', label: 'Pembangunan', count: 3 },
  { slug: 'budaya', label: 'Budaya', count: 8 },
]

const timeOptions = [
  { label: 'Semua Waktu', value: 'all' },
  { label: 'Agustus 2024', value: '2024-08' },
  { label: 'Juli 2024', value: '2024-07' },
  { label: 'Juni 2024', value: '2024-06' },
  { label: 'Mei 2024', value: '2024-05' },
  { label: 'April 2024', value: '2024-04' },
  { label: 'Maret 2024', value: '2024-03' },
  { label: 'Februari 2024', value: '2024-02' },
  { label: 'Januari 2024', value: '2024-01' },
]

// Sample dataset — replace with real API data once the backend endpoint is
// ready. Kept intentionally larger than the wireframe's 4 visible cards so
// "Muat Lebih Banyak" and the stagger animation have something to show.
const events = [
  {
    id: 1,
    day: '17',
    month: 'AGUSTUS',
    monthKey: '2024-08',
    category: 'kegiatan-sosial',
    location: 'Lapangan Desa Bimomartani',
    title: 'Perayaan HUT RI ke-79 & Malam Tirakatan',
    description:
      'Rangkaian kegiatan peringatan Hari Kemerdekaan RI ke-79, perlombaan antar dusun, malam tirakatan, dan upacara bendera di lapangan desa. Termasuk jadwal lomba dan pentas seni warga.',
  },
  {
    id: 2,
    day: '05',
    month: 'JULI',
    monthKey: '2024-07',
    category: 'musyawarah',
    location: 'Balai Desa Bimomartani',
    title: 'Musrenbangdes Tahunan 2024',
    description:
      'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) tahunan. Pembahasan alokasi dana desa semester dua, evaluasi program kerja BUMDes, dan usulan prioritas pembangunan.',
  },
  {
    id: 3,
    day: '12',
    month: 'JUNI',
    monthKey: '2024-06',
    category: 'pembangunan',
    location: 'Saluran Irigasi Utama',
    title: 'Gotong Royong Massal Persiapan Musim Tanam',
    description:
      'Kegiatan gotong royong massal pembersihan saluran irigasi menjelang musim tanam. Pelatihan UMKM pengolahan hasil panen untuk kelompok ibu-ibu PKK.',
  },
  {
    id: 4,
    day: '28',
    month: 'MEI',
    monthKey: '2024-05',
    category: 'budaya',
    location: 'Pendopo Desa',
    title: 'Festival Seni & Budaya Desa',
    description:
      'Pentas seni tahunan menampilkan potensi budaya lokal, pameran kerajinan tangan BUMDes, dan pertunjukan wayang kulit semalam suntuk sebagai penutup acara.',
  },
  {
    id: 5,
    day: '20',
    month: 'APRIL',
    monthKey: '2024-04',
    category: 'kegiatan-sosial',
    location: 'Balai Desa Bimomartani',
    title: 'Pelatihan Pengolahan Hasil Panen UMKM',
    description:
      'Pelatihan bagi pelaku UMKM desa dalam mengolah hasil panen menjadi produk bernilai jual tinggi, bekerja sama dengan Dinas Pertanian Kabupaten Sleman.',
  },
  {
    id: 6,
    day: '15',
    month: 'MARET',
    monthKey: '2024-03',
    category: 'musyawarah',
    location: 'Ruang Rapat Kalurahan',
    title: 'Rapat Koordinasi RT/RW Se-Kalurahan',
    description:
      'Koordinasi rutin seluruh ketua RT dan RW se-Kalurahan Bimomartani membahas pendataan warga, keamanan lingkungan, dan persiapan agenda desa mendatang.',
  },
  {
    id: 7,
    day: '02',
    month: 'FEBRUARI',
    monthKey: '2024-02',
    category: 'pembangunan',
    location: 'Dusun Jetis',
    title: 'Pembangunan Talud Jalan Dusun Jetis',
    description:
      'Proyek pembangunan talud penahan jalan di Dusun Jetis menggunakan dana desa, bertujuan mencegah longsor dan kerusakan jalan saat musim hujan.',
  },
  {
    id: 8,
    day: '10',
    month: 'JANUARI',
    monthKey: '2024-01',
    category: 'budaya',
    location: 'Pendopo Desa',
    title: 'Pentas Wayang Kulit Semalam Suntuk',
    description:
      'Pagelaran wayang kulit semalam suntuk dalam rangka bersih desa, menghadirkan dalang lokal dan diikuti oleh seluruh warga dari 12 padukuhan.',
  },
]

const activeCategory = ref('all')
const activeTime = ref('all')
const pageSize = 4
const visibleCount = ref(pageSize)

const filteredEvents = computed(() =>
  events.filter((e) => {
    const matchesCategory = activeCategory.value === 'all' || e.category === activeCategory.value
    const matchesTime = activeTime.value === 'all' || e.monthKey === activeTime.value
    return matchesCategory && matchesTime
  })
)

const visibleEvents = computed(() => filteredEvents.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredEvents.value.length)

// Reset pagination whenever a filter changes so the grid doesn't stay
// scrolled past what's actually available for the new filter.
watch([activeCategory, activeTime], () => {
  visibleCount.value = pageSize
})

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + pageSize, filteredEvents.value.length)
}

function categoryLabel(slug) {
  return categories.find((c) => c.slug === slug)?.label ?? slug
}
</script>

<template>
  <div class="py-8">
    <!-- ===== HEADER ===== -->
    <div class="fade-in-up">
      <h1 class="text-2xl md:text-3xl font-bold text-heading">Gallery Desa</h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Desa. Tetap
        terhubung dan berpartisipasi aktif dalam pembangunan desa kita.
      </p>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <!-- ===== SIDEBAR: FILTERS ===== -->
      <aside class="fade-in-up space-y-6" style="animation-delay: 60ms">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Kategori
          </p>
          <div class="space-y-1">
            <button
              v-for="c in categories"
              :key="c.slug"
              @click="activeCategory = c.slug"
              class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
              :class="
                activeCategory === c.slug
                  ? 'bg-primary-900 text-white'
                  : 'text-default hover:bg-surface-hover'
              "
            >
              <span>{{ c.label }}</span>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="
                  activeCategory === c.slug
                    ? 'bg-white/15 text-white'
                    : 'bg-surface-hover text-muted'
                "
              >
                {{ c.count }}
              </span>
            </button>
          </div>
        </div>

        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Waktu
          </p>
          <Select
            v-model="activeTime"
            :options="timeOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
      </aside>

      <!-- ===== CARD GRID ===== -->
      <div>
        <p v-if="filteredEvents.length === 0" class="fade-in-up text-sm text-muted">
          Belum ada kegiatan untuk kategori/waktu yang dipilih.
        </p>

        <TransitionGroup
          v-else
          tag="div"
          name="card"
          appear
          class="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <article
            v-for="(event, i) in visibleEvents"
            :key="event.id"
            class="card-item group overflow-hidden rounded-2xl border border-border-default bg-surface transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-900/5"
            :style="{ transitionDelay: `${(i % pageSize) * 60}ms` }"
          >
            <!-- image + date badge -->
            <div class="relative">
              <div
                class="flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface-hover to-border-default transition-transform duration-500 group-hover:scale-105"
              >
                <i class="pi pi-image text-3xl text-muted/50" />
              </div>
              <div
                class="absolute left-4 -bottom-4 rounded-xl bg-surface px-3 py-2 text-center shadow-md"
              >
                <p class="text-lg font-extrabold leading-none text-heading">{{ event.day }}</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {{ event.month }}
                </p>
              </div>
            </div>

            <!-- content -->
            <div class="p-5 pt-7">
              <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700">
                <i class="pi pi-map-marker text-[11px]" />
                <span>{{ event.location }}</span>
              </div>
              <h3 class="mt-2 text-lg font-bold leading-snug text-heading">
                {{ event.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                {{ event.description }}
              </p>
              <span
                class="mt-3 inline-block rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700"
              >
                {{ categoryLabel(event.category) }}
              </span>
            </div>
          </article>
        </TransitionGroup>

        <!-- ===== LOAD MORE ===== -->
        <div v-if="hasMore" class="mt-8 flex justify-center">
          <Button
            label="Muat Lebih Banyak"
            icon="pi pi-chevron-down"
            icon-pos="right"
            outlined
            @click="loadMore"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---- header / sidebar entrance ---- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fadeInUp 0.5s ease both;
}

/* ---- card grid transitions (new cards, filter changes) ---- */
.card-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
.card-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.card-leave-active {
  transition: opacity 0.25s ease;
  position: absolute;
}
.card-leave-to {
  opacity: 0;
}
.card-move {
  transition: transform 0.4s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .card-enter-active,
  .card-leave-active,
  .card-move {
    animation: none !important;
    transition: none !important;
  }
}
</style>