<script setup>

import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import ProgressBar from "primevue/progressbar";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import { useLetterApplicationStore } from "@/stores/letterApplication";

const router = useRouter();
const letterApplicationStore = useLetterApplicationStore();

const letterType = computed(() => letterApplicationStore.letterType);
const currentService = computed(() => letterApplicationStore.currentService);
const requiredDocuments = computed(() => letterApplicationStore.requiredDocuments);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const uploadedCount = computed(
  () => requiredDocuments.value.filter((doc) => letterApplicationStore.documents[doc.key]).length,
);
const progressPercent = computed(() =>
  requiredDocuments.value.length
    ? Math.round((uploadedCount.value / requiredDocuments.value.length) * 100)
    : 0,
);

onMounted(async () => {
  if (!letterApplicationStore.isPersonalDataValid) {
    router.replace(`/services/apply/${letterType.value}/personal-data`);
    return;
  }
  await letterApplicationStore.hydrateDocuments();
});

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeIcon(file) {
  if (!file) return "pi pi-file";
  if (file.type?.startsWith("image/")) return "pi pi-image";
  if (file.type === "application/pdf") return "pi pi-file-pdf";
  return "pi pi-file";
}

function onFileSelect(event, documentKey) {
  const file = event.files?.[0];
  if (!file) return;
  letterApplicationStore.setDocument(documentKey, file);
}

function removeDocument(documentKey) {
  letterApplicationStore.removeDocument(documentKey);
}

function goBack() {
  router.push(`/services/apply/${letterType.value}/personal-data`);
}

function goNext() {
  if (!letterApplicationStore.isDocumentsComplete) return;
  router.push(`/services/apply/${letterType.value}/confirmation`);
}

/* Pratinjau dokumen untuk crosscheck sebelum lanjut  */

const previewVisible = ref(false);
const previewDocKey = ref(null);
const previewUrl = ref(null);

const previewFile = computed(() =>
  previewDocKey.value ? letterApplicationStore.documents[previewDocKey.value] : null,
);
const previewLabel = computed(
  () => requiredDocuments.value.find((doc) => doc.key === previewDocKey.value)?.label ?? "Dokumen",
);
const previewIsImage = computed(() => previewFile.value?.type?.startsWith("image/"));
const previewIsPdf = computed(() => previewFile.value?.type === "application/pdf");

function revokePreviewUrl() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
}

function openPreview(documentKey) {
  const file = letterApplicationStore.documents[documentKey];
  if (!file) return;
  revokePreviewUrl();
  previewDocKey.value = documentKey;
  previewUrl.value = URL.createObjectURL(file);
  previewVisible.value = true;
}

function closePreview() {
  previewVisible.value = false;
  previewDocKey.value = null;
  revokePreviewUrl();
}

onBeforeUnmount(() => {
  revokePreviewUrl();
});
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text-h)]">Unggah Dokumen Persyaratan</h2>
    <p class="text-sm mt-1 text-[var(--color-text-muted)]">
      Silakan unggah dokumen yang diperlukan untuk pengajuan {{ currentService?.title }}
      <span v-if="currentService?.shortCode">({{ currentService.shortCode }})</span>.
      Format yang didukung: JPG, PNG, PDF (Maks. 5MB).
    </p>

    <!-- Progres unggah -->
    <div
      class="mt-5 rounded-2xl border-2 p-4 sm:p-5 flex items-center gap-4 transition-colors duration-200"
      :class="
        uploadedCount === requiredDocuments.length
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white'
          : 'border-[#1e3a5f]/15 bg-gradient-to-br from-[#1e3a5f]/5 to-white'
      "
    >
      <span
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg shadow-sm"
        :class="uploadedCount === requiredDocuments.length ? 'bg-emerald-600 text-white' : 'bg-[#1e3a5f] text-white'"
      >
        <i :class="uploadedCount === requiredDocuments.length ? 'pi pi-check' : 'pi pi-cloud-upload'" />
      </span>
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1.5">
          <p class="text-sm font-semibold text-[var(--color-text-h)]">Progres Unggah Dokumen</p>
          <p
            class="text-sm font-bold"
            :class="uploadedCount === requiredDocuments.length ? 'text-emerald-600' : 'text-[#1e3a5f]'"
          >
            {{ uploadedCount }}/{{ requiredDocuments.length }}
          </p>
        </div>
        <ProgressBar :value="progressPercent" :showValue="false" style="height: 8px" />
      </div>
    </div>

    <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div
        v-for="doc in requiredDocuments"
        :key="doc.key"
        class="group relative overflow-hidden rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all duration-200"
        :class="
          letterApplicationStore.documents[doc.key]
            ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white shadow-sm hover:shadow-md'
            : 'border-dashed border-surface-300 bg-surface-50 hover:border-[#1e3a5f]/40'
        "
      >
        <!-- Header kartu -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start gap-3 min-w-0">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm"
              :class="
                letterApplicationStore.documents[doc.key]
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-surface-200 text-[var(--color-text-muted)]'
              "
            >
              <i :class="letterApplicationStore.documents[doc.key] ? 'pi pi-check' : doc.icon" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-[var(--color-text-h)]">{{ doc.label }}</p>
              <p
                v-if="!letterApplicationStore.documents[doc.key]"
                class="text-xs mt-0.5 text-[var(--color-text-muted)]"
              >
                {{ doc.description }}
              </p>
            </div>
          </div>

          <Tag
            v-if="letterApplicationStore.documents[doc.key]"
            value="Terunggah"
            severity="success"
            rounded
            class="shrink-0 !text-[10px]"
          />
        </div>

        <!-- Dropzone kosong -->
        <div
          v-if="!letterApplicationStore.documents[doc.key]"
          class="rounded-xl border-2 border-dashed border-surface-300 bg-white p-4 flex flex-col items-center gap-2 text-center"
        >
          <i class="pi pi-cloud-upload text-2xl text-[var(--color-text-muted)]" />
          <p class="text-[11px] text-[var(--color-text-muted)]">JPG, PNG, atau PDF · Maks. 5MB</p>
          <FileUpload
            mode="basic"
            :auto="true"
            :multiple="false"
            accept="image/png,image/jpeg,application/pdf"
            :maxFileSize="MAX_FILE_SIZE_BYTES"
            chooseLabel="Pilih File"
            chooseIcon="pi pi-upload"
            :customUpload="true"
            class="mt-1 [&_.p-button]:!bg-[#1e3a5f] [&_.p-button]:!border-[#1e3a5f] [&_.p-button]:hover:!bg-[#2d5580]"
            @select="onFileSelect($event, doc.key)"
          />
        </div>

        <!-- Sudah terunggah -->
        <template v-else>
          <div class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white/80 px-3 py-2.5">
            <i :class="[fileTypeIcon(letterApplicationStore.documents[doc.key]), 'text-emerald-600 text-lg shrink-0']" />
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-[var(--color-text-h)] truncate">
                {{ letterApplicationStore.documents[doc.key].name }}
              </p>
              <p class="text-[11px] text-[var(--color-text-muted)]">
                {{ formatFileSize(letterApplicationStore.documents[doc.key].size) }}
              </p>
            </div>
          </div>

          <Button
            label="Lihat Dokumen"
            icon="pi pi-eye"
            severity="secondary"
            outlined
            size="small"
            class="w-full !border-emerald-300 !text-emerald-700 hover:!bg-emerald-50"
            @click="openPreview(doc.key)"
          />

          <div class="flex items-center gap-2">
            <FileUpload
              mode="basic"
              :auto="true"
              :multiple="false"
              accept="image/png,image/jpeg,application/pdf"
              :maxFileSize="MAX_FILE_SIZE_BYTES"
              chooseLabel="Ganti File"
              chooseIcon="pi pi-refresh"
              :customUpload="true"
              class="flex-1 [&_.p-button]:w-full [&_.p-button]:!bg-white [&_.p-button]:!text-[#1e3a5f] [&_.p-button]:!border-[#1e3a5f]/30 [&_.p-button]:hover:!bg-[#1e3a5f]/5"
              @select="onFileSelect($event, doc.key)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              outlined
              rounded
              aria-label="Hapus dokumen"
              class="shrink-0"
              @click="removeDocument(doc.key)"
            />
          </div>
        </template>
      </div>
    </div>

    <div class="flex items-center justify-between mt-6 pt-6 border-t border-surface-200">
      <p v-if="!letterApplicationStore.isDocumentsComplete" class="text-xs text-[var(--color-text-muted)]">
        <i class="pi pi-info-circle mr-1" />Lengkapi semua dokumen untuk melanjutkan.
      </p>
      <span v-else />
      <div class="flex gap-3">
        <Button label="Kembali" icon="pi pi-arrow-left" severity="secondary" outlined @click="goBack" />
        <Button
          label="Lanjutkan"
          icon="pi pi-arrow-right"
          iconPos="right"
          :disabled="!letterApplicationStore.isDocumentsComplete"
          class="!bg-[#1e3a5f] !border-[#1e3a5f] hover:!bg-[#2d5580]"
          @click="goNext"
        />
      </div>
    </div>

    <!-- Dialog pratinjau dokumen -->
    <Dialog
      v-model:visible="previewVisible"
      modal
      :header="previewLabel"
      class="w-full max-w-2xl"
      @update:visible="(val) => !val && closePreview()"
    >
      <div v-if="previewFile" class="flex flex-col gap-3">
        <p class="text-xs text-[var(--color-text-muted)]">
          <i class="pi pi-paperclip text-[10px] mr-1" />{{ previewFile.name }}
          ({{ formatFileSize(previewFile.size) }})
        </p>

        <img
          v-if="previewIsImage && previewUrl"
          :src="previewUrl"
          :alt="previewFile.name"
          class="w-full max-h-[70vh] object-contain rounded-lg border border-surface-200"
        />

        <iframe
          v-else-if="previewIsPdf && previewUrl"
          :src="previewUrl"
          class="w-full h-[70vh] rounded-lg border border-surface-200"
          title="Pratinjau PDF"
        />

        <p v-else class="text-sm text-[var(--color-text-muted)] py-8 text-center">
          Format file ini tidak didukung untuk pratinjau langsung.
        </p>
      </div>

      <template #footer>
        <Button label="Tutup" severity="secondary" outlined @click="closePreview" />
      </template>
    </Dialog>
  </div>
</template>