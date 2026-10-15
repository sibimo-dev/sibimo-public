<script setup>
/* Daftar dokumen pendukung + tombol unggah (maks 5 MB per file; JPG/PNG/PDF).
   `files` = objek reaktif { [doc.id]: File } milik induk. Komponen ini hanya memberi tahu induk lewat event. */
import { reactive, ref } from "vue";
import Button from "primevue/button";
import FileThumb from "./FileThumb.vue";
import FilePreviewDialog from "./FilePreviewDialog.vue";
import { MAX_FILE_MB, checkFile, fileSizeLabel } from "./formLogic";

const props = defineProps({
  docs: { type: Array, required: true }, // [{ id, label, optional }]
  files: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) },
  /* Opsional: (doc) => ({ title, file }) | null — tawarkan memakai file yang sama dari surat lain. */
  suggest: { type: Function, default: null },
});
const emit = defineEmits(["select", "remove", "reuse"]);

const localErrors = reactive({});
const preview = reactive({ open: false, file: null, title: "" });
const openPreview = (doc) => Object.assign(preview, { open: true, file: props.files[doc.id], title: doc.label });
const errorOf = (id) => localErrors[id] || props.errors[id];

/* Satu input file tersembunyi dipakai bersama; `pendingId` menandai dokumen yang sedang dipilih. */
const picker = ref(null);
let pendingId = null;

function choose(id) {
  pendingId = id;
  picker.value?.click();
}

function onPick(event) {
  const file = event.target.files?.[0];
  const id = pendingId;
  event.target.value = ""; // supaya file yang sama bisa dipilih ulang
  if (!file || id == null) return;
  const problem = checkFile(file);
  if (problem) {
    localErrors[id] = problem;
    return;
  }
  delete localErrors[id];
  emit("select", id, file);
}

function reuse(doc, s) {
  delete localErrors[doc.id];
  emit("reuse", doc.id, s.file);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <input ref="picker" type="file" accept="image/*,.pdf" class="hidden" @change="onPick" />

    <p v-if="!docs.length" class="text-sm text-[var(--color-text-muted)]">Surat ini tidak membutuhkan dokumen pendukung. Silakan lanjut.</p>

    <div v-for="d in docs" :key="d.id" class="flex flex-col gap-1.5">
      <label class="text-sm text-[var(--color-text-h)]">
        {{ d.label }}<span v-if="d.optional" class="text-[var(--color-text-muted)]"> (opsional)</span>
      </label>

      <div
        class="flex min-h-[140px] flex-col justify-center rounded-xl border-2 border-dashed p-4 transition-colors"
        :class="errorOf(d.id) ? 'border-red-300 bg-red-50' : files[d.id] ? 'border-emerald-300 bg-emerald-50' : 'border-sky-300 bg-sky-50/60'"
      >
        <div v-if="files[d.id]" class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <FileThumb :file="files[d.id]" class="h-14 w-14" />
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-[var(--color-text-h)]">{{ files[d.id].name }}</p>
              <p class="text-xs text-[var(--color-text-muted)]">{{ fileSizeLabel(files[d.id]) }}</p>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-1">
            <Button label="Lihat" icon="pi pi-eye" size="small" severity="secondary" outlined @click="openPreview(d)" />
            <Button icon="pi pi-times" text rounded severity="danger" aria-label="Hapus dokumen" @click="emit('remove', d.id)" />
          </div>
        </div>

        <div v-else class="flex flex-col items-center gap-2 py-2 text-center">
          <span class="flex h-14 w-14 items-center justify-center rounded-full bg-sky-200 text-sky-700">
            <i class="pi pi-cloud-upload text-3xl" />
          </span>
          <Button
            type="button"
            label="Pilih Dokumen"
            icon="pi pi-upload"
            size="small"
            class="!gap-1.5 !px-4 !py-1.5 !text-[13px] !font-medium"
            @click="choose(d.id)"
          />
          <p class="text-sm text-[var(--color-text-muted)]">Belum ada file dipilih</p>
          <p class="text-xs text-[var(--color-text-muted)]">JPG, PNG, atau PDF · maksimal {{ MAX_FILE_MB }} MB</p>
          <Button
            v-if="suggest && suggest(d)"
            type="button"
            size="small"
            text
            icon="pi pi-copy"
            :label="`Pakai file yang sama dari ${suggest(d).title}`"
            @click="reuse(d, suggest(d))"
          />
        </div>
      </div>
      <small v-if="errorOf(d.id)" class="text-red-500">{{ errorOf(d.id) }}</small>
    </div>

    <FilePreviewDialog v-model="preview.open" :file="preview.file" :title="preview.title" />
  </div>
</template>