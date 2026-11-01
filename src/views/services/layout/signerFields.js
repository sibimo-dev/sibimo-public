/* Field NAMA PENANDATANGAN (opsional) untuk surat yang punya kolom tanda tangan.
   Dipakai di `sections` tiap surat:  signerSection(["hamletHead", ["officer", "Nama Petugas Registrasi"]])
   - Semua isian OPSIONAL: boleh dikosongkan, petugas/admin bisa melengkapi nanti.
   - Kunci (key) sama di semua surat, jadi isian otomatis antar surat (aliases/paket) ikut bekerja.
   - Semua penandatangan dibuatkan field (pemohon, dukuh, camat, petugas, notaris, dst.) KECUALI Lurah
     (termasuk Kepala Desa / "Mengetahui Lurah"): namanya diisi sistem/petugas, jadi TIDAK ada rolenya di
     SIGNERS. Memakai role Lurah akan error "Peran penandatangan tidak dikenal".
   - Pemohon (role "applicant") = nama pemohon dari NIK yang PERTAMA dicari/diinput: terisi otomatis dari data warga
     terverifikasi (atau, bila NIK belum terdaftar, dari nama yang diketik pemohon; lihat BundleWizard). Field-nya
     ditandai `applicantSigner: true`. Tetap bisa dikoreksi; setelah diedit tidak ditimpa lagi. Pada KIA, pemohon
     (orang tua/wali) = orang yang NIK-nya dicari pertama, BUKAN anak. "applicantManual" (diisi manual) masih tersedia
     bila suatu surat memang butuh penandatangan bebas. Penanda tangan yang namanya SUDAH
     ada di isian surat (penerima kuasa, pihak pertama/kedua, saksi) tidak diulang di sini.
   - Blade PDF membaca kunci ini; bila kosong, garis tanda tangan dibiarkan tanpa nama. */
import { f } from "@/data/letterFields";

export const SIGNERS = {
  hamletHead: { key: "hamletHeadName", label: "Nama Dukuh" },
  districtHead: { key: "districtHeadName", label: "Nama Camat" },
  districtOfficer: { key: "districtOfficerName", label: "Nama Petugas Kecamatan" },
  officer: { key: "officerName", label: "Nama Petugas" },
  notary: { key: "notaryName", label: "Nama Notaris" },
  rtHead: { key: "rtHeadName", label: "Nama Ketua RT" },
  rwHead: { key: "rwHeadName", label: "Nama Ketua RW" },
  witness1: { key: "witness1Name", label: "Nama Saksi I" },
  witness2: { key: "witness2Name", label: "Nama Saksi II" },
  applicant: { key: "applicantName", label: "Nama Pemohon", from: "fullName" }, // terisi otomatis dari data warga
  // Pemohon yang ttd bisa orang lain (mis. anak pada KIA): diisi manual, TIDAK otomatis dari data pemohon
  applicantManual: { key: "applicantName", label: "Nama Pemohon" },
  applicantNik: { key: "applicantNik", label: "NIK Pemohon", type: "nik" },
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
      return f[s.type ?? "text"](key ?? s.key, label ?? s.label, {
        optional: true,
        ...(s.from ? { from: s.from } : {}),
        ...(role === "applicant" ? { applicantSigner: true } : {}), // diikutkan ke nama pemohon dari NIK pertama
      });
    }),
  };
}
