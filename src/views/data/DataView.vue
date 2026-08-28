<script setup>

import { ref, computed } from "vue";
import Message from "primevue/message";
import Select from "primevue/select";
import SelectButton from "primevue/selectbutton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Button from "primevue/button";
import Chart from "primevue/chart";


const GRAND_TOTAL = 3808 + 3833; // 7.641
const GENDER_RATIO_MALE = 3808 / GRAND_TOTAL;


function splitByWeights(weights, total) {
  const sumW = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sumW) * total);
  const floors = raw.map(Math.floor);
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floors];
  for (let k = 0; k < remainder; k++) result[order[k].i]++;
  return result;
}

const categories = [
  {
    key: "age",
    label: "Kelompok Umur",
    icon: "pi-calendar",
    labels: [
      "0–4", "5–9", "10–14", "15–19", "20–24", "25–29", "30–34", "35–39",
      "40–44", "45–49", "50–54", "55–59", "60–64", "65–69", "70–74", "75+",
    ],
    weights: [7.8, 7.5, 7.0, 6.8, 7.4, 8.2, 8.6, 8.4, 7.9, 7.2, 6.5, 5.6, 4.6, 3.2, 2.2, 3.1],
  },
  {
    key: "education",
    label: "Pendidikan Dalam KK",
    icon: "pi-graduation-cap",
    labels: [
      "Tidak/Belum Sekolah", "Belum Tamat SD/Sederajat", "Tamat SD/Sederajat",
      "SLTP/Sederajat", "SLTA/Sederajat", "Diploma I/II", "Akademi/Diploma III",
      "Diploma IV/S1", "S2", "S3",
    ],
    weights: [11, 9, 17, 19, 29, 2.5, 3.5, 11.5, 2, 0.5],
  },
  {
    key: "occupation",
    label: "Pekerjaan",
    icon: "pi-briefcase",
    labels: [
      "Belum/Tidak Bekerja", "Mengurus Rumah Tangga", "Pelajar/Mahasiswa",
      "Karyawan Swasta", "Buruh Harian Lepas", "Wiraswasta", "Pedagang",
      "Petani/Perkebunan", "Pensiunan", "PNS", "Karyawan Honorer", "POLRI",
      "TNI", "Lainnya",
    ],
    weights: [17, 17, 21, 16, 10, 4.3, 1.8, 1.3, 2.1, 2.1, 0.5, 0.4, 0.4, 5.1],
  },
  {
    key: "religion",
    label: "Agama",
    icon: "pi-book",
    labels: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"],
    weights: [92, 3.5, 3, 0.8, 0.4, 0.2, 0.1],
  },
  {
    key: "gender",
    label: "Jenis Kelamin",
    icon: "pi-user",
    labels: ["Laki-laki", "Perempuan"],
    // Kategori ini yang jadi sumber acuan total & rasio L/P di atas.
    fixed: [3808, 3833],
  },
  {
    key: "blood-type",
    label: "Golongan Darah",
    icon: "pi-heart",
    labels: ["A", "B", "AB", "O", "Tidak Tahu"],
    weights: [24, 28, 8, 34, 6],
  },
  {
    key: "region",
    label: "Wilayah Administratif",
    icon: "pi-map",
    labels: ["Dusun I", "Dusun II", "Dusun III", "Dusun IV", "Dusun V", "Dusun VI", "Dusun VII", "Dusun VIII"],
    weights: [14, 11, 13, 10, 12, 9, 15, 16],
  },
];

const activeCategory = ref("gender");
const activeCategoryData = computed(
  () => categories.find((c) => c.key === activeCategory.value) ?? categories[0],
);

const chartTypeOptions = [
  { label: "Bar Graph", value: "bar", icon: "pi pi-chart-bar" },
  { label: "Pie Graph", value: "pie", icon: "pi pi-chart-pie" },
];
const chartType = ref("pie");

const formatNumber = (n) => n.toLocaleString("id-ID");
const formatPct = (n) => ((n / GRAND_TOTAL) * 100).toFixed(2).replace(".", ",");

// Baris tabel + chart untuk kategori yang sedang aktif.
const activeRows = computed(() => {
  const cat = activeCategoryData.value;
  const totals = cat.fixed ?? splitByWeights(cat.weights, GRAND_TOTAL);

  return cat.labels.map((label, i) => {
    const total = totals[i];

    const male = cat.key === "gender" ? (i === 0 ? total : 0) : Math.round(total * GENDER_RATIO_MALE);
    const female = cat.key === "gender" ? (i === 1 ? total : 0) : total - male;

    return {
      no: i + 1,
      group: label,
      total,
      male,
      female,
      totalN: formatNumber(total),
      totalPct: `${formatPct(total)}%`,
      maleN: formatNumber(male),
      malePct: `${formatPct(male)}%`,
      femaleN: formatNumber(female),
      femalePct: `${formatPct(female)}%`,
    };
  });
});

const footerTotals = computed(() => {
  const rows = activeRows.value;
  const sum = (key) => rows.reduce((a, r) => a + r[key], 0);
  return {
    total: sum("total"),
    male: sum("male"),
    female: sum("female"),
  };
});


const kkCount = 2412; // dummy — rata-rata ~3,17 jiwa/KK
const summaryCards = [
  { label: "Total Penduduk", icon: "pi-users", value: formatNumber(GRAND_TOTAL) },
  { label: "Kepala Keluarga", icon: "pi-home", value: formatNumber(kkCount) },
  { label: "Laki-laki", icon: "pi-user", value: formatNumber(3808) },
  { label: "Perempuan", icon: "pi-user", value: formatNumber(3833) },
];


const PALETTE = [
  "#ff8fa3", 
  "#ffd97a", 
  "#6fd6c4", 
  "#5fb8f0",
  "#b8a6ea", 
  "#ff9f6b", 
  "#a3e19b", 
  "#f2a6c9", 
  "#8ec7f0",
  "#e8c96b", 
  "#7fd1c9", 
  "#c78ee8", 
  "#ffb199", 
  "#9ad9f5",
  "#d4a5e8",
  "#f5c26b",
];

const chartData = computed(() => {
  const rows = activeRows.value;
  const labels = rows.map((r) => r.group);
  const data = rows.map((r) => r.total);
  const colors = labels.map((_, i) => PALETTE[i % PALETTE.length]);

  if (chartType.value === "pie") {
    return { labels, datasets: [{ data, backgroundColor: colors, borderColor: "#fff", borderWidth: 2 }] };
  }
  return {
    labels,
    datasets: [{ label: "Jumlah", data, backgroundColor: colors, borderRadius: 6, maxBarThickness: 28 }],
  };
});

const chartOptions = computed(() => {
  const isPie = chartType.value === "pie";
  const tooltipLabel = (ctx) => {
    const value = isPie ? ctx.parsed : ctx.parsed.x;
    const pct = ((value / GRAND_TOTAL) * 100).toFixed(1).replace(".", ",");
    return `${ctx.label}: ${value.toLocaleString("id-ID")} jiwa (${pct}%)`;
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: isPie ? "x" : "y",
    plugins: {
      legend: {
        display: isPie,
        position: "bottom",
        labels: { boxWidth: 11, font: { size: 11 }, usePointStyle: true, padding: 12 },
      },
      tooltip: { callbacks: { label: tooltipLabel } },
    },
    scales: isPie
      ? undefined
      : {
          x: { beginAtZero: true, ticks: { font: { size: 11 } } },
          y: { ticks: { font: { size: 11 } } },
        },
  };
});

const chartHeight = computed(() => {
  if (chartType.value === "pie") return 380;
  return Math.max(260, activeRows.value.length * 34);
});
</script>

<template>
  <div class="py-6 lg:py-8 flex flex-col gap-6 lg:gap-8">
    <!-- ============ HEADER ============ -->
    <div>
      <span class="text-[11px] font-bold uppercase tracking-wider text-secondary-600">
        Data & Statistik
      </span>
      <h1 class="text-xl sm:text-2xl lg:text-[28px] font-extrabold text-heading mt-1">
        Statistik Kependudukan
      </h1>
      <p class="text-[13px] sm:text-sm text-muted mt-1.5 max-w-[640px] leading-relaxed">
        Data agregat kependudukan Kalurahan Bimomartani berdasarkan kelompok umur, pendidikan,
        pekerjaan, agama, jenis kelamin, golongan darah, dan wilayah administratif.
      </p>
    </div>

    

    <!-- ============ KATEGORI (mobile: dropdown) ============ -->
    <Select
      v-model="activeCategory"
      :options="categories"
      optionLabel="label"
      optionValue="key"
      class="lg:hidden w-full"
    >
      <template #value="{ value }">
        <span class="flex items-center gap-2 text-sm font-semibold">
          <i :class="categories.find((c) => c.key === value)?.icon" class="pi text-primary-700" />
          {{ categories.find((c) => c.key === value)?.label }}
        </span>
      </template>
      <template #option="{ option }">
        <span class="flex items-center gap-2 text-sm">
          <i :class="option.icon" class="pi text-primary-700" />
          {{ option.label }}
        </span>
      </template>
    </Select>

    <div class="grid lg:grid-cols-[250px_minmax(0,1fr)] gap-6 lg:gap-8">
      <!-- ============ KATEGORI (desktop: sidebar) ============ -->
      <aside class="hidden lg:block">
        <nav
          class="lg:sticky lg:top-[calc(var(--navbar-h)+16px)] rounded-2xl border border-border-default bg-surface p-2 flex flex-col gap-0.5"
        >
          <span class="px-3 pt-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
            Statistik Penduduk
          </span>
          <Button
            v-for="cat in categories"
            :key="cat.key"
            text
            class="!justify-start !gap-2.5 !rounded-xl !py-2.5 !px-3 !text-[13.5px] !font-semibold"
            :class="
              activeCategory === cat.key
                ? '!bg-primary-50 !text-primary-800'
                : '!text-default hover:!bg-surface-hover'
            "
            @click="activeCategory = cat.key"
          >
            <i :class="cat.icon" class="pi text-[15px]" />
            {{ cat.label }}
          </Button>
        </nav>
      </aside>

      <!-- ============ KONTEN ============ -->
      <div class="min-w-0 flex flex-col gap-6">
        <!-- Ringkasan -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
          <div
            v-for="card in summaryCards"
            :key="card.label"
            class="rounded-2xl border border-border-default bg-surface p-4"
          >
            <div
              class="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mb-2.5"
            >
              <i :class="card.icon" class="pi text-[15px]" />
            </div>
            <p class="text-[11.5px] text-muted font-medium">{{ card.label }}</p>
            <p class="text-xl font-extrabold text-heading mt-0.5">{{ card.value }}</p>
          </div>
        </section>

        <!-- Grafik -->
        <section class="rounded-2xl border border-border-default bg-surface p-4 sm:p-5">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 class="text-[15px] sm:text-base font-extrabold text-heading">
              Grafik {{ activeCategoryData.label }}
            </h2>
            <SelectButton
              v-model="chartType"
              :options="chartTypeOptions"
              optionLabel="label"
              optionValue="value"
              :allowEmpty="false"
            >
              <template #option="{ option }">
                <span class="flex items-center gap-1.5 text-[12.5px] font-semibold">
                  <i :class="option.icon" />
                  <span class="hidden sm:inline">{{ option.label }}</span>
                </span>
              </template>
            </SelectButton>
          </div>

          <div :style="{ height: chartHeight + 'px' }">
            <Chart :type="chartType" :data="chartData" :options="chartOptions" class="w-full h-full" />
          </div>

          <p class="text-[11px] text-muted mt-4 text-center">
            Arahkan kursor ke grafik untuk melihat jumlah & persentase. Data masih dummy sementara.
          </p>
        </section>

        <!-- Tabel -->
        <section class="rounded-2xl border border-border-default bg-surface p-4 sm:p-5">
          <h2 class="text-[15px] sm:text-base font-extrabold text-heading mb-4">
            Tabel {{ activeCategoryData.label }}
          </h2>

          <DataTable
            :value="activeRows"
            class="app-datatable"
            size="small"
            responsiveLayout="scroll"
            scrollable
            scrollHeight="420px"
          >
            <ColumnGroup type="header">
              <Row>
                <Column header="No" :rowspan="2" style="width: 52px" />
                <Column header="Kelompok" :rowspan="2" />
                <Column header="Jumlah" :colspan="2" class="!text-center" />
                <Column header="Laki-laki" :colspan="2" class="!text-center" />
                <Column header="Perempuan" :colspan="2" class="!text-center" />
              </Row>
              <Row>
                <Column header="n" class="!text-center" style="width: 90px" />
                <Column header="%" class="!text-center" style="width: 80px" />
                <Column header="n" class="!text-center" style="width: 90px" />
                <Column header="%" class="!text-center" style="width: 80px" />
                <Column header="n" class="!text-center" style="width: 90px" />
                <Column header="%" class="!text-center" style="width: 80px" />
              </Row>
            </ColumnGroup>

            <Column field="no" />
            <Column field="group" />
            <Column field="totalN" class="!text-center" />
            <Column field="totalPct" class="!text-center" />
            <Column field="maleN" class="!text-center" />
            <Column field="malePct" class="!text-center" />
            <Column field="femaleN" class="!text-center" />
            <Column field="femalePct" class="!text-center" />

            <ColumnGroup type="footer">
              <Row>
                <Column footer="" :colspan="2" footerStyle="font-weight: 800" />
                <Column :footer="formatNumber(footerTotals.total)" class="!text-center !font-extrabold" />
                <Column footer="100%" class="!text-center !font-extrabold" />
                <Column :footer="formatNumber(footerTotals.male)" class="!text-center !font-extrabold" />
                <Column
                  :footer="`${formatPct(footerTotals.male)}%`"
                  class="!text-center !font-extrabold"
                />
                <Column :footer="formatNumber(footerTotals.female)" class="!text-center !font-extrabold" />
                <Column
                  :footer="`${formatPct(footerTotals.female)}%`"
                  class="!text-center !font-extrabold"
                />
              </Row>
            </ColumnGroup>
          </DataTable>
        </section>
      </div>
    </div>
  </div>
</template>