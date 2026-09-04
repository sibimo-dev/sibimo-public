<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import Select from "primevue/select";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { fetchAgendaMonths, getAgendaMonthsSync } from "@/services/events.js";

const agendaMonths = ref(getAgendaMonthsSync());
const loading = ref(true);

onMounted(async () => {
  try {
    if (agendaMonths.value.length === 0) {
      agendaMonths.value = await fetchAgendaMonths();
    }
  } finally {
    loading.value = false;
  }
});

const props = defineProps({
  month: { type: String, required: true },
});

const router = useRouter();

const monthOptions = computed(() =>
  agendaMonths.value.map((m) => ({ label: `${m.monthLabel} ${m.year}`, value: m.key }))
);

const currentMonthIndex = computed(() => agendaMonths.value.findIndex((m) => m.key === props.month));

const selectedMonth = computed(() => {
  if (!agendaMonths.value.length) return null;
  return agendaMonths.value[currentMonthIndex.value] ?? agendaMonths.value[agendaMonths.value.length - 1];
});

function goToMonth(key) {
  router.push({ name: "events-detail", params: { month: key } });
}

function goPrevMonth() {
  if (currentMonthIndex.value > 0) goToMonth(agendaMonths.value[currentMonthIndex.value - 1].key);
}
function goNextMonth() {
  if (currentMonthIndex.value < agendaMonths.value.length - 1)
    goToMonth(agendaMonths.value[currentMonthIndex.value + 1].key);
}
</script>

<template>
  <div class="py-6 lg:py-8">
    <!-- ============ BACK LINK ============ -->
    <RouterLink
      :to="{ name: 'events' }"
      class="inline-flex items-center gap-1.5 text-[13px] font-bold text-sky-700 hover:text-violet-700 transition-colors"
    >
      <i class="pi pi-arrow-left text-[11px]" />
      Kembali ke Agenda Bimomartani
    </RouterLink>

    <!-- ============ HEADER ============ -->
    <div class="max-w-2xl mt-4">
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
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Kalurahan untuk bulan terpilih.
      </p>
    </div>

    <div v-if="loading || !selectedMonth" class="py-16 text-center text-muted">Memuat agenda...</div>

    <template v-else>
      <!-- ============ NAVIGATOR BULAN ============ -->
      <div class="flex items-center gap-2 mt-6 mb-4">
        <Button
          icon="pi pi-chevron-left"
          text
          rounded
          aria-label="Bulan sebelumnya"
          :disabled="currentMonthIndex <= 0"
          class="!text-sky-700 hover:!bg-sky-50"
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
          class="!text-sky-700 hover:!bg-sky-50"
          @click="goNextMonth"
        />
      </div>

      <!-- ============ TABEL BULANAN ============ -->
      <div class="relative overflow-hidden rounded-2xl border border-border-default bg-surface">
        <span class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 to-violet-500" />

        <div class="px-5 py-3.5 bg-gradient-to-r from-sky-50 to-violet-50 border-b border-border-default flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-sky-500" />
          <h2 class="text-[15px] sm:text-base font-extrabold text-heading">
            {{ selectedMonth.monthLabel }} {{ selectedMonth.year }}
          </h2>
        </div>

        <div class="overflow-x-auto">
          <DataTable :value="selectedMonth.items || []" dataKey="no" class="min-w-[760px] sm:min-w-full text-sm">
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

        <div v-if="!(selectedMonth.items && selectedMonth.items.length)" class="p-10 text-center text-[13px] text-muted">
          Belum ada agenda untuk bulan ini.
        </div>
      </div>
    </template>
  </div>
</template>