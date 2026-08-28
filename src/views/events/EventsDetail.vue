<script setup>

import { computed } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import Select from "primevue/select";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { agendaMonths } from "@/services/events.js";

const props = defineProps({
  month: { type: String, required: true }, // route param, mis. "2026-08"
});

const router = useRouter();

const monthOptions = computed(() =>
  agendaMonths.map((m) => ({ label: `${m.monthLabel} ${m.year}`, value: m.key }))
);

const currentMonthIndex = computed(() => agendaMonths.findIndex((m) => m.key === props.month));

const selectedMonth = computed(
  () => agendaMonths[currentMonthIndex.value] ?? agendaMonths[agendaMonths.length - 1]
);

function goToMonth(key) {
  router.push({ name: "events-detail", params: { month: key } });
}

function goPrevMonth() {
  if (currentMonthIndex.value > 0) goToMonth(agendaMonths[currentMonthIndex.value - 1].key);
}
function goNextMonth() {
  if (currentMonthIndex.value < agendaMonths.length - 1)
    goToMonth(agendaMonths[currentMonthIndex.value + 1].key);
}
</script>

<template>
  <div class="py-6 lg:py-8">
    <!-- ============ BACK LINK ============ -->
    <RouterLink
      :to="{ name: 'events' }"
      class="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary-700 hover:text-primary-800 transition-colors"
    >
      <i class="pi pi-arrow-left text-[11px]" />
      Kembali ke Agenda Desa
    </RouterLink>

    <!-- ============ HEADER ============ -->
    <div class="max-w-2xl mt-4">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-heading">Agenda Desa</h1>
      <p class="text-[13.5px] sm:text-[15px] text-muted mt-2 leading-relaxed">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Desa untuk bulan terpilih.
      </p>
    </div>

    <!-- ============ NAVIGATOR BULAN ============ -->
    <div class="flex items-center gap-2 mt-6 mb-4">
      <Button
        icon="pi pi-chevron-left"
        text
        rounded
        aria-label="Bulan sebelumnya"
        :disabled="currentMonthIndex <= 0"
        @click="goPrevMonth"
      />
      <Select
        :modelValue="selectedMonth.key"
        :options="monthOptions"
        optionLabel="label"
        optionValue="value"
        class="w-48 sm:w-56"
        @update:modelValue="goToMonth"
      />
      <Button
        icon="pi pi-chevron-right"
        text
        rounded
        aria-label="Bulan berikutnya"
        :disabled="currentMonthIndex >= agendaMonths.length - 1"
        @click="goNextMonth"
      />
    </div>

    <!-- ============ TABEL BULANAN ============ -->
    <div class="rounded-2xl border border-border-default bg-surface overflow-hidden">
      <div class="px-5 py-3.5 bg-surface-hover border-b border-border-default">
        <h2 class="text-[15px] sm:text-base font-extrabold text-heading">
          {{ selectedMonth.monthLabel }} {{ selectedMonth.year }}
        </h2>
      </div>

      <div class="overflow-x-auto">
        <DataTable :value="selectedMonth.items" dataKey="no" class="min-w-[760px] sm:min-w-full text-sm">
          <Column header="No" style="width: 56px">
            <template #body="{ data }">
              <span class="text-muted">{{ data.no }}</span>
            </template>
          </Column>

          <Column header="Hari, Tanggal" style="min-width: 140px">
            <template #body="{ data }">
              <span class="font-bold text-heading">{{ data.day }}, {{ data.date }}</span>
            </template>
          </Column>

          <Column field="time" header="Jam" style="min-width: 80px">
            <template #body="{ data }">
              <span class="text-default">{{ data.time }}</span>
            </template>
          </Column>

          <Column header="Acara" style="min-width: 200px">
            <template #body="{ data }">
              <span class="font-bold text-heading">{{ data.event }}</span>
            </template>
          </Column>

          <Column header="Tempat" style="min-width: 150px">
            <template #body="{ data }">
              <span class="text-default">{{ data.place }}</span>
            </template>
          </Column>

          <Column header="Yang Menghadiri/Keterangan" style="min-width: 170px">
            <template #body="{ data }">
              <span class="text-default">{{ data.attendee }}</span>
            </template>
          </Column>
        </DataTable>
      </div>

      <div v-if="!selectedMonth.items.length" class="p-10 text-center text-[13px] text-muted">
        Belum ada agenda untuk bulan ini.
      </div>
    </div>
  </div>
</template>