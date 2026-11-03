<script setup>

import { ref, computed, onMounted, reactive } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Chart from "primevue/chart";
import SelectButton from "primevue/selectbutton";
import {
  getCitizenStatistics,
  readCitizenStatisticsCache,
  writeCitizenStatisticsCache,
} from "../../services/citizen";

const grandTotal = ref(0);

const categories = reactive([
  {
    key: "age",
    label: "Kelompok Umur",
    icon: "pi-calendar",
    // Harus sama persis (termasuk tanda "–") dengan `group` yang dikirim backend.
    labels: ["0–2", "3–5", "6–12", "13–18", "19–29", "30–40", "41–50", "51–60", "61–70", "71+"],
    rows: [],
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
    rows: [],
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
    rows: [],
  },
  {
    key: "religion",
    label: "Agama",
    icon: "pi-book",
    labels: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"],
    rows: [],
  },
  {
    key: "blood_type",
    label: "Golongan Darah",
    icon: "pi-heart-fill",
    labels: ["A", "B", "AB", "O", "Tidak diisi"],
    rows: [],
  },
  {
    key: "gender",
    label: "Jenis Kelamin",
    icon: "pi-user",
    labels: ["Laki-laki", "Perempuan"],
    rows: [],
  },
  {
    key: "region",
    label: "Wilayah Administratif",
    icon: "pi-map",
    labels: ["Dusun I", "Dusun II", "Dusun III", "Dusun IV", "Dusun V", "Dusun VI", "Dusun VII", "Dusun VIII"],
    rows: [],
  },
]);

/* Per-kategori identitas warna — pola sama seperti categoryStyles di Gallery */
const categoryStyles = {
  age: {
    sidebarActive: "bg-sky-600 text-white shadow-sky-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-sky-600",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700",
    topBar: "bg-gradient-to-r from-sky-400 to-sky-600",
  },
  education: {
    sidebarActive: "bg-violet-600 text-white shadow-violet-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-violet-600",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-700",
    topBar: "bg-gradient-to-r from-violet-400 to-violet-600",
  },
  occupation: {
    sidebarActive: "bg-amber-600 text-white shadow-amber-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-amber-600",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
    topBar: "bg-gradient-to-r from-amber-400 to-amber-600",
  },
  religion: {
    sidebarActive: "bg-emerald-600 text-white shadow-emerald-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-emerald-600",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
    topBar: "bg-gradient-to-r from-emerald-400 to-emerald-600",
  },
  blood_type: {
    sidebarActive: "bg-red-600 text-white shadow-red-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-red-600",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700",
    topBar: "bg-gradient-to-r from-red-400 to-red-600",
  },
  gender: {
    sidebarActive: "bg-rose-600 text-white shadow-rose-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-rose-600",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700",
    topBar: "bg-gradient-to-r from-rose-400 to-rose-600",
  },
  region: {
    sidebarActive: "bg-indigo-600 text-white shadow-indigo-600/25",
    sidebarCount: "bg-white/15 text-white",
    iconInactive: "text-indigo-600",
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-700",
    topBar: "bg-gradient-to-r from-indigo-400 to-indigo-600",
  },
};
const defaultCategoryStyle = {
  sidebarActive: "bg-gradient-to-r from-primary-600 via-violet-600 to-sky-600 text-white shadow-primary-600/25",
  sidebarCount: "bg-white/15 text-white",
  iconInactive: "text-primary-700",
  dot: "bg-primary-500",
  badge: "bg-primary-50 text-primary-700",
  topBar: "bg-gradient-to-r from-primary-400 to-primary-600",
};
function styleFor(key) {
  return categoryStyles[key] || defaultCategoryStyle;
}

const ACTIVE_CATEGORY_KEY = "sibimo-public-data-active-category";
const categoryKeys = new Set(categories.map((category) => category.key));

function readActiveCategory() {
  try {
    const saved = sessionStorage.getItem(ACTIVE_CATEGORY_KEY);
    return saved && categoryKeys.has(saved) ? saved : "age";
  } catch {
    return "age";
  }
}

const activeCategory = ref(readActiveCategory());
function selectCategory(key) {
  activeCategory.value = key;
  try {
    sessionStorage.setItem(ACTIVE_CATEGORY_KEY, key);
  } catch {
    // The selected tab still works when session storage is unavailable.
  }
}

const activeCategoryData = computed(
  () => categories.find((c) => c.key === activeCategory.value) ?? categories[0],
);
const activeStyle = computed(() => styleFor(activeCategory.value));

const chartTypeOptions = [
  { label: "Bar Graph", value: "bar", icon: "pi pi-chart-bar" },
  { label: "Pie Graph", value: "pie", icon: "pi pi-chart-pie" },
];
const chartType = ref("pie");

const formatNumber = (n) => Number(n || 0).toLocaleString("id-ID");
const formatPct = (n) => (
  grandTotal.value ? ((Number(n || 0) / grandTotal.value) * 100).toFixed(2).replace(".", ",") : "0,00"
);

// Baris tabel + chart untuk kategori yang sedang aktif.
const activeRows = computed(() => {
  const cat = activeCategoryData.value;
  const sourceRows = Array.isArray(cat.rows) ? cat.rows : [];

  return cat.labels.map((label, i) => {
    const source = sourceRows[i] ?? sourceRows.find((row) => row.group === label) ?? {};
    const total = Number(source.total ?? source.population ?? 0);
    const male = Number(source.male ?? source.male_count ?? 0);
    const female = Number(source.female ?? source.female_count ?? Math.max(0, total - male));

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

const summaryCards = reactive([
  { label: "Total Penduduk", icon: "pi-users", value: "0", color: "indigo" },
  { label: "Kepala Keluarga", icon: "pi-home", value: "0", color: "violet" },
  { label: "Laki-laki", icon: "pi-user", value: "0", color: "sky" },
  { label: "Perempuan", icon: "pi-user", value: "0", color: "rose" },
]);
const summaryCardIconClass = {
  indigo: "bg-indigo-50 text-indigo-700",
  violet: "bg-violet-50 text-violet-700",
  sky: "bg-sky-50 text-sky-700",
  rose: "bg-rose-50 text-rose-700",
};

/* ---------------- Gaya kolom tabel ----------------
   - Semua judul, isi, dan footer kolom angka diratakan TENGAH. Dipaksa lewat
     style inline (bukan hanya class) supaya tidak bisa ditimpa CSS bawaan tabel,
     dan lewat pt.columnHeaderContent karena judul kolom PrimeVue dibungkus flex.
   - Tiap kelompok kolom punya warna sendiri: No/Kelompok = abu, Jumlah = violet,
     Laki-laki = sky, Perempuan = rose. Judul diberi warna lebih pekat, isi
     diberi tint tipis dengan warna yang sama. */
const CENTER_STYLE = "text-align: center";
const centerHeaderPt = { columnHeaderContent: { style: "justify-content: center" } };

const colTone = {
  label: {
    head: "!bg-slate-100 !text-slate-700",
    body: "",
    foot: "!bg-slate-100 !text-slate-700",
  },
  total: {
    head: "!bg-violet-100 !text-violet-800",
    body: "!bg-violet-50/60",
    foot: "!bg-violet-100 !text-violet-800",
  },
  male: {
    head: "!bg-sky-100 !text-sky-800",
    body: "!bg-sky-50/60",
    foot: "!bg-sky-100 !text-sky-800",
  },
  female: {
    head: "!bg-rose-100 !text-rose-800",
    body: "!bg-rose-50/60",
    foot: "!bg-rose-100 !text-rose-800",
  },
};

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
  const hasData = data.some((value) => value > 0);

  if (!hasData) {
    return {
      labels: ["Belum ada data"],
      datasets: [{
        data: [1],
        backgroundColor: ["#d1d5db"],
        borderColor: "#fff",
        borderWidth: 2,
      }],
    };
  }

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
  const hasData = activeRows.value.some((row) => row.total > 0);
  const tooltipLabel = (ctx) => {
    if (!hasData) return "Belum ada data";
    const value = isPie ? ctx.parsed : ctx.parsed.x;
    const pct = grandTotal.value
      ? ((value / grandTotal.value) * 100).toFixed(1).replace(".", ",")
      : "0,0";
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

function applyCategoryRows(key, rows) {
  const category = categories.find((item) => item.key === key);
  if (!category || !Array.isArray(rows)) return;
  category.rows = rows.map((row) => ({
    group: row.group ?? row.name ?? "Tidak diketahui",
    total: Number(row.total ?? row.population ?? 0),
    male: Number(row.male ?? row.male_count ?? 0),
    female: Number(row.female ?? row.female_count ?? 0),
  }));
  if (category.rows.length) category.labels = category.rows.map((row) => row.group);
}

function applyCitizenStatistics(statistics) {
  const summary = statistics?.summary ?? {};
  grandTotal.value = Number(summary.total_population ?? 0);
  summaryCards[0].value = formatNumber(grandTotal.value);
  summaryCards[1].value = formatNumber(summary.kk_count ?? 0);
  summaryCards[2].value = formatNumber(summary.male_count ?? 0);
  summaryCards[3].value = formatNumber(summary.female_count ?? 0);

  const sourceCategories = statistics?.categories ?? {};
  applyCategoryRows("age", sourceCategories.age);
  applyCategoryRows("education", sourceCategories.education);
  applyCategoryRows("occupation", sourceCategories.occupation);
  applyCategoryRows("religion", sourceCategories.religion);
  applyCategoryRows("blood_type", sourceCategories.blood_type);
  applyCategoryRows("gender", sourceCategories.gender);
  applyCategoryRows("region", statistics?.regions);
}

onMounted(async () => {
  const cached = readCitizenStatisticsCache();
  if (cached) applyCitizenStatistics(cached);

  try {
    const statistics = await getCitizenStatistics();
    applyCitizenStatistics(statistics);
    writeCitizenStatisticsCache(statistics);
  } catch (error) {
    console.error("Gagal memuat statistik kependudukan", error);
  }
});
</script>

<template>
  <div class="py-6 lg:py-8 flex flex-col gap-6 lg:gap-8">
    <!-- ============ HEADER ============ -->
    <div>
      <div class="inline-flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">
          Data & Statistik
        </span>
      </div>
      <h1 class="mt-2 text-2xl md:text-3xl font-bold text-heading">
        Statistik
        <span class="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">
          Kependudukan
        </span>
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Data agregat kependudukan Kalurahan Bimomartani berdasarkan kelompok umur, pendidikan,
        pekerjaan, agama, golongan darah, jenis kelamin, dan wilayah administratif.
      </p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:gap-8">
      <!-- ============ KATEGORI (sidebar, sama di semua breakpoint) ============ -->
      <aside class="lg:sticky lg:top-[calc(var(--navbar-h)+16px)] lg:self-start space-y-1.5">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          Kategori
        </p>
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="selectCategory(cat.key)"
          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
          :class="
            activeCategory === cat.key
              ? [styleFor(cat.key).sidebarActive, 'shadow-md']
              : 'text-default hover:bg-surface-hover hover:translate-x-0.5'
          "
        >
          <span class="flex items-center gap-2">
            <i
              :class="[cat.icon, activeCategory === cat.key ? 'text-white' : styleFor(cat.key).iconInactive]"
              class="pi text-xs"
            />
            {{ cat.label }}
          </span>
          <span
            class="rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="
              activeCategory === cat.key
                ? styleFor(cat.key).sidebarCount
                : 'bg-surface-hover text-muted'
            "
          >
            {{ cat.labels.length }}
          </span>
        </button>
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
              class="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5"
              :class="summaryCardIconClass[card.color]"
            >
              <i :class="card.icon" class="pi text-[15px]" />
            </div>
            <p class="text-[11.5px] text-muted font-medium">{{ card.label }}</p>
            <p class="text-xl font-extrabold text-heading mt-0.5">{{ card.value }}</p>
          </div>
        </section>

        <!-- Grafik -->
        <section class="relative overflow-hidden rounded-2xl border border-border-default bg-surface p-4 sm:p-5">
          <span class="absolute inset-x-0 top-0 h-1" :class="activeStyle.topBar" />

          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 class="flex items-center gap-2 text-[15px] sm:text-base font-extrabold text-heading">
              <span class="w-2 h-2 rounded-full" :class="activeStyle.dot" />
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
            Arahkan kursor ke grafik untuk melihat jumlah & persentase. Data diperbarui dari data warga aktif.
          </p>
        </section>

        <!-- Tabel -->
        <section class="relative overflow-hidden rounded-2xl border border-border-default bg-surface p-4 sm:p-5">
          <span class="absolute inset-x-0 top-0 h-1" :class="activeStyle.topBar" />

          <div class="flex items-center gap-3 mb-4">
            <h2 class="flex items-center gap-2 text-[15px] sm:text-base font-extrabold text-heading">
              <span class="w-2 h-2 rounded-full" :class="activeStyle.dot" />
              Tabel {{ activeCategoryData.label }}
            </h2>
            <span
              class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="activeStyle.badge"
            >
              <i :class="activeCategoryData.icon" class="pi text-[10px]" />
              {{ activeRows.length }} kelompok
            </span>
          </div>

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
                <Column
                  header="No"
                  :rowspan="2"
                  style="width: 52px"
                  :headerClass="colTone.label.head"
                  :headerStyle="CENTER_STYLE"
                  :pt="centerHeaderPt"
                />
                <Column
                  header="Kelompok"
                  :rowspan="2"
                  :headerClass="colTone.label.head"
                />
                <Column
                  header="Jumlah"
                  :colspan="2"
                  :headerClass="colTone.total.head"
                  :headerStyle="CENTER_STYLE"
                  :pt="centerHeaderPt"
                />
                <Column
                  header="Laki-laki"
                  :colspan="2"
                  :headerClass="colTone.male.head"
                  :headerStyle="CENTER_STYLE"
                  :pt="centerHeaderPt"
                />
                <Column
                  header="Perempuan"
                  :colspan="2"
                  :headerClass="colTone.female.head"
                  :headerStyle="CENTER_STYLE"
                  :pt="centerHeaderPt"
                />
              </Row>
              <Row>
                <Column header="n" style="width: 90px" :headerClass="colTone.total.head" :headerStyle="CENTER_STYLE" :pt="centerHeaderPt" />
                <Column header="%" style="width: 80px" :headerClass="colTone.total.head" :headerStyle="CENTER_STYLE" :pt="centerHeaderPt" />
                <Column header="n" style="width: 90px" :headerClass="colTone.male.head" :headerStyle="CENTER_STYLE" :pt="centerHeaderPt" />
                <Column header="%" style="width: 80px" :headerClass="colTone.male.head" :headerStyle="CENTER_STYLE" :pt="centerHeaderPt" />
                <Column header="n" style="width: 90px" :headerClass="colTone.female.head" :headerStyle="CENTER_STYLE" :pt="centerHeaderPt" />
                <Column header="%" style="width: 80px" :headerClass="colTone.female.head" :headerStyle="CENTER_STYLE" :pt="centerHeaderPt" />
              </Row>
            </ColumnGroup>

            <Column field="no" :bodyStyle="CENTER_STYLE" />
            <Column field="group" />
            <Column field="totalN" :bodyClass="colTone.total.body" :bodyStyle="CENTER_STYLE" />
            <Column field="totalPct" :bodyClass="colTone.total.body" :bodyStyle="CENTER_STYLE" />
            <Column field="maleN" :bodyClass="colTone.male.body" :bodyStyle="CENTER_STYLE" />
            <Column field="malePct" :bodyClass="colTone.male.body" :bodyStyle="CENTER_STYLE" />
            <Column field="femaleN" :bodyClass="colTone.female.body" :bodyStyle="CENTER_STYLE" />
            <Column field="femalePct" :bodyClass="colTone.female.body" :bodyStyle="CENTER_STYLE" />

            <ColumnGroup type="footer">
              <Row>
                <Column
                  footer="Total"
                  :colspan="2"
                  :footerClass="colTone.label.foot"
                  footerStyle="font-weight: 800"
                />
                <Column
                  :footer="formatNumber(footerTotals.total)"
                  :footerClass="`${colTone.total.foot} !font-extrabold`"
                  :footerStyle="CENTER_STYLE"
                />
                <Column
                  footer="100%"
                  :footerClass="`${colTone.total.foot} !font-extrabold`"
                  :footerStyle="CENTER_STYLE"
                />
                <Column
                  :footer="formatNumber(footerTotals.male)"
                  :footerClass="`${colTone.male.foot} !font-extrabold`"
                  :footerStyle="CENTER_STYLE"
                />
                <Column
                  :footer="`${formatPct(footerTotals.male)}%`"
                  :footerClass="`${colTone.male.foot} !font-extrabold`"
                  :footerStyle="CENTER_STYLE"
                />
                <Column
                  :footer="formatNumber(footerTotals.female)"
                  :footerClass="`${colTone.female.foot} !font-extrabold`"
                  :footerStyle="CENTER_STYLE"
                />
                <Column
                  :footer="`${formatPct(footerTotals.female)}%`"
                  :footerClass="`${colTone.female.foot} !font-extrabold`"
                  :footerStyle="CENTER_STYLE"
                />
              </Row>
            </ColumnGroup>
          </DataTable>
        </section>
      </div>
    </div>
  </div>
</template>