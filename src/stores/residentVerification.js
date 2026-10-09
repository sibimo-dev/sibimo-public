import { defineStore } from "pinia";
import { findResidentByNik } from "@/data/registeredResidents";

const STORAGE_KEY = "sibimo:residentVerification";

function loadPersistedState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Gagal membaca residentVerification dari sessionStorage:", error);
    return null;
  }
}

function persistState(state) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        nik: state.nik,
        isVerified: state.isVerified,
        resident: state.resident,
      }),
    );
  } catch (error) {
    console.warn("Gagal menyimpan residentVerification ke sessionStorage:", error);
  }
}

export const useResidentVerificationStore = defineStore("residentVerification", {
  state: () => {
    const persisted = loadPersistedState();
    return {
      nik: persisted?.nik ?? "",
      isVerified: persisted?.isVerified ?? false,
      resident: persisted?.resident ?? null,
    };
  },
  actions: {
    setNik(nik) {
      this.nik = nik;
      persistState(this);
    },
    verifyNik() {
      const found = findResidentByNik(this.nik.trim());
      if (found) {
        this.isVerified = true;
        this.resident = found;
        persistState(this);
        return true;
      }
      this.isVerified = false;
      this.resident = null;
      persistState(this);
      return false;
    },
    registerNewResident(payload) {
      this.resident = { nik: this.nik, ...payload };
      this.isVerified = true;
      persistState(this);
      return this.resident;
    },
    reset() {
      this.$reset();
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});