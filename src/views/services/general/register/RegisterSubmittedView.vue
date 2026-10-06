<script setup>
import { useRouter } from "vue-router";
import Button from "primevue/button";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";

const router = useRouter();
const draft = useRegistrationDraftStore();
if (!draft.submitted) router.replace({ name: "general-register-select-letters" });

function done() {
  draft.reset();
  router.push({ name: "home" });
}
</script>

<template>
  <div class="text-center py-6">
    <span class="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-500 text-white text-3xl shadow-md">
      <i class="pi pi-check" />
    </span>
    <h1 class="text-xl font-semibold text-[var(--color-text-h)] mt-4">Pendaftaran Terkirim</h1>
    <p class="text-sm mt-2 max-w-md mx-auto text-[var(--color-text-muted)]">
      Data Anda sedang menunggu pemeriksaan dan persetujuan petugas kelurahan.
      Setelah disetujui, Anda dapat masuk dengan NIK untuk mengajukan surat.
    </p>
    <div class="mt-6 flex justify-center gap-3">
      <Button label="Kembali ke Beranda" icon="pi pi-home" class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700" @click="done" />
    </div>
  </div>
</template>
