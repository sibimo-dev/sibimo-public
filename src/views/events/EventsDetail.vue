<script setup>
import { ref, computed, onMounted } from "vue";
import Select from "primevue/select";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
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

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/* Opsi Tahun (sekarang ± 30 tahun + tahun yang ada di data) dan Bulan */
// tanpa opsi "Semua": halaman ini selalu menampilkan satu bulan tertentu
const yearOptions = computed(() => buildYearOptions(agendaMonths.value.map((m) => m.year)).slice(1));
const monthOptions = MONTH_NAMES.map((label, i) => ({ label, value: String(i + 1).padStart(2, "0") }));

const keyMatch = computed(() => /^(\d{4})-(\d{2})$/.exec(props.month));
const selectedYear = computed(() => (keyMatch.value ? Number(keyMatch.value[1]) : null));
const selectedMonthNumber = computed(() => (keyMatch.value ? keyMatch.value[2] : null));

const currentMonthIndex = computed(() => agendaMonths.value.findIndex((m) => m.key === props.month));

const selectedMonth = computed(() => {
  if (!agendaMonths.value.length) return null;
  const found = agendaMonths.value[currentMonthIndex.value];
  if (found) return found;
  // Bulan yang dipilih belum punya agenda → tampilkan bulan kosong (bukan loncat ke bulan lain)
  if (keyMatch.value) {
    return {
      key: props.month,
      monthLabel: MONTH_NAMES[Number(keyMatch.value[2]) - 1] ?? "",
      year: Number(keyMatch.value[1]),
      items: [],
    };
  }
  return agendaMonths.value[agendaMonths.value.length - 1];
});

function goToMonth(key) {
  router.push({ name: "events-detail", params: { month: key } });
}

function goToYear(year) {
  goToMonth(`${year}-${selectedMonthNumber.value ?? "01"}`);
}

function goToMonthNumber(monthNumber) {
  goToMonth(`${selectedYear.value ?? new Date().getFullYear()}-${monthNumber}`);
}

// Bulan sebelumnya / berikutnya yang punya agenda
const prevKey = computed(() => {
  const keys = agendaMonths.value.map((m) => m.key).sort();
  return [...keys].reverse().find((k) => k < props.month) ?? null;
});
const nextKey = computed(() => {
  const keys = agendaMonths.value.map((m) => m.key).sort();
  return keys.find((k) => k > props.month) ?? null;
});

function goPrevMonth() {
  if (prevKey.value) goToMonth(prevKey.value);
}
function goNextMonth() {
  if (nextKey.value) goToMonth(nextKey.value);
}

/* ---------- Helper dropdown filter (Tahun, Status, Bulan) ---------- */
// Pilihan tahun: tahun sekarang +/- 30 tahun, digabung dengan tahun yang ada di data.
function buildYearOptions(dataYears = [], span = 30, allLabel = "Semua") {
  const now = new Date().getFullYear();
  const years = new Set();
  for (let y = now - span; y <= now + span; y++) years.add(y);
  for (const raw of dataYears) {
    const y = Number(raw);
    if (Number.isFinite(y) && y > 0) years.add(y);
  }
  return [
    { label: allLabel, value: "all" },
    ...[...years].sort((a, b) => b - a).map((y) => ({ label: String(y), value: y })),
  ];
}

const optionLabelOf = (options, value) => options.find((o) => o.value === value)?.label ?? "";
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
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-sky-500" />
        <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-500">Agenda</span>
      </div>
      <h1 class="mt-2 text-2xl font-extrabold text-heading sm:text-3xl">
        Agenda
        <span class="bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
          Bimomartani
        </span>
      </h1>
      <p class="mt-1 text-[13.5px] text-muted sm:text-[14.5px]">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Kalurahan untuk bulan terpilih.
      </p>
    </div>

    <div v-if="loading || !selectedMonth" class="py-16 text-center text-muted">Memuat agenda...</div>

    <template v-else>
      <!-- ============ NAVIGATOR BULAN ============ -->
      <div class="flex flex-wrap items-center gap-2 mt-6 mb-4">
        <Button
          icon="pi pi-chevron-left"
          text
          rounded
          aria-label="Bulan sebelumnya"
          :disabled="!prevKey"
          class="!text-sky-700 hover:!bg-sky-50"
          @click="goPrevMonth"
        />
        <Select
          :modelValue="selectedYear ?? 'all'"
          :options="yearOptions"
          optionLabel="label"
          optionValue="value"
          scrollHeight="280px"
          @update:modelValue="goToYear"
          class="w-full !rounded-xl !border-border-default !bg-surface !shadow-none sm:w-auto sm:min-w-[11.5rem]"
          :pt="{ label: { class: '!py-2.5' } }"
        >
          <template #value="{ value }">
            <span class="flex items-center gap-2 text-[13.5px] font-semibold text-heading">
              <i class="pi pi-calendar text-[12px] text-primary-500" />
              <span class="font-bold text-muted">Tahun:</span>
              {{ optionLabelOf(yearOptions, value) }}
            </span>
          </template>
        </Select>
        <Select
          :modelValue="selectedMonthNumber ?? 'all'"
          :options="monthOptions"
          optionLabel="label"
          optionValue="value"
          scrollHeight="280px"
          @update:modelValue="goToMonthNumber"
          class="w-full !rounded-xl !border-border-default !bg-surface !shadow-none sm:w-auto sm:min-w-[11.5rem]"
          :pt="{ label: { class: '!py-2.5' } }"
        >
          <template #value="{ value }">
            <span class="flex items-center gap-2 text-[13.5px] font-semibold text-heading">
              <span class="font-bold text-muted">Bulan:</span>
              {{ optionLabelOf(monthOptions, value) }}
            </span>
          </template>
        </Select>
        <Button
          icon="pi pi-chevron-right"
          text
          rounded
          aria-label="Bulan berikutnya"
          :disabled="!nextKey"
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