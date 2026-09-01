<script setup>

 
defineProps({
  label: {
    type: String,
    default: "Sekilas Info",
  },
  icon: {
    type: String,
    default: "pi-megaphone",
  },
  items: {
    type: Array,
    default: () => [
      "Jam Layanan Kalurahan: Senin–Kamis 08.00–15.00 WIB, Jumat 08.00–11.00 WIB",
      "Pelayanan surat-menyurat kini bisa diajukan online melalui menu Layanan Surat",
      "Musyawarah Desa Bulanan dilaksanakan setiap tanggal 2, pukul 19.30 WIB di Pendopo Kalurahan",
    ],
  },
  /* Durasi satu putaran penuh teks, dalam detik. Makin panjang teksnya, biasanya makin perlu diperbesar. */
  speed: {
    type: Number,
    default: 60  },
});
</script>

<template>
  <div class="w-full bg-surface border-b border-border-default overflow-hidden">
    <div class="max-w-page mx-auto flex items-stretch">
      <!-- Badge kiri, tidak ikut bergerak -->
      <div
        class="shrink-0 flex items-center gap-2 bg-primary-900 text-white text-[12px] sm:text-[13px] font-bold px-3.5 sm:px-5 py-2 sm:py-2.5"
      >
        <i :class="icon" class="pi text-[13px]" />
        <span class="whitespace-nowrap">{{ label }}</span>
      </div>

      <!-- Teks berjalan -->
      <div class="group relative flex-1 overflow-hidden py-2 sm:py-2.5">
        <div
          class="flex w-max animate-marquee items-center whitespace-nowrap [animation-duration:var(--ticker-speed)] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
          :style="{ '--ticker-speed': `${speed}s` }"
        >
          <template v-for="(item, i) in [...items, ...items]" :key="i">
            <span class="inline-flex items-center gap-2 px-6 text-[12px] text-text sm:text-[13px]">
              <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
              {{ item }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>