import { defineStore } from "pinia";

const STORAGE_KEY = "sibimo:submissionCheck";

function loadPersistedState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
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
        requestCode: state.requestCode,
        items: state.items,
        checkedAt: state.checkedAt,
      }),
    );
  } catch {

  }
}


export const useSubmissionCheckStore = defineStore("submissionCheck", {
  state: () => ({
    nik: "",
    requestCode: "",
    items: [],
    checkedAt: 0,
    ...(loadPersistedState() ?? {}),
  }),
  getters: {
    hasResult: (state) => state.items.length > 0,
    maskedNik: (state) => (state.nik ? `${"•".repeat(12)}${state.nik.slice(-4)}` : ""),
  },
  actions: {
    setResult({ nik, requestCode, items }) {
      this.nik = nik;
      this.requestCode = requestCode;
      this.items = items;
      this.checkedAt = Date.now();
      persistState(this);
    },
    updateItems(items) {
      this.items = items;
      this.checkedAt = Date.now();
      persistState(this);
    },
    clear() {
      this.nik = "";
      this.requestCode = "";
      this.items = [];
      this.checkedAt = 0;
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // abaikan
        }
      }
    },
  },
});