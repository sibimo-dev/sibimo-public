<script setup>
/* Halaman paket surat. Route: /services/general/bundle/:bundle  (name: "general-bundle") */
import { computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import BundleWizard from "./BundleWizard.vue";
import { findBundle } from "@/data/letterBundles";
import { CATEGORY_HUES } from "@/views/services/layout/pastel";

const route = useRoute();
const router = useRouter();
const bundle = computed(() => findBundle(String(route.params.bundle)));

// slug tidak dikenal → kembali ke katalog
watchEffect(() => {
  if (!bundle.value) router.replace({ name: "general-catalog", query: { category: "permohonan" } });
});
</script>

<template>
  <!-- paket surat termasuk kategori Permohonan → warna biru, sama dengan kartunya di katalog -->
  <BundleWizard v-if="bundle" :key="bundle.slug" :bundle="bundle" :hue="CATEGORY_HUES.permohonan" />
</template>
