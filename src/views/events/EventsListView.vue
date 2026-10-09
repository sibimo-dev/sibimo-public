<script setup>

import { computed, ref, onMounted} from "vue";
import { RouterLink } from "vue-router";
import Button from "primevue/button";
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

const timelineMonths = computed(() => [...agendaMonths.value].reverse());
const visibleCount = ref(3);
const visibleTimelineMonths = computed(() => timelineMonths.value.slice(0, visibleCount.value));
const hasMoreTimeline = computed(() => visibleCount.value < timelineMonths.value.length);

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + 2, timelineMonths.value.length);
}
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
      <div v-if="loading" class="py-16 text-center text-muted">Memuat agenda...</div>
      <div>
        <div v-for="(item, idx) in visibleTimelineMonths" :key="item.key" class="flex gap-3 sm:gap-4">
          <!-- rel: bulatan tanggal + garis linimasa -->
          <div class="flex flex-col items-center shrink-0">
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 text-white font-extrabold text-[13px] sm:text-[15px] flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/25"
            >
              {{ item.dayHighlight }}
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