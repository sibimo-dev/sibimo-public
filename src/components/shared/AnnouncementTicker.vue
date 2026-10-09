<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { fetchAllNews } from "@/services/news.js";

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

const JAM_LAYANAN =
  "Jam Layanan Kalurahan: Senin–Kamis 08.00–15.00 WIB, Jumat 08.00–11.00 WIB";

const announcementTitles = ref([]);

onMounted(async () => {
  if (props.items) return;

  try {
    const allNews = await fetchAllNews();
    announcementTitles.value = allNews
      .filter((item) => item.category === "Pengumuman")
      .map((item) => item.title);
  } catch (err) {
    console.error("Gagal memuat pengumuman untuk ticker:", err);
  }
});

const tickerItems = computed(() => {
  if (props.items) return props.items;
  return [JAM_LAYANAN, ...announcementTitles.value];
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