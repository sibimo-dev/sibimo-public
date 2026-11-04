import { defineStore } from "pinia";
import { ref } from "vue";

const SESSION_KEY = "sibimo:registrationDraft";

function loadFromSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToSession(residentType, selectedDocs) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ residentType, selectedDocs }));
  } catch {
    // sessionStorage tidak tersedia (mode privat yang sangat ketat) → abaikan
  }
}

/* Draft pendaftaran warga baru. Isian & dokumen dikelola BundleWizard (RegisterWizardView);
   di sini hanya pilihan awal dari pop-up Verifikasi NIK.
   Data di-persist ke sessionStorage agar tidak hilang saat browser di-refresh. */
export const useRegistrationDraftStore = defineStore("registrationDraft", () => {
  const saved = loadFromSession();
  const residentType = ref(saved?.residentType ?? null); // "tetap" | "sementara" | "tinggal-sementara" (dipilih di pop-up Verifikasi NIK)
  const selectedDocs = ref(saved?.selectedDocs ?? []); // surat yang sudah tercentang saat halaman dibuka

  function set(type, docs = []) {
    residentType.value = type;
    selectedDocs.value = docs;
    saveToSession(type, docs);
  }

  function reset() {
    residentType.value = null;
    selectedDocs.value = [];
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }

  return { residentType, selectedDocs, set, reset };
});
