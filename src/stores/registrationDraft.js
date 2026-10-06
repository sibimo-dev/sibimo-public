import { defineStore } from "pinia";
import { reactive, ref } from "vue";

const emptyForm = () => ({
  fullName: "", familyCardNumber: "", gender: null, birthPlace: "", birthDate: null,
  address: "", ktpAddress: "", phoneNumber: "", occupation: "",
  education: "SMA/SMK", maritalStatus: "Belum Kawin", religion: "Islam",
});

/* Draft pendaftaran warga baru, dipakai bersama oleh 5 step register. */
export const useRegistrationDraftStore = defineStore("registrationDraft", () => {
  const residentType = ref(null); // "tetap" | "sementara" | "tinggal-sementara" (dipilih di pop-up Verifikasi NIK)
  const selectedDocs = ref([]);
  const form = reactive(emptyForm());
  const extra = reactive({}); // isian tambahan per dokumen terpilih
  const files = reactive({}); // { [docValue]: File }
  const submitted = ref(false);

  function reset() {
    residentType.value = null;
    selectedDocs.value = [];
    Object.assign(form, emptyForm());
    Object.keys(extra).forEach((k) => delete extra[k]);
    Object.keys(files).forEach((k) => delete files[k]);
    submitted.value = false;
  }

  return { residentType, selectedDocs, form, extra, files, submitted, reset };
});