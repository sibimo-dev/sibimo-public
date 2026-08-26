import { defineStore } from "pinia";

/**
 * Holds the Submit Letter form state across all 3 steps (Personal Data ->
 * Upload Document -> Confirmation) so it isn't lost when navigating between
 * routes. Reset when the application is submitted successfully or the user
 * cancels.
 */
export const useLetterApplicationStore = defineStore("letterApplication", {
  state: () => ({
    letterType: null, // letter type slug, e.g. "sktm"
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
    documents: {
      // key = document requirement id (differs per letter type), value = File
    },
    agreementConfirmed: false,
  }),
  actions: {
    setLetterType(type) {
      this.letterType = type;
    },
    updatePersonalData(payload) {
      this.personalData = { ...this.personalData, ...payload };
    },
    setDocument(key, file) {
      this.documents[key] = file;
    },
    reset() {
      this.$reset();
    },
  },
});
