<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const STEPS = ["Pilih Surat", "Data Diri", "Dokumen", "Konfirmasi", "Selesai"];
const current = computed(() => route.meta.stepIndex ?? 0);
</script>

<template>
  <div class="relative">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-violet-50 via-sky-50/60 to-transparent" />
    <div class="relative p-6 max-w-6xl mx-auto">
    <div class="max-w-2xl mx-auto py-6">
      <ol class="mb-6 flex items-center">
        <li v-for="(label, i) in STEPS" :key="label" class="flex items-center" :class="i < STEPS.length - 1 ? 'flex-1' : ''">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold shadow-sm"
            :class="i <= current ? 'bg-violet-400 text-white' : 'bg-white border-2 border-violet-200 text-[var(--color-text-muted)]'"
          >
            <i v-if="i < current" class="pi pi-check text-xs" />
            <span v-else>{{ i + 1 }}</span>
          </span>
          <span class="ml-2 text-xs hidden sm:inline" :class="i === current ? 'font-semibold text-[var(--color-text-h)]' : 'text-[var(--color-text-muted)]'">{{ label }}</span>
          <span v-if="i < STEPS.length - 1" class="mx-3 h-0.5 flex-1 rounded" :class="i < current ? 'bg-violet-400' : 'bg-violet-100'" />
        </li>
      </ol>

      <div class="rounded-3xl border-2 border-violet-100 bg-white p-6 sm:p-8 shadow-sm">
        <router-view />
      </div>
    </div>
    </div>
  </div>
</template>
