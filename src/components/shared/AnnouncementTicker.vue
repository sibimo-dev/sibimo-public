<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { fetchAllNews } from "@/services/news.js";
import api from "@/services/api.js";

const props = defineProps({
  items: {
    type: Array,
    default: null,
  },

  speed: {
    type: Number,
    default: 80,
  },
});

const DEFAULT_JAM_LAYANAN =
  "Jam Layanan Kalurahan: Senin–Kamis 08.00–15.00 WIB, Jumat 08.00–11.00 WIB";

const DAY_LABELS = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

function formatServiceHoursText(data) {
  if (!Array.isArray(data) || data.length === 0) return null;

  const openDays = data
    .filter((d) => !d.is_closed && d.open_time && d.close_time)
    .sort((a, b) => a.day_of_week - b.day_of_week);

  if (openDays.length === 0) {
    return "Layanan Kalurahan: Tutup";
  }

  const groups = [];
  let currentGroup = null;

  for (const day of openDays) {
    const open = (day.open_time || "").slice(0, 5).replace(":", ".");
    const close = (day.close_time || "").slice(0, 5).replace(":", ".");
    const timeKey = `${open}–${close}`;

    if (
      currentGroup &&
      currentGroup.timeKey === timeKey &&
      day.day_of_week === currentGroup.endDay + 1
    ) {
      currentGroup.endDay = day.day_of_week;
    } else {
      currentGroup = {
        startDay: day.day_of_week,
        endDay: day.day_of_week,
        timeKey,
        timeStr: `${open}–${close} WIB`,
      };
      groups.push(currentGroup);
    }
  }

  const parts = groups.map((g) => {
    const dayStr =
      g.startDay === g.endDay
        ? DAY_LABELS[g.startDay]
        : `${DAY_LABELS[g.startDay]}–${DAY_LABELS[g.endDay]}`;
    return `${dayStr} ${g.timeStr}`;
  });

  return `Jam Layanan Kalurahan: ${parts.join(", ")}`;
}

const serviceHoursText = ref(DEFAULT_JAM_LAYANAN);
const announcementTitles = ref([]);
let tickerPollTimer = null;

async function loadTickerData() {
  if (props.items) return;

  try {
    const [allNews, hoursRes] = await Promise.allSettled([
      fetchAllNews(),
      api.get("/service-hours"),
    ]);

    if (allNews.status === "fulfilled") {
      announcementTitles.value = (allNews.value || [])
        .filter((item) => item.category === "Pengumuman")
        .map((item) => item.title);
    }

    if (hoursRes.status === "fulfilled") {
      const hoursData = hoursRes.value?.data?.data ?? hoursRes.value?.data;
      const formatted = formatServiceHoursText(hoursData);
      if (formatted) {
        serviceHoursText.value = formatted;
      }
    }
  } catch (err) {
    console.error("Gagal memuat data ticker:", err);
  }
}

onMounted(() => {
  void loadTickerData();
  // Polling tiap 5 detik agar jam layanan & pengumuman update otomatis tanpa refresh
  tickerPollTimer = setInterval(loadTickerData, 5000);
});

onBeforeUnmount(() => {
  if (tickerPollTimer) clearInterval(tickerPollTimer);
});

const tickerItems = computed(() => {
  if (props.items) return props.items;
  return [serviceHoursText.value, ...announcementTitles.value];
});

/* ============ Ukur lebar container & teks, biar animasi
   selalu mulai persis dari luar kanan & berakhir persis di luar kiri ============ */
const containerRef = ref(null);
const trackRef = ref(null);
const containerWidth = ref(0);
const contentWidth = ref(0);

async function measure() {
  await nextTick();
  containerWidth.value = containerRef.value?.offsetWidth || 0;
  contentWidth.value = trackRef.value?.scrollWidth || 0;
}

let resizeObserver = null;

onMounted(() => {
  measure();
  resizeObserver = new ResizeObserver(measure);
  if (containerRef.value) resizeObserver.observe(containerRef.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(tickerItems, measure);

const totalDistance = computed(() => containerWidth.value + contentWidth.value);
const duration = computed(() =>
  totalDistance.value > 0 ? totalDistance.value / props.speed : 0
);

const trackStyle = computed(() => ({
  "--start": `${containerWidth.value}px`,
  "--end": `${-contentWidth.value}px`,
  animationDuration: `${duration.value}s`,
}));
</script>

<template>
  <div class="w-full bg-white border-b border-border-default overflow-hidden">
    <div class="max-w-page mx-auto">
      <div ref="containerRef" class="group relative h-8 sm:h-9 overflow-hidden">
        <div
          ref="trackRef"
          class="ticker-track absolute top-0 left-0 flex items-center h-full whitespace-nowrap will-change-transform motion-reduce:animate-none group-hover:[animation-play-state:paused]"
          :style="trackStyle"
        >
          <template v-for="(item, i) in tickerItems" :key="i">
            <span class="inline-flex items-center gap-2 px-6 text-[12px] font-semibold text-primary-900 sm:text-[13px]">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-900" />
              {{ item }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ticker-scroll {
  from {
    transform: translateX(var(--start));
  }
  to {
    transform: translateX(var(--end));
  }
}

.ticker-track {
  animation-name: ticker-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
</style>