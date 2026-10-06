<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import FileThumb from "@/views/services/layout/FileThumb.vue";
import FilePreviewDialog from "@/views/services/layout/FilePreviewDialog.vue";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";
import { REGISTRATION_DOCS } from "@/data/registrationDocs";

const router = useRouter();
const draft = useRegistrationDraftStore();
if (!draft.selectedDocs.length) router.replace({ name: "general-register-select-letters" });

const errors = ref({});
const preview = reactive({ open: false, file: null, title: "" });
const openPreview = (doc) => Object.assign(preview, { open: true, file: draft.files[doc.value], title: doc.label });
const docs = computed(() => REGISTRATION_DOCS.filter((d) => draft.selectedDocs.includes(d.value)));

function onSelect(docValue, event) {
  const file = event.files?.[0];
  if (!file) return;
  draft.files[docValue] = file;
  const next = { ...errors.value };
  delete next[docValue];
  errors.value = next;
}

function remove(docValue) {
  delete draft.files[docValue];
}

function next() {
  const e = {};
  for (const d of docs.value) if (!draft.files[d.value]) e[d.value] = `Dokumen pendukung ${d.label} wajib diunggah.`;
  errors.value = e;
  if (!Object.keys(e).length) router.push({ name: "general-register-review" });
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-[var(--color-text-h)]">Dokumen Pendukung</h1>
    <p class="text-sm mt-1 text-[var(--color-text-muted)]">Unggah dokumen untuk setiap surat yang Anda pilih (JPG, PNG, atau PDF).</p>

    <div class="mt-6 flex flex-col gap-4">
      <div v-for="doc in docs" :key="doc.value" class="flex flex-col gap-1">
        <label class="text-sm text-[var(--color-text-h)]">Dokumen pendukung {{ doc.label }}</label>
        <div class="rounded-xl border border-dashed p-4" :class="errors[doc.value] ? 'border-red-400 bg-red-50' : 'border-surface-300 bg-surface-50'">
          <div v-if="draft.files[doc.value]" class="flex items-center justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <FileThumb :file="draft.files[doc.value]" class="h-14 w-14" />
              <span class="truncate text-sm text-[var(--color-text-h)]">{{ draft.files[doc.value].name }}</span>
            </div>
            <div class="flex shrink-0 items-center gap-1">
              <Button label="Lihat" icon="pi pi-eye" size="small" severity="secondary" outlined @click="openPreview(doc)" />
              <Button icon="pi pi-times" text rounded severity="danger" aria-label="Hapus dokumen" @click="remove(doc.value)" />
            </div>
          </div>
          <div v-else class="flex flex-col items-center gap-2 py-4 text-center">
            <i class="pi pi-cloud-upload text-2xl text-[var(--color-text-muted)]" />
            <span class="text-xs text-[var(--color-text-muted)]">Unggah foto/scan dokumen untuk {{ doc.label }}</span>
            <FileUpload
              mode="basic"
              :name="doc.value"
              accept="image/*,.pdf"
              chooseLabel="Pilih Dokumen"
              chooseIcon="pi pi-upload"
              :auto="false"
              :customUpload="true"
              class="[&_input[type='file']]:hidden"
              @select="onSelect(doc.value, $event)"
            />
          </div>
        </div>
        <small v-if="errors[doc.value]" class="text-red-500">{{ errors[doc.value] }}</small>
      </div>
    </div>

    <FilePreviewDialog v-model="preview.open" :file="preview.file" :title="preview.title" />

    <div class="flex justify-between gap-3 mt-6 pt-6 border-t border-surface-200">
      <Button label="Kembali" icon="pi pi-arrow-left" severity="secondary" outlined @click="router.push({ name: 'general-register-personal-data' })" />
      <Button label="Lanjut" icon="pi pi-arrow-right" iconPos="right" class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700" @click="next" />
    </div>
  </div>
</template>
