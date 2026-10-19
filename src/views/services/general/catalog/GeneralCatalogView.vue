<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Message from "primevue/message";
import LetterCatalog from "@/views/services/layout/LetterCatalog.vue";
import LetterOutlet from "@/views/services/layout/LetterOutlet.vue";
import { GENERAL_CATEGORIES, GENERAL_SERVICES } from "@/data/letterCatalog";
import { isBundledLetter } from "@/data/letterBundles";
import { useLetterLauncher } from "@/views/services/layout/useLetterLauncher";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import { isOnlineLetter } from "@/data/letterBackendMap";


const router = useRouter();

const isRemovedCategory = (v) => /perintah/i.test(String(v ?? ""));
const isRemovedService = (s) =>
  isRemovedCategory(s.category) ||
  /sppd|perjalanan dinas|duty-travel|selamatan|death-commemoration/i.test(`${s.title} ${s.slug}`);
const CATEGORIES = GENERAL_CATEGORIES.filter((c) => !isRemovedCategory(c.value) && !isRemovedCategory(c.label));

const residentStore = useResidentVerificationStore();
const { openFile, notice, open } = useLetterLauncher("general");

/* Paket nikah/kelahiran/kematian masuk kategori "Permohonan". Dicari lewat nilai/label kategori
   supaya tidak bergantung pada penulisan persis; bila tidak ada, jatuh ke kategori pertama. */
const permohonanCategory = computed(
  () =>
    (CATEGORIES.find((c) => /permohonan/i.test(c.value) || /permohonan/i.test(c.label)) ?? CATEGORIES[0])?.value,
const services = computed(() =>
  GENERAL_SERVICES.filter((s) => !isBundledLetter(s) && !isRemovedService(s)),
);

function changeNik() {
  residentStore.reset();
  router.push({ name: "general-verify" });
}
</script>

<template>
  <LetterOutlet v-if="openFile" :file="openFile" scope="general" />
  <LetterCatalog
    v-else
    heading="Layanan Warga"
    subtitle="Akses cepat dan mudah untuk pengajuan berbagai dokumen kependudukan dan surat keterangan resmi."
    :services="services"
    :categories="CATEGORIES"
    :total="totalRequests"
    searchPlaceholder="Ketik jenis surat (Cth: SKTM, Domisili, Nikah)..."
    @select="open"
  >
    <template #top-left>
      Masuk sebagai
      <span class="font-medium text-[var(--color-text-h)]">{{ residentStore.resident?.fullName }}</span>
    </template>
    <template #top-action>
      <Button label="Ganti NIK" icon="pi pi-refresh" text size="small" @click="changeNik" />
    </template>
    <template #notice>
      <Message v-if="notice" severity="warn" class="mt-6" @close="notice = ''">{{ notice }}</Message>
    </template>
  </LetterCatalog>
</template>
