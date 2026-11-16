<script setup>
import { ref, computed, onMounted } from "vue";
import Select from "primevue/select";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import Dialog from "primevue/dialog";
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

/* ---------- Popup detail agenda ---------- */
const detailOpen = ref(false);
const detailItem = ref(null);

function openDetail(item) {
  detailItem.value = item;
  detailOpen.value = true;
}

function onRowClick(event) {
  openDetail(event.data);
}

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
      <!-- ============ FILTER TAHUN & BULAN ============ -->
      <div class="mt-6 mb-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <Select
          :modelValue="selectedYear ?? 'all'"
          :options="yearOptions"
          optionLabel="label"
          optionValue="value"
          scrollHeight="280px"
          aria-label="Pilih tahun"
          @update:modelValue="goToYear"
          class="w-full !rounded-xl !border-border-default !bg-surface !shadow-none sm:w-auto sm:min-w-[11.5rem]"
          :pt="{ label: { class: '!py-2.5' } }"
        >
          <template #value="{ value }">
            <span class="flex items-center gap-2 text-[13.5px] font-semibold text-heading">
              <i class="pi pi-calendar hidden text-[12px] text-primary-500 sm:inline" />
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
          aria-label="Pilih bulan"
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

        <!-- Mobile: kartu agenda -->
        <ul class="divide-y divide-border-default sm:hidden">
          <li v-for="data in selectedMonth.items || []" :key="data.no">
            <button
              type="button"
              class="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors active:bg-sky-50"
              @click="openDetail(data)"
            >
              <div class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 text-white">
                <span class="text-[16px] font-extrabold leading-none">{{ data.date.split(" ")[0] }}</span>
                <span class="mt-0.5 text-[10px] font-bold uppercase leading-none">{{ data.date.split(" ")[1] }}</span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-1.5">
                  <span class="text-[14px] font-extrabold leading-snug text-heading">{{ data.event }}</span>
                  <i
                    v-if="data.attachmentUrl"
                    :class="data.attachmentIsImage ? 'pi pi-image' : 'pi pi-paperclip'"
                    class="mt-1 shrink-0 text-[12px] text-sky-500"
                    aria-label="Ada lampiran"
                  />
                </div>
                <p class="mt-1 text-[12.5px] text-muted">
                  {{ data.day }}<template v-if="data.time"> · {{ data.time }}</template>
                </p>
                <p class="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted">
                  <i class="pi pi-map-marker text-[10px]" />
                  <span class="truncate">{{ data.place }}</span>
                </p>
              </div>

              <i class="pi pi-chevron-right mt-4 shrink-0 text-[11px] text-muted" />
            </button>
          </li>
        </ul>

        <!-- Desktop: tabel -->
        <div class="hidden overflow-x-auto sm:block">
          <DataTable
            :value="selectedMonth.items || []"
            dataKey="no"
            class="min-w-full text-sm"
            rowHover
            :pt="{ bodyRow: { class: 'cursor-pointer' } }"
            @row-click="onRowClick"
          >
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
                <button
                  type="button"
                  class="inline-flex items-center gap-2 text-left font-bold text-heading hover:text-sky-700 transition-colors"
                  @click.stop="openDetail(data)"
                >
                  {{ data.event }}
                  <i
                    v-if="data.attachmentUrl"
                    :class="data.attachmentIsImage ? 'pi pi-image' : 'pi pi-paperclip'"
                    class="text-[12px] text-sky-500"
                    aria-label="Ada lampiran"
                  />
                </button>
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

      <!-- ============ POPUP DETAIL AGENDA ============ -->
      <Dialog
        v-model:visible="detailOpen"
        modal
        dismissableMask
        :showHeader="false"
        :style="{ width: '92vw', maxWidth: '560px' }"
        :pt="{ root: { class: '!rounded-2xl !overflow-hidden' }, content: { class: '!p-0' } }"
      >
        <div v-if="detailItem">
          <!-- Gambar di paling atas -->
          <div class="relative aspect-[16/9] w-full bg-gradient-to-br from-sky-50 via-violet-50 to-sky-100">
            <a
              v-if="detailItem.attachmentUrl && detailItem.attachmentIsImage"
              :href="detailItem.attachmentUrl"
              target="_blank"
              rel="noopener"
              class="block h-full w-full"
              aria-label="Buka gambar ukuran penuh"
            >
              <img
                :src="detailItem.attachmentUrl"
                :alt="detailItem.event"
                class="h-full w-full object-cover"
              />
            </a>
            <div v-else class="flex h-full w-full items-center justify-center">
              <i class="pi pi-calendar text-4xl text-sky-300" />
            </div>

            <button
              type="button"
              class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-heading shadow-sm hover:bg-white"
              aria-label="Tutup"
              @click="detailOpen = false"
            >
              <i class="pi pi-times text-[12px]" />
            </button>
          </div>

          <!-- Isi detail sesuai baris di tabel -->
          <div class="p-5 sm:p-6">
            <h3 class="text-lg font-extrabold text-heading sm:text-xl">{{ detailItem.event }}</h3>

            <dl class="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-[13.5px]">
              <dt class="flex items-center gap-2 font-semibold text-muted">
                <i class="pi pi-calendar text-[12px] text-sky-500" /> Tanggal
              </dt>
              <dd class="font-bold text-heading">{{ detailItem.day }}, {{ detailItem.date }}</dd>

              <dt class="flex items-center gap-2 font-semibold text-muted">
                <i class="pi pi-clock text-[12px] text-sky-500" /> Jam
              </dt>
              <dd class="text-default">{{ detailItem.time || "-" }}</dd>

              <dt class="flex items-center gap-2 font-semibold text-muted">
                <i class="pi pi-map-marker text-[12px] text-sky-500" /> Tempat
              </dt>
              <dd class="text-default">{{ detailItem.place }}</dd>

              <dt class="flex items-center gap-2 font-semibold text-muted">
                <i class="pi pi-users text-[12px] text-sky-500" /> Peserta
              </dt>
              <dd class="text-default">{{ detailItem.attendee }}</dd>
            </dl>

            <!-- Lampiran non-gambar (PDF / Word) -->
            <a
              v-if="detailItem.attachmentUrl && !detailItem.attachmentIsImage"
              :href="detailItem.attachmentUrl"
              target="_blank"
              rel="noopener"
              class="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5 text-[13px] font-bold text-sky-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
            >
              <i class="pi pi-download" />
              Unduh {{ detailItem.attachmentName || "lampiran" }}
            </a>

            <a
              v-else-if="detailItem.attachmentUrl"
              :href="detailItem.attachmentUrl"
              target="_blank"
              rel="noopener"
              class="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-sky-700 transition-colors hover:text-violet-700"
            >
              Buka gambar ukuran penuh
              <i class="pi pi-external-link text-[11px]" />
            </a>
          </div>
        </div>
      </Dialog>
    </template>
  </div>
</template>