<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Message from "primevue/message";
import Dialog from "primevue/dialog";
import { useLetterApplicationStore } from "@/stores/letterApplication";

const router = useRouter();
const letterApplicationStore = useLetterApplicationStore();

const letterType = computed(() => letterApplicationStore.letterType);
const currentService = computed(() => letterApplicationStore.currentService);
const personalData = computed(() => letterApplicationStore.personalData);
const economicData = computed(() => letterApplicationStore.economicData);
const documents = computed(() => letterApplicationStore.requiredDocuments);

const isSubmitting = ref(false);
const showSuccessDialog = ref(false);

onMounted(() => {
  if (!letterApplicationStore.isPersonalDataValid) {
    router.replace(`/services/apply/${letterType.value}/personal-data`);
    return;
  }
  if (!letterApplicationStore.isDocumentsComplete) {
    router.replace(`/services/apply/${letterType.value}/documents`);
  }
});

const formattedBirthDate = computed(() => {
  if (!personalData.value.birthDate) return "-";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(
    new Date(personalData.value.birthDate),
  );
});

const formattedIncome = computed(() => {
  if (economicData.value.monthlyIncome === null || economicData.value.monthlyIncome === "") return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    economicData.value.monthlyIncome,
  );
});

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function goBack() {
  router.push(`/services/apply/${letterType.value}/documents`);
}

async function submitApplication() {
  if (!letterApplicationStore.agreementConfirmed) return;
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  letterApplicationStore.submitApplication();
  isSubmitting.value = false;
  showSuccessDialog.value = true;
}

function backToServices() {
  letterApplicationStore.reset();
  router.push("/services");
}
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text-h)]">
      Kirim Pengajuan {{ currentService?.shortCode ?? currentService?.title }}
    </h2>

    <Message severity="warn" :closable="false" class="mt-4">
      <span class="font-medium">Perhatian.</span>
      Pastikan data yang Anda masukkan sudah benar sebelum melanjutkan. Permohonan
      bisa ditolak apabila terdapat kesalahan data.
    </Message>

    <div class="mt-6">
      <p class="text-sm font-semibold text-[var(--color-text-h)]">Ringkasan Data Pengajuan</p>
      <p class="text-xs text-[var(--color-text-muted)]">Silakan periksa kembali data yang telah Anda isi.</p>

      <!-- Data diri -->
      <section class="mt-4 rounded-2xl border border-surface-200 p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <i class="pi pi-user text-sm" />
          </span>
          <p class="text-sm font-semibold text-[var(--color-text-h)]">Data Diri Pemohon</p>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Nama Lengkap Pemohon</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.fullName }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Nomor Induk Kependudukan (NIK)</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.nationalId }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Nomor KK</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.familyCardNumber }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Jenis Kelamin</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.gender }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Tempat, Tanggal Lahir</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.birthPlace }}, {{ formattedBirthDate }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">No. WhatsApp</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.phoneNumber }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Pekerjaan</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.occupation }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Pendidikan</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.education }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Status Pernikahan</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.maritalStatus }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Agama</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.religion }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Alamat Saat Ini</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.address }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Alamat Sesuai KTP</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.ktpAddress }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">{{ currentService?.purposeLabel }}</dt>
            <dd class="text-[var(--color-text-h)]">{{ personalData.applicationPurpose }}</dd>
          </div>
        </dl>
      </section>

      <!-- Data ekonomi, hanya untuk surat yang membutuhkan -->
      <section v-if="currentService?.requiresEconomicData" class="mt-4 rounded-2xl border border-surface-200 p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <i class="pi pi-wallet text-sm" />
          </span>
          <p class="text-sm font-semibold text-[var(--color-text-h)]">Data Ekonomi &amp; Tanggungan</p>
        </div>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Penghasilan Rata-rata per Bulan</dt>
            <dd class="text-[var(--color-text-h)]">{{ formattedIncome }}</dd>
          </div>
          <div>
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Jumlah Tanggungan Keluarga</dt>
            <dd class="text-[var(--color-text-h)]">{{ economicData.dependentsCount }} Orang</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">Keterangan Kondisi Ekonomi</dt>
            <dd class="text-[var(--color-text-h)]">{{ economicData.economicNotes }}</dd>
          </div>
        </dl>
      </section>

      <!-- Dokumen -->
      <section class="mt-4 rounded-2xl border border-surface-200 p-5">
        <div class="flex items-center gap-2 mb-3">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <i class="pi pi-folder text-sm" />
          </span>
          <p class="text-sm font-semibold text-[var(--color-text-h)]">Dokumen Pendukung</p>
        </div>
        <ul class="divide-y divide-surface-200">
          <li
            v-for="doc in documents"
            :key="doc.key"
            class="flex items-center justify-between py-2 text-sm"
          >
            <span class="flex items-center gap-2 text-[var(--color-text-h)]">
              <i class="pi pi-file text-emerald-600" />
              {{ letterApplicationStore.documents[doc.key]?.name }}
            </span>
            <span class="text-xs text-[var(--color-text-muted)]">
              {{ formatFileSize(letterApplicationStore.documents[doc.key]?.size ?? 0) }}
            </span>
          </li>
        </ul>
      </section>

      <!-- Pernyataan -->
      <div class="mt-5 flex items-start gap-2">
        <Checkbox
          :modelValue="letterApplicationStore.agreementConfirmed"
          binary
          inputId="agreement-confirmed"
          @update:modelValue="letterApplicationStore.setAgreementConfirmed($event)"
        />
        <label for="agreement-confirmed" class="text-sm text-[var(--color-text-muted)]">
          Dengan mencentang kotak ini, saya menyatakan bahwa data yang saya isi adalah
          benar dan dapat dipertanggungjawabkan. Data yang tidak sesuai dapat
          mengakibatkan permohonan ditolak.
        </label>
      </div>

      <Message severity="secondary" :closable="false" class="mt-3">
        <span class="font-bold text-red-600">Penting:</span>
        setelah mengonfirmasi pengajuan ini, notifikasi akan dikirim ke nomor WhatsApp
        yang sudah Anda cantumkan. Mohon pantau setiap notifikasi yang dikirimkan
        terkait status pengajuan.
      </Message>
    </div>

    <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-surface-200">
      <Button label="Kembali" icon="pi pi-arrow-left" severity="secondary" outlined @click="goBack" />
      <Button
        label="Kirim Pengajuan"
        icon="pi pi-send"
        iconPos="right"
        :loading="isSubmitting"
        :disabled="!letterApplicationStore.agreementConfirmed"
        @click="submitApplication"
      />
    </div>

    <Dialog
      v-model:visible="showSuccessDialog"
      modal
      :closable="false"
      class="w-full max-w-sm"
    >
      <div class="text-center py-2">
        <span class="relative flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl">
          <span class="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          <i class="pi pi-check relative" />
        </span>
        <p class="mt-4 font-semibold text-[var(--color-text-h)]">Pengajuan Berhasil Dikirim</p>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">
          Nomor pengajuan Anda:
          <span class="font-medium text-[var(--color-text-h)]">{{ letterApplicationStore.applicationId }}</span>.
          Pantau status dan unduh dokumen melalui link yang dikirim ke WhatsApp Anda.
        </p>
        <Button label="Kembali ke Layanan Surat" class="mt-5 w-full" @click="backToServices" />
      </div>
    </Dialog>
  </div>
</template>