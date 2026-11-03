<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { RouterLink } from "vue-router";
import Button from "primevue/button";
import Select from "primevue/select";
import { fetchAgendaMonths } from "@/services/events.js";

const agendaMonths = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    agendaMonths.value = await fetchAgendaMonths();
  } catch (err) {
    console.error("Gagal memuat agenda:", err);
  } finally {
    loading.value = false;
  }
});

/* ---------- Nomor bulan untuk lingkaran ---------- */
const monthNames = [
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember",
];

// Nomor bulan 01-12, dari item.key (format "2026-11") atau dari nama bulannya
function monthNumber(item) {
  const match = String(item.key ?? "").match(/^(\d{4})-(\d{1,2})/);
  const number = match
    ? Number(match[2])
    : monthNames.indexOf(String(item.monthLabel ?? "").toLowerCase()) + 1;

  return number > 0 ? String(number).padStart(2, "0") : "-";
}

/* ---------- Filter tahun ---------- */
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear); // default: tahun sekarang

// 10 tahun sebelumnya s/d 50 tahun yang akan datang
const yearOptions = Array.from({ length: 61 }, (_, i) => {
  const year = currentYear - 10 + i;
  return { label: String(year), value: year };
});

const timelineMonths = computed(() => [...agendaMonths.value].reverse());

const filteredMonths = computed(() =>
  timelineMonths.value.filter((m) => Number(m.year) === selectedYear.value),
);

const visibleCount = ref(3);
const visibleTimelineMonths = computed(() =>
  filteredMonths.value.slice(0, visibleCount.value),
);
const hasMoreTimeline = computed(
  () => visibleCount.value < filteredMonths.value.length,
);

// Ganti tahun -> kembali ke 3 item pertama
watch(selectedYear, () => {
  visibleCount.value = 3;
});

function loadMore() {
  visibleCount.value = Math.min(
    visibleCount.value + 2,
    filteredMonths.value.length,
  );
}

const emptyMessage = computed(
  () => `Belum ada agenda yang ditambahkan pada tahun ${selectedYear.value}.`,
);
</script>

<template>
  <div class="py-6 lg:py-8">
    <!-- ============ HEADER ============ -->
    <div class="max-w-2xl">
      <div class="inline-flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">Agenda</span>
      </div>
      <h1 class="mt-2 text-2xl sm:text-3xl font-extrabold text-heading">
        Agenda
        <span class="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
          Bimomartani
        </span>
      </h1>
      <p class="text-[13.5px] sm:text-[15px] text-muted mt-2 leading-relaxed">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Kalurahan. Tetap terhubung dan
        berpartisipasi aktif dalam pembangunan kalurahan kita.
      </p>
    </div>

    <!-- ============ LINIMASA ============ -->
    <section v-reveal class="mt-8">
      <!-- Filter tahun -->
      <div class="mb-6 flex items-center gap-3">
        <label for="filterTahun" class="text-[13px] font-semibold text-heading">
          Tahun
        </label>
        <Select
          id="filterTahun"
          v-model="selectedYear"
          :options="yearOptions"
          optionLabel="label"
          optionValue="value"
          filter
          scrollHeight="240px"
          class="w-32"
        />
      </div>

      <!-- Memuat -->
      <div v-if="loading" class="py-16 text-center text-muted">Memuat agenda...</div>

      <!-- Kosong -->
      <div
        v-else-if="filteredMonths.length === 0"
        class="rounded-2xl border border-dashed border-border-default bg-surface py-16 text-center"
      >
        <i class="pi pi-calendar text-3xl text-sky-300" />
        <p class="mt-3 text-[13.5px] text-muted">{{ emptyMessage }}</p>
      </div>

      <!-- Daftar -->
      <div v-else>
        <div v-for="(item, idx) in visibleTimelineMonths" :key="item.key" class="flex gap-3 sm:gap-4">
          <!-- rel: bulatan nomor bulan + garis linimasa -->
          <div class="flex flex-col items-center shrink-0">
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-white font-extrabold text-[13px] sm:text-[15px] flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/25"
            >
              {{ monthNumber(item) }}
            </div>
            <div
              v-if="idx !== visibleTimelineMonths.length - 1"
              class="w-px flex-1 bg-border-default mt-1"
            />
          </div>

          <!-- label bulan/tahun -->
          <div class="shrink-0 w-[64px] sm:w-[78px] pt-1">
            <div class="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted">
              {{ item.monthLabel }}
            </div>
            <div class="text-sm sm:text-base font-extrabold text-heading">{{ item.year }}</div>
          </div>

          <!-- kartu agenda -->
          <div class="flex-1 min-w-0 pb-6 sm:pb-8">
            <div
              class="relative overflow-hidden rounded-2xl border border-border-default bg-surface flex flex-col sm:flex-row hover:shadow-md hover:border-sky-300 transition-all duration-300"
            >
              <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 to-violet-500" />

              <div
                class="w-full sm:w-[190px] aspect-[16/9] sm:aspect-auto shrink-0 bg-gradient-to-br from-sky-50 via-violet-50 to-sky-100 flex items-center justify-center"
              >
                <i class="pi pi-image text-2xl text-sky-300" />
              </div>

              <div class="p-4 sm:p-5 min-w-0">
                <span
                  class="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-sky-700"
                >
                  <i class="pi pi-map-marker text-[10px]" />
                  {{ item.location }}
                </span>

                <h3 class="text-[15px] sm:text-base font-extrabold text-heading mt-1.5">
                  {{ item.title.toUpperCase() }}
                </h3>

                <p class="text-[12.5px] sm:text-[13px] text-muted mt-1.5 leading-relaxed line-clamp-2">
                  {{ item.excerpt }}
                </p>

                <RouterLink
                  :to="{ name: 'events-detail', params: { month: item.key } }"
                  class="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-sky-700 hover:text-violet-700 transition-colors"
                >
                  Lihat Detail
                  <i class="pi pi-arrow-right text-[10px]" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMoreTimeline" class="flex justify-center mt-2">
        <Button
          label="Muat Lebih Banyak"
          icon="pi pi-chevron-down"
          iconPos="right"
          outlined
          class="!rounded-xl !text-[13px] !font-bold !px-5 !border-sky-500 !text-sky-700 hover:!bg-sky-50"
          @click="loadMore"
        />
      </div>
    </section>
  </div>
</template>