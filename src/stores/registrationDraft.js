import { defineStore } from "pinia";
import { ref } from "vue";

/* Draft pendaftaran warga baru. Isian & dokumen dikelola BundleWizard (RegisterWizardView);
   di sini hanya pilihan awal dari pop-up Verifikasi NIK. */
export const useRegistrationDraftStore = defineStore("registrationDraft", () => {
  const residentType = ref(null); // "tetap" | "sementara" | "tinggal-sementara" (dipilih di pop-up Verifikasi NIK)
  const selectedDocs = ref([]); // surat yang sudah tercentang saat halaman dibuka

  function reset() {
    residentType.value = null;
    selectedDocs.value = [];
  }

  return { residentType, selectedDocs, reset };
});
