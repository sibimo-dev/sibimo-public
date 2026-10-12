/* Kode backend canonical untuk surat yang boleh diajukan online.
   Kode `LetterWizard` lama sengaja tidak dipakai sebagai identitas API karena
   beberapa form memakai kode tampilan yang berbeda dari letter_types backend. */
export const ONLINE_LETTER_MAP = {
  "divorce-lawsuit-letter": { code: "SGC" },
  "family-biodata": { code: "FBWNI" },
  "fuel-recommendation-letter": { code: "SRBBM" },
  "kia-application-form": { code: "SPKIA" },
  "ktp-application-form": { code: "SPKTP" },
  "population-occurrence-registration": { code: "SPKIAF" },
  "relocation-certificate-form": { code: "SPPWF" },
  "relocation-cover-letter": { code: "SPPWNI" },
  "resident-arrival-form": { code: "SKDT" },
  "temporary-resident-request": { code: "SKTS" },
  "temporary-stay-application-form": { code: "SPTTS" },

  "heir-power-of-attorney-letter": { code: "SKWKA" },
  "identity-discrepancy-statement-letter": { code: "SPBNI" },
  "population-document-statement-letter": { code: "SPTMDK" },
  "population-service-authorization-letter": { code: "SKDPAK" },
  "statement-population-data-change": { code: "SPDP" },
  "unregistered-marriage-responsibility-letter": { code: "SPTJP" },

  "bussiness-permit-letter": { code: "SKU" },
  "domicile-certificate": { code: "SKD" },
  "event-permit-letter": { code: "SKK" },
  "general-statement-letter": { code: "SKUM" },
  "income-permit-letter": { code: "SKP" },
  "legalization-register": { code: "RL" },
  "skck-referral-letter": { code: "SKCK" },
  "sktm-general": { code: "SKTM" },
  "sktm-school": { code: "SKTMS" },
  "travel-permit-letter-gov": { code: "SKJG" },
  "unmarried-status-letter": { code: "SKBK" },

  "bride-groom-consent-letter": { code: "SPCCP" },
  "death-certificate-for-marriage-letter": { code: "SKKMP" },
  "general-certificate-letter": { code: "SKUMN" },
  "marriage-application-letter": { code: "SPNIK" },
  "marriage-introduction-letter": { code: "SPNIP" },
  "marriage-lodging-certificate-letter": { code: "SKTNB" },
  "marriage-registration-data-sheet": { code: "FPDN" },
  "never-married-certificate-letter": { code: "SKBKN" },
  "not-remarried-statement-letter": { code: "SPBML" },
  "parental-consent-letter": { code: "SPOT" },

  "land-origin-certificate-letter": { code: "SKTA" },
  "land-price-certificate-letter": { code: "SKTH" },
  "letter-c-data-statement-letter": { code: "SPKLC" },
  "power-of-attorney-letter": { code: "SKC" },

  "general-cover-letter": { code: "SPU" },
  "marriage-certificate-duplicate-letter": { code: "SKDN" },

  // Paket akta kelahiran.
  "birth-attestation-letter": { code: "SKKL" },
  "birth-certificate-application-form": { code: "PAK" },
  "birth-certificate-power-of-attorney": { code: "SKAK" },
  "birth-certificate-referral-letter": { code: "SPAKL" },
  "birth-registration-report": { code: "LPKL" },
  "birth-report-form": { code: "FPK" },
  "birth-report-statement": { code: "LK" },
  "late-birth-registration-approval-decree": { code: "PPKT" },
  "out-of-domicile-birth-report": { code: "LKLD" },
  "spousal-relationship-responsibility-statement": { code: "SPTJMPSI" },

  // Paket akta kematian. Perhitungan selamatan tetap tidak dipublikasikan.
  "death-certificate": { code: "SKKM" },
  "death-certificate-application": { code: "DKA" },
  "death-data-statement": { code: "DKS" },
  "death-general-statement": { code: "DKU" },
  "death-power-of-attorney": { code: "DKP" },
  "death-registration-report": { code: "DKC" },
  "death-report": { code: "DKR" },
  "death-report-form": { code: "DKF" },

  // Paket nikah perempuan.
  "guardian-statement": { code: "SKWNP" },
  "health-referral": { code: "SPTKP" },
  "judge-guardian": { code: "SKWHP" },
  "marriage-lodging": { code: "SKNNP" },
  "n1": { code: "N1P" },
  "n2": { code: "N2P" },
  "n4": { code: "N4P" },
  "n5": { code: "N5P" },
  "n6": { code: "N6P" },
  "registration-form": { code: "PNP" },
  "unmarried-certificate": { code: "SKBK2" },
  "unmarried-statement": { code: "SPBMLP" },
};

export const getOnlineLetterConfig = (slug) => ONLINE_LETTER_MAP[String(slug ?? "")] ?? null;
export const isOnlineLetter = (slug) => Boolean(getOnlineLetterConfig(slug));
