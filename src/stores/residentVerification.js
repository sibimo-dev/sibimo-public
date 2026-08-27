import { defineStore } from "pinia";
import { findResidentByNik } from "@/data/registeredResidents";

/**
 * Menyimpan status verifikasi NIK warga sebelum masuk ke Layanan Surat.
 * - verifyNik(): cek NIK ke "database" warga (mock), set isVerified +
 *   resident kalau ditemukan.
 * - registerNewResident(): dipakai saat warga belum terdaftar dan mengisi
 *   form pendaftaran warga baru; langsung dianggap terverifikasi.
 * Reset saat warga klik "Ganti NIK" / logout dari sesi Layanan Surat.
 */
export const useResidentVerificationStore = defineStore("residentVerification", {
  state: () => ({
    nik: "",
    isVerified: false,
    resident: null, // { fullName, placeOfBirth, dateOfBirth, fullAddress, whatsappNumber, occupation }
  }),
  actions: {
    setNik(nik) {
      this.nik = nik;
    },
    verifyNik() {
      const found = findResidentByNik(this.nik.trim());
      if (found) {
        this.isVerified = true;
        this.resident = found;
        return true;
      }
      this.isVerified = false;
      this.resident = null;
      return false;
    },
    registerNewResident(payload) {
      // TODO(BE): simpan data warga baru ke database kependudukan
      // sungguhan. Untuk saat ini dianggap langsung tervalidasi.
      this.resident = { nik: this.nik, ...payload };
      this.isVerified = true;
      return this.resident;
    },
    reset() {
      this.$reset();
    },
  },
});
