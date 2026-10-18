/* Field NAMA PENANDATANGAN (opsional) untuk surat yang punya kolom tanda tangan.
   Dipakai di `sections` tiap surat:  signerSection(["hamletHead", ["officer", "Nama Petugas Registrasi"]])
   - Semua isian OPSIONAL: boleh dikosongkan, petugas/admin bisa melengkapi nanti.
   - Kunci (key) sama di semua surat, jadi isian otomatis antar surat (aliases/paket) ikut bekerja.
   - Pemohon (role "applicant") terisi otomatis dari data warga. Hanya dipakai di surat yang pemohonnya
     memang menandatangani. Penanda tangan yang namanya SUDAH ada di isian surat (penerima kuasa,
     pihak pertama/kedua, saksi) tidak diulang di sini.
   - Blade PDF membaca kunci ini; bila kosong, garis tanda tangan dibiarkan tanpa nama. */
import { f } from "@/data/letterFields";

export const SIGNERS = {
  hamletHead: { key: "hamletHeadName", label: "Nama Dukuh" },
  districtHead: { key: "districtHeadName", label: "Nama Camat" },
  villageOfficer: { key: "villageOfficerName", label: "Nama Lurah/Petugas Kalurahan" },
  villageHead: { key: "villageHeadName", label: "Nama Kepala Desa" },
  districtOfficer: { key: "districtOfficerName", label: "Nama Petugas Kecamatan" },
  officer: { key: "officerName", label: "Nama Petugas" },
  notary: { key: "notaryName", label: "Nama Notaris" },
  rtHead: { key: "rtHeadName", label: "Nama Ketua RT" },
  rwHead: { key: "rwHeadName", label: "Nama Ketua RW" },
  witness1: { key: "witness1Name", label: "Nama Saksi I" },
  witness2: { key: "witness2Name", label: "Nama Saksi II" },
  applicant: { key: "applicantName", label: "Nama Pemohon", from: "fullName" }, // terisi otomatis dari data warga
  reporter: { key: "reporterName", label: "Nama Pelapor" },
  attorney: { key: "attorneyName", label: "Nama Yang Diberi Kuasa" },
};

/* roles: "hamletHead" atau ["officer", "Label khusus surat ini", "kunciKhusus"].
   Kunci khusus dipakai bila blade surat itu sudah membaca nama variabel sendiri
   (mis. registrationOfficer, applicantSignerName, headName). */
export function signerSection(roles) {
  return {
    title: "Nama Penandatangan (Opsional)",
    hint: "Isi bila nama penandatangan sudah diketahui. Boleh dikosongkan; akan dilengkapi petugas.",
    fields: roles.map((r) => {
      const [role, label, key] = Array.isArray(r) ? r : [r];
      const s = SIGNERS[role];
      if (!s) throw new Error(`[signerFields] Peran penandatangan tidak dikenal: ${role}`);
      return f.text(key ?? s.key, label ?? s.label, { optional: true, ...(s.from ? { from: s.from } : {}) });
    }),
  };
}
