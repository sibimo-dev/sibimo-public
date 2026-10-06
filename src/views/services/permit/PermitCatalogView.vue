<script setup>
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Message from "primevue/message";
import LetterCatalog from "@/views/services/layout/LetterCatalog.vue";
import LetterOutlet from "@/views/services/layout/LetterOutlet.vue";
import { CATEGORY_HUES } from "@/views/services/layout/pastel";
import { useLetterLauncher } from "@/views/services/layout/useLetterLauncher";
import { PERMIT_SERVICES } from "@/data/letterCatalog";

const router = useRouter();
const { openFile, notice, open } = useLetterLauncher("permit");
</script>

<template>
  <LetterOutlet v-if="openFile" :file="openFile" scope="permit" />
  <LetterCatalog
    v-else
    heading="Layanan Umum"
    subtitle="Ajukan izin usaha, keramaian, perjalanan, dan perizinan lainnya secara online."
    :services="PERMIT_SERVICES"
    :fixedHue="CATEGORY_HUES.perizinan"
    searchPlaceholder="Ketik jenis izin (Cth: Usaha, Keramaian)..."
    @select="open"
  >
    <template #top-left>Layanan Umum</template>
    <template #top-action>
      <Button label="Kembali" icon="pi pi-arrow-left" text size="small" @click="router.push({ name: 'services' })" />
    </template>
    <template #notice>
      <Message v-if="notice" severity="warn" class="mt-6" @close="notice = ''">{{ notice }}</Message>
    </template>
  </LetterCatalog>
</template>
