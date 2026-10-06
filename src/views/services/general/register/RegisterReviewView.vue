<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Message from "primevue/message";
import FileThumb from "@/views/services/layout/FileThumb.vue";
import FilePreviewDialog from "@/views/services/layout/FilePreviewDialog.vue";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import { REGISTRATION_DOCS } from "@/data/registrationDocs";

const router = useRouter();
const draft = useRegistrationDraftStore();
const residentStore = useResidentVerificationStore();
if (!draft.selectedDocs.length) router.replace({ name: "general-register-select-letters" });

const fmt = (v) => (v instanceof Date ? v.toLocaleDateString("id-ID") : v || "-");
const docs = computed(() => REGISTRATION_DOCS.filter((d) => draft.selectedDocs.includes(d.value)));

const personalRows = computed(() => [
  ["NIK", residentStore.nik],
  ["Nama Lengkap", draft.form.fullName],
  ["Nomor KK", draft.form.familyCardNumber],
  ["Jenis Kelamin", draft.form.gender],
  ["Tempat, Tanggal Lahir", `${draft.form.birthPlace}, ${fmt(draft.form.birthDate)}`],
  ["Nomor WhatsApp", draft.form.phoneNumber],
  ["Pekerjaan", draft.form.occupation],
  ["Pendidikan", draft.form.education],
  ["Status Pernikahan", draft.form.maritalStatus],
  ["Agama", draft.form.religion],
  ["Alamat Saat Ini", draft.form.address],
  ["Alamat Sesuai KTP", draft.form.ktpAddress],
]);

const preview = reactive({ open: false, file: null, title: "" });
const openPreview = (d) => Object.assign(preview, { open: true, file: draft.files[d.value], title: d.label });

const isSubmitting = ref(false);
const confirmOpen = ref(false); // pop-up konfirmasi kirim

async function submit() {
  isSubmitting.value = true;
  // TODO(BE): kirim data pendaftaran + file (multipart/form-data) ke API kependudukan.
  // Status warga baru = MENUNGGU persetujuan petugas kelurahan, belum terverifikasi.
  await new Promise((resolve) => setTimeout(resolve, 800));
  isSubmitting.value = false;
  draft.submitted = true;
  router.push({ name: "general-register-submitted" });
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-[var(--color-text-h)]">Periksa Kembali</h1>
    <p class="text-sm mt-1 text-[var(--color-text-muted)]">Pastikan semua data sudah benar sebelum dikirim.</p>

    <section class="mt-6 rounded-xl border border-surface-200 p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-[var(--color-text-h)]">Surat yang dipilih</h2>
        <Button label="Ubah" text size="small" @click="router.push({ name: 'general-register-select-letters' })" />
      </div>
      <div class="mt-2 flex flex-wrap gap-2">
        <span v-for="d in docs" :key="d.value" class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
          <i :class="d.icon" /> {{ d.label }}
        </span>
      </div>
    </section>

    <section class="mt-4 rounded-xl border border-surface-200 p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-[var(--color-text-h)]">Data Diri</h2>
        <Button label="Ubah" text size="small" @click="router.push({ name: 'general-register-personal-data' })" />
      </div>
      <dl class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div v-for="[label, value] in personalRows" :key="label">
          <dt class="text-xs text-[var(--color-text-muted)]">{{ label }}</dt>
          <dd class="text-[var(--color-text-h)]">{{ value || "-" }}</dd>
        </div>
        <template v-for="d in docs" :key="d.value">
          <div v-for="f in d.fields" :key="f.key">
            <dt class="text-xs text-[var(--color-text-muted)]">{{ f.label }} ({{ d.label }})</dt>
            <dd class="text-[var(--color-text-h)]">{{ fmt(draft.extra[f.key]) }}</dd>
          </div>
        </template>
      </dl>
    </section>

    <section class="mt-4 rounded-xl border border-surface-200 p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-[var(--color-text-h)]">Dokumen</h2>
        <Button label="Ubah" text size="small" @click="router.push({ name: 'general-register-documents' })" />
      </div>
      <ul class="mt-2 text-sm flex flex-col gap-2">
        <li v-for="d in docs" :key="d.value" class="flex items-center gap-3">
          <FileThumb v-if="draft.files[d.value]" :file="draft.files[d.value]" class="h-12 w-12" />
          <i v-else class="pi pi-minus-circle mx-3.5 text-[var(--color-text-muted)]" />
          <span class="min-w-0 flex-1">
            <span class="block text-[var(--color-text-h)]">{{ d.label }}</span>
            <span class="block truncate text-xs text-[var(--color-text-muted)]">{{ draft.files[d.value]?.name || "Belum diunggah" }}</span>
          </span>
          <Button v-if="draft.files[d.value]" label="Lihat" icon="pi pi-eye" size="small" severity="secondary" outlined @click="openPreview(d)" />
        </li>
      </ul>
    </section>

    <FilePreviewDialog v-model="preview.open" :file="preview.file" :title="preview.title" />

    <!-- ============ POP-UP KONFIRMASI KIRIM ============ -->
    <Dialog v-model:visible="confirmOpen" modal :closable="!isSubmitting" :draggable="false" :style="{ width: '26rem', maxWidth: '94vw' }" header="Kirim Pendaftaran?">
      <div class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-2xl"><i class="pi pi-question" /></span>
        <p class="text-sm text-[var(--color-text-h)]">Apakah Anda yakin ingin mengirim pendaftaran sekarang?</p>
        <p class="text-xs text-[var(--color-text-muted)]">Setelah dikirim, pendaftaran akan diperiksa dan disetujui oleh petugas kelurahan.</p>
      </div>
      <template #footer>
        <Button label="Periksa Lagi" severity="secondary" outlined :disabled="isSubmitting" @click="confirmOpen = false" />
        <Button label="Ya, Kirim Pendaftaran" icon="pi pi-send" class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700" :loading="isSubmitting" @click="confirmOpen = false; submit()" />
      </template>
    </Dialog>

    <Message severity="info" :closable="false" class="mt-4">
      Setelah dikirim, pendaftaran Anda akan diperiksa dan disetujui oleh petugas kelurahan.
    </Message>

    <div class="flex justify-between gap-3 mt-6 pt-6 border-t border-surface-200">
      <Button label="Kembali" icon="pi pi-arrow-left" severity="secondary" outlined @click="router.push({ name: 'general-register-documents' })" />
      <Button label="Kirim Pendaftaran" icon="pi pi-send" iconPos="right" class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700" :loading="isSubmitting" @click="confirmOpen = true" />
    </div>
  </div>
</template>
