<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";
import { docsForType, residentTypeOf } from "@/data/registrationDocs";
import { hue } from "@/views/services/layout/pastel";

const router = useRouter();
const hueOfDoc = (doc) => hue(doc.hue);
const residentStore = useResidentVerificationStore();
const draft = useRegistrationDraftStore();

const docs = computed(() => docsForType(draft.residentType));
const typeInfo = computed(() => residentTypeOf(draft.residentType));
const hasSelection = computed(() => draft.selectedDocs.length > 0);
const isSelected = (v) => draft.selectedDocs.includes(v);

function toggle(v) {
  draft.selectedDocs = isSelected(v) ? draft.selectedDocs.filter((d) => d !== v) : [...draft.selectedDocs, v];
}
</script>

<template>
  <div>
    <Button label="Kembali ke Cek NIK" icon="pi pi-arrow-left" text size="small" class="!px-0" @click="router.push({ name: 'general-verify' })" />
    <h1 class="text-xl font-semibold text-[var(--color-text-h)] mt-3">Pendaftaran Warga Baru</h1>
    <p class="text-sm mt-1 text-[var(--color-text-muted)]">
      NIK <span class="font-medium text-[var(--color-text-h)]">{{ residentStore.nik }}</span>
      belum terdaftar. Pilih surat/dokumen kependudukan yang Anda butuhkan untuk mendaftar.
    </p>
    <p v-if="typeInfo" class="mt-3 flex flex-wrap items-center gap-2 text-sm">
      <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" :class="hue(typeInfo.hue).pill"><i :class="typeInfo.icon" /> {{ typeInfo.label }}</span>
      <Button label="Ganti" icon="pi pi-pencil" text size="small" @click="router.push({ name: 'general-verify' })" />
    </p>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        v-for="doc in docs"
        :key="doc.value"
        type="button"
        class="relative overflow-hidden text-left rounded-2xl border-2 p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none"
        :class="isSelected(doc.value) ? hueOfDoc(doc).selected : hueOfDoc(doc).idle"
        @click="toggle(doc.value)"
      >
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg" :class="hueOfDoc(doc).icon">
          <i :class="doc.icon" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block font-semibold text-sm text-[var(--color-text-h)]">{{ doc.label }}</span>
          <span v-if="doc.description" class="block text-xs mt-0.5 text-[var(--color-text-muted)]">{{ doc.description }}</span>
        </span>
        <i v-if="isSelected(doc.value)" class="pi pi-check-circle" :class="hueOfDoc(doc).text" />
      </button>
    </div>

    <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-surface-200">
      <Button label="Batal" severity="secondary" outlined @click="router.push({ name: 'general-verify' })" />
      <Button
        label="Lanjut"
        icon="pi pi-arrow-right"
        iconPos="right"
        :disabled="!hasSelection"
        class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700"
        @click="router.push({ name: 'general-register-personal-data' })"
      />
    </div>
  </div>
</template>