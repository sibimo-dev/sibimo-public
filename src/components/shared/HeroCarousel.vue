<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  // Durasi tiap foto tampil sebelum pindah ke foto berikutnya (ms)
  intervalMs: { type: Number, default: 6000 },
});

const heroModules = import.meta.glob("@/assets/hero/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});
const slides = computed(() =>
  Object.keys(heroModules)
    .sort()
    .map((key) => heroModules[key])
);

const activeIndex = ref(0);
let timer = null;

function goTo(i) {
  activeIndex.value = i;
}

onMounted(() => {
  if (slides.value.length <= 1) return; // tidak perlu auto-rotate kalau cuma 1 foto
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % slides.value.length;
  }, props.intervalMs);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="absolute inset-0 overflow-hidden">
    <Transition name="hero-fade" mode="out-in">
      <div :key="activeIndex" class="absolute inset-0">
        <img
          :src="slides[activeIndex]"
          alt="Foto Kalurahan Bimomartani"
          class="hero-slide-img w-full h-full object-cover"
        />
      </div>
    </Transition>


    <div class="absolute inset-0 bg-gradient-to-br from-primary-900/92 via-primary-800/85 to-primary-900/70" />


    <div v-if="slides.length > 1" class="absolute bottom-4 right-4 sm:bottom-5 sm:right-6 flex gap-1.5 z-10">
      <button
        v-for="(_, i) in slides"
        :key="i"
        type="button"
        class="h-1.5 rounded-full transition-all"
        :class="i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'"
        :aria-label="`Tampilkan foto ${i + 1}`"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>