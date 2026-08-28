<script setup>

import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import Button from "primevue/button";
import { agendaMonths } from "@/services/events.js";


const timelineMonths = computed(() => [...agendaMonths].reverse());

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
      <h1 class="text-2xl sm:text-3xl font-extrabold text-heading">Agenda Desa</h1>
      <p class="text-[13.5px] sm:text-[15px] text-muted mt-2 leading-relaxed">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Desa. Tetap terhubung dan
        berpartisipasi aktif dalam pembangunan desa kita.
      </p>
    </div>

    <!-- ============ LINIMASA ============ -->
    <section v-reveal class="mt-8">
      <div>
        <div v-for="(item, idx) in visibleTimelineMonths" :key="item.key" class="flex gap-3 sm:gap-4">
          <!-- rel: bulatan tanggal + garis linimasa -->
          <div class="flex flex-col items-center shrink-0">
            <div
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border-2 border-primary-700 text-primary-800 font-extrabold text-[13px] sm:text-[15px] flex items-center justify-center shrink-0"
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
              class="rounded-2xl border border-border-default bg-surface overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-primary-300 transition-all duration-300"
            >
              <div
                class="w-full sm:w-[190px] aspect-[16/9] sm:aspect-auto shrink-0 bg-primary-50 flex items-center justify-center"
              >
                <i class="pi pi-image text-2xl text-primary-200" />
              </div>

              <div class="p-4 sm:p-5 min-w-0">
                <span
                  class="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-primary-700"
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
                  class="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-primary-700 hover:text-primary-800 transition-colors"
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
          class="!rounded-xl !text-[13px] !font-bold !px-5"
          @click="loadMore"
        />
      </div>
    </section>
  </div>
</template>