<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

// Stepper header sesuai wireframe hal. 4/10/11.
const route = useRoute();
const steps = [
  { key: "personal-data", label: "Data Diri" },
  { key: "documents", label: "Unggah Dokumen" },
  { key: "confirmation", label: "Konfirmasi" },
];

const currentIndex = computed(() =>
  steps.findIndex((s) => route.path.endsWith(s.key)),
);
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <ol class="flex items-center gap-4 mb-8">
      <li
        v-for="(step, i) in steps"
        :key="step.key"
        class="flex-1 flex flex-col items-center gap-2"
      >
        <span
          class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
          :style="{
            background: i <= currentIndex ? 'var(--color-primary)' : '#e5e5e0',
            color: i <= currentIndex ? '#fff' : 'var(--color-text-muted)',
          }"
        >
          <i v-if="i < currentIndex" class="pi pi-check" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span class="text-xs font-medium" :style="{ color: i === currentIndex ? 'var(--color-text-h)' : 'var(--color-text-muted)' }">
          {{ step.label }}
        </span>
      </li>
    </ol>

    <RouterView />
  </div>
</template>
