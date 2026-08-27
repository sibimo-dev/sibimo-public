<script setup>

import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import ProgressBar from "primevue/progressbar";
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

onMounted(() => {
  if (!letterApplicationStore.isPersonalDataValid) {
    router.replace(`/services/apply/${letterType.value}/personal-data`);
  }
});

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    <div class="mt-5 rounded-2xl border border-surface-200 bg-surface-50 p-4 sm:p-5 flex items-center gap-4">
      <span
        class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
        :class="uploadedCount === requiredDocuments.length ? 'bg-emerald-600 text-white' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'"
      >
        <i :class="uploadedCount === requiredDocuments.length ? 'pi pi-check' : 'pi pi-cloud-upload'" />
      </span>
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1.5">
          <p class="text-sm font-medium text-[var(--color-text-h)]">Progres Unggah Dokumen</p>
          <p class="text-sm font-semibold text-[var(--color-primary)]">
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
        class="rounded-2xl border p-5 flex flex-col gap-3 transition-colors duration-150"
        :class="
          letterApplicationStore.documents[doc.key]
            ? 'border-emerald-200 bg-emerald-50/50'
            : 'border-surface-200 bg-white'
        "
      >
        <div class="flex items-start gap-3">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            :class="
              letterApplicationStore.documents[doc.key]
                ? 'bg-emerald-600 text-white'
                : 'bg-surface-100 text-[var(--color-text-muted)]'
            "
          >
            <i :class="letterApplicationStore.documents[doc.key] ? 'pi pi-check' : doc.icon" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-[var(--color-text-h)]">{{ doc.label }}</p>
            <p
              v-if="!letterApplicationStore.documents[doc.key]"
              class="text-xs mt-0.5 text-[var(--color-text-muted)]"
            >
              {{ doc.description }}
            </p>
            <p v-else class="text-xs mt-0.5 text-emerald-700 truncate">
              <i class="pi pi-paperclip text-[10px] mr-1" />{{ letterApplicationStore.documents[doc.key].name }}
              ({{ formatFileSize(letterApplicationStore.documents[doc.key].size) }})
            </p>
          </div>
        </div>

        <!-- Dropzone kosong -->
        <div
          v-if="!letterApplicationStore.documents[doc.key]"
          class="rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 p-4 flex flex-col items-center gap-2 text-center"
        >
          <i class="pi pi-cloud-upload text-xl text-[var(--color-text-muted)]" />
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
            class="mt-1"
            @select="onFileSelect($event, doc.key)"
          />
        </div>

        <!-- Sudah terunggah -->
        <div v-else class="flex items-center gap-2">
          <FileUpload
            mode="basic"
            :auto="true"
            :multiple="false"
            accept="image/png,image/jpeg,application/pdf"
            :maxFileSize="MAX_FILE_SIZE_BYTES"
            chooseLabel="Ganti"
            chooseIcon="pi pi-refresh"
            :customUpload="true"
            class="flex-1"
            @select="onFileSelect($event, doc.key)"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            aria-label="Hapus dokumen"
            @click="removeDocument(doc.key)"
          />
        </div>
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
          @click="goNext"
        />
      </div>
    </div>
  </div>
</template>