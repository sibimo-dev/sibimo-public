<script setup>
/* Pendaftaran Warga Baru (NIK belum terdaftar). Memakai wizard yang sama dengan paket surat:
   1) Pilih Surat → 2) Isian (1 surat = 1 halaman, step di dalam step) → 3) Dokumen → 4) Cek & Kirim.
   Isian & dokumen tiap surat dibaca dari berkas surat di views/services/letters (lihat data/registrationLetters.js). */
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import BundleWizard from "@/views/services/general/bundle/BundleWizard.vue";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";
import { buildRegisterBundle } from "@/data/registrationLetters";

const router = useRouter();
const resident = useResidentVerificationStore();
const draft = useRegistrationDraftStore();

const bundle = ref(null);
const failed = ref(false);

onMounted(async () => {
  try {
    bundle.value = await buildRegisterBundle({
      type: draft.residentType,
      nik: resident.nik,
      preselected: draft.selectedDocs,
      ui: {
        kindLabel: "Pendaftaran Warga Baru",
        selectTitle: "Surat apa saja yang Anda butuhkan?",
        selectHint: "Pilih surat/dokumen kependudukan untuk mendaftar. Setiap surat yang dipilih mendapat satu langkah pengisian sendiri, termasuk data diri.",
        back: { name: "general-verify" },
        backLabel: "Kembali ke Cek NIK",
        submitLabel: "Kirim Pendaftaran",
        confirmTitle: "Kirim Pendaftaran?",
        confirmText: "Apakah Anda yakin ingin mengirim pendaftaran sekarang?",
        confirmNote: "Setelah dikirim, pendaftaran akan diperiksa dan disetujui oleh petugas kelurahan.",
        confirmYes: "Ya, Kirim Pendaftaran",
        doneTitle: "Pendaftaran Terkirim",
        failTitle: "Pendaftaran Gagal",
        doneIntro: "Pendaftaran Anda berhasil dikirim.",
        doneMessage: "Data Anda sedang menunggu pemeriksaan dan persetujuan petugas kelurahan. Setelah disetujui, Anda dapat masuk dengan NIK untuk mengajukan surat.",
        done: { label: "Kembali ke Beranda", icon: "pi pi-home", run: (r) => { draft.reset(); r.push({ name: "home" }); } },
      },
    });
  } catch (err) {
    console.error("[register] Gagal memuat surat:", err);
    failed.value = true;
  }
});
</script>

<template>
  <BundleWizard v-if="bundle" :bundle="bundle" />
  <div v-else-if="failed" class="p-6 max-w-3xl mx-auto">
    <Message severity="error" :closable="false">Formulir pendaftaran gagal dimuat. Muat ulang halaman ini atau kembali ke Cek NIK.</Message>
    <button type="button" class="mt-4 text-sm underline" @click="router.push({ name: 'general-verify' })">Kembali ke Cek NIK</button>
  </div>
  <div v-else class="flex justify-center p-10"><ProgressSpinner style="width: 2.5rem; height: 2.5rem" /></div>
</template>
