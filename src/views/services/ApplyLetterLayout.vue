<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLetterApplicationStore } from "@/stores/letterApplication";
import { useResidentVerificationStore } from "@/stores/residentVerification";

const route = useRoute();
const router = useRouter();
const letterApplicationStore = useLetterApplicationStore();
const residentStore = useResidentVerificationStore();

const steps = [
  { key: "personal-data", label: "Data Diri" },
  { key: "documents", label: "Unggah Dokumen" },
  { key: "confirmation", label: "Konfirmasi" },
];

const currentIndex = computed(() =>
  steps.findIndex((s) => route.path.endsWith(s.key)),
);

watch(
  () => residentStore.isVerified,
  (isVerified) => {
    if (!isVerified) router.replace("/services");
  },
  { immediate: true },
);

watch(
  () => route.params.type,
  (typeSlug) => {
    if (!typeSlug) return;
    letterApplicationStore.setLetterType(typeSlug);
    if (!letterApplicationStore.currentService) {
      router.replace("/services");
    }
  },
  { immediate: true },
);

const serviceTitle = computed(
  () => letterApplicationStore.currentService?.title ?? "Layanan Surat",
);
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="rounded-2xl border border-surface-200 bg-white p-6 sm:p-8">
      <p class="text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
        Formulir Pengajuan
      </p>
      <h1 class="text-xl font-semibold text-[var(--color-text-h)] mt-1">
        {{ serviceTitle }}
      </h1>

      <ol class="flex items-center gap-4 mt-6 mb-8">
        <li
          v-for="(step, i) in steps"
          :key="step.key"
          class="flex-1 flex flex-col items-center gap-2"
        >
          <span
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
            :class="
              i <= currentIndex
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-surface-200 text-[var(--color-text-muted)]'
            "
          >
            <i v-if="i < currentIndex" class="pi pi-check" />
            <template v-else>{{ i + 1 }}</template>
          </span>
          <span
            class="text-xs font-medium"
            :class="i === currentIndex ? 'text-[var(--color-text-h)]' : 'text-[var(--color-text-muted)]'"
          >
            {{ step.label }}
          </span>
        </li>
      </ol>

      <RouterView />
    </div>
  </div>
</template>