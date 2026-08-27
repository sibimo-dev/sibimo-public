import { defineStore } from "pinia";
import { getLetterServiceBySlug, getRequiredDocuments } from "@/data/letterServices";


export const useLetterApplicationStore = defineStore("letterApplication", {
  state: () => ({
    letterType: null, 
    personalData: {
      fullName: "",
      nationalId: "",
      placeOfBirth: "",
      dateOfBirth: "",
      whatsappNumber: "",
      occupation: "",
      fullAddress: "",
      applicationPurpose: "",
    },

    economicData: {
      monthlyIncome: null,
      dependentsCount: null,
      economicNotes: "",
    },
    documents: {
     
    },
    agreementConfirmed: false,
    applicationId: null,
    submittedAt: null,
  }),
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
          data.placeOfBirth.trim() &&
          data.dateOfBirth &&
          data.whatsappNumber.trim().length >= 9 &&
          data.occupation.trim() &&
          data.fullAddress.trim() &&
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
    },
    updatePersonalData(payload) {
      this.personalData = { ...this.personalData, ...payload };
    },
    updateEconomicData(payload) {
      this.economicData = { ...this.economicData, ...payload };
    },
    setDocument(key, file) {
      this.documents[key] = file;
    },
    removeDocument(key) {
      delete this.documents[key];
    },
    setAgreementConfirmed(value) {
      this.agreementConfirmed = value;
    },
    submitApplication() {
      this.applicationId = `SBM-${Date.now().toString().slice(-8)}`;
      this.submittedAt = new Date();
      return this.applicationId;
    },
    reset() {
      this.$reset();
    },
  },
});