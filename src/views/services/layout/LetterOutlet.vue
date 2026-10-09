<script setup>
/* Menampilkan form surat yang dipilih dari katalog (?letter=NamaBerkas).
   Warna wizard mengikuti kategori surat lewat provide("letterHue"). */
import { computed, defineAsyncComponent, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Message from "primevue/message";
import { findLetterByFile } from "./letterLookup";
import { CATEGORY_HUES, hueForCategory } from "./pastel";

const props = defineProps({
  file: { type: String, required: true },
  scope: { type: String, default: "general" }, // "general" | "permit"
});

const route = useRoute();
const router = useRouter();

const entry = computed(() => findLetterByFile(props.file, props.scope));
const component = computed(() => (entry.value ? defineAsyncComponent(entry.value.load) : null));
const hueName = computed(() => (props.scope === "permit" ? CATEGORY_HUES.perizinan : hueForCategory(entry.value?.category)));
provide("letterHue", hueName);

const catalogName = computed(() => (props.scope === "permit" ? "permit-catalog" : "general-catalog"));
const toCatalog = () => router.push({ name: catalogName.value, query: route.query.category ? { category: route.query.category } : {} });
</script>

<template>
  <component :is="component" v-if="component" :key="file" />
  <div v-else class="p-6 max-w-3xl mx-auto">
    <Message severity="warn" :closable="false">Formulir surat ini tidak ditemukan.</Message>
    <Button label="Kembali ke Katalog" icon="pi pi-arrow-left" severity="secondary" outlined class="mt-4" @click="toCatalog" />
  </div>
</template>
