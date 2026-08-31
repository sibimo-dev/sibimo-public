import { defineStore } from "pinia";
import { getLetterServiceBySlug, getRequiredDocuments } from "@/data/letterServices";

const STORAGE_KEY = "sibimo:letterApplication";

function loadPersistedState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    if (parsed.personalData?.birthDate) {
      parsed.personalData.birthDate = new Date(parsed.personalData.birthDate);
    }

    return parsed;
  } catch (error) {
    console.warn("Gagal membaca letterApplication dari sessionStorage:", error);
    return null;
  }
}

function persistState(state) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        letterType: state.letterType,
        personalData: state.personalData,
        economicData: state.economicData,
        agreementConfirmed: state.agreementConfirmed,
      }),
    );
  } catch (error) {
    console.warn("Gagal menyimpan letterApplication ke sessionStorage:", error);
  }
}

const DB_NAME = "sibimo-letter-application";
const DB_VERSION = 1;
const OBJECT_STORE = "documents";
const DOCS_RECORD_KEY = "documents-by-letter-type";

function openDocumentsDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB tidak didukung di browser ini."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(OBJECT_STORE)) {
        request.result.createObjectStore(OBJECT_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGetDocumentsMap() {
  try {
    const db = await openDocumentsDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(OBJECT_STORE, "readonly");
      const req = tx.objectStore(OBJECT_STORE).get(DOCS_RECORD_KEY);
      req.onsuccess = () => resolve(req.result ?? {});
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn("Gagal membaca dokumen dari IndexedDB:", error);
    return {};
  }
}

async function idbSaveDocumentsMap(map) {
  try {
    const db = await openDocumentsDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(OBJECT_STORE, "readwrite");
      tx.objectStore(OBJECT_STORE).put(map, DOCS_RECORD_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn("Gagal menyimpan dokumen ke IndexedDB:", error);
  }
}

async function idbClearDocuments() {
  try {
    const db = await openDocumentsDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(OBJECT_STORE, "readwrite");
      tx.objectStore(OBJECT_STORE).delete(DOCS_RECORD_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn("Gagal menghapus dokumen dari IndexedDB:", error);
  }
}

const DEFAULT_PERSONAL_DATA = {
  fullName: "",
  nationalId: "",
  familyCardNumber: "",
  gender: "Laki-laki",
  birthPlace: "",
  birthDate: "",
  phoneNumber: "",
  occupation: "",
  education: "SMA/SMK",
  maritalStatus: "Belum Kawin",
  religion: "Islam",
  address: "",
  ktpAddress: "",
  applicationPurpose: "",
};

const DEFAULT_ECONOMIC_DATA = {
  monthlyIncome: null,
  dependentsCount: null,
  economicNotes: "",
};

export const useLetterApplicationStore = defineStore("letterApplication", {
  state: () => {
    const persisted = loadPersistedState();
    return {
      letterType: persisted?.letterType ?? null,
      personalData: {
        ...DEFAULT_PERSONAL_DATA,
        ...(persisted?.personalData ?? {}),
      },
      economicData: {
        ...DEFAULT_ECONOMIC_DATA,
        ...(persisted?.economicData ?? {}),
      },
      // Diisi ulang secara asinkron dari IndexedDB lewat hydrateDocuments().
      // Mulai kosong dulu karena membaca IndexedDB butuh Promise, sedangkan
      // state() Pinia harus sinkron.
      documents: {},
      documentsHydrated: false,
      agreementConfirmed: persisted?.agreementConfirmed ?? false,
      applicationId: null,
      submittedAt: null,
    };
  },
  getters: {
    currentService(state) {
      return getLetterServiceBySlug(state.letterType);
    },
    requiredDocuments(state) {
      return getRequiredDocuments(state.letterType);
    },
    isPersonalDataValid(state) {
      const data = state.personalData;
      const requiredFilled = Boolean(
        data.fullName.trim() &&
          /^\d{16}$/.test(data.nationalId.trim()) &&
          data.familyCardNumber.trim() &&
          data.gender &&
          data.birthPlace.trim() &&
          data.birthDate &&
          data.phoneNumber.trim().length >= 9 &&
          data.occupation.trim() &&
          data.address.trim() &&
          data.ktpAddress.trim() &&
          data.applicationPurpose.trim(),
      );

      if (!requiredFilled) return false;

      if (this.currentService?.requiresEconomicData) {
        const economic = state.economicData;
        return Boolean(
          economic.monthlyIncome !== null &&
            economic.monthlyIncome !== "" &&
            economic.dependentsCount !== null &&
            economic.dependentsCount !== "" &&
            economic.economicNotes.trim(),
        );
      }

      return true;
    },
    isDocumentsComplete(state) {
      return this.requiredDocuments.every((doc) => Boolean(state.documents[doc.key]));
    },
  },
  actions: {
    setLetterType(type) {
      this.letterType = type;
      persistState(this);
    },
    updatePersonalData(payload) {
      this.personalData = { ...this.personalData, ...payload };
      persistState(this);
    },
    updateEconomicData(payload) {
      this.economicData = { ...this.economicData, ...payload };
      persistState(this);
    },
    setDocument(key, file) {
      this.documents[key] = file;
      this.persistDocuments();
    },
    removeDocument(key) {
      delete this.documents[key];
      this.persistDocuments();
    },
    // Simpan seluruh dokumen milik letterType saat ini ke IndexedDB.
    // Dipanggil setiap kali dokumen ditambah/dihapus.
    async persistDocuments() {
      if (!this.letterType) return;
      const map = await idbGetDocumentsMap();
      map[this.letterType] = { ...this.documents };
      await idbSaveDocumentsMap(map);
    },
    // Ambil kembali dokumen (File asli) milik letterType saat ini dari
    // IndexedDB. Panggil ini sekali saat halaman unggah dokumen dibuka
    // (mis. di onMounted ApplyLetterLayout.vue / ApplyDocuments.vue),
    // supaya dokumen yang sudah diunggah sebelumnya tetap ada walau
    // halaman di-refresh.
    async hydrateDocuments() {
      if (!this.letterType || this.documentsHydrated) return;
      const map = await idbGetDocumentsMap();
      const restored = map[this.letterType];
      if (restored && Object.keys(this.documents).length === 0) {
        this.documents = restored;
      }
      this.documentsHydrated = true;
    },
    setAgreementConfirmed(value) {
      this.agreementConfirmed = value;
      persistState(this);
    },
    submitApplication() {
      this.applicationId = `SBM-${Date.now().toString().slice(-8)}`;
      this.submittedAt = new Date();
      return this.applicationId;
    },
    reset() {
      this.$reset();
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
      idbClearDocuments();
    },
  },
}); 