import publicService from "./publicService";

/* ============ MODE CONTOH (sementara, untuk cek tampilan tanpa backend) ============
   Aktif otomatis selama `npm run dev` (tidak ikut ke hasil `npm run build`).
   Kalau sudah selesai mengecek, ubah baris di bawah jadi:
     const USE_MOCK = false;
   atau kembalikan file ini ke versi aslinya. */
const USE_MOCK = import.meta.env.DEV;

const normalizeCode = (value) => String(value ?? "").trim().toUpperCase();

// Satu ID pengajuan = satu pengajuan. Walau backend mengirim semua pengajuan milik NIK,
// yang ditampilkan hanya yang cocok dengan ID yang dimasukkan.
function onlyRequested(items, requestCode) {
  const code = normalizeCode(requestCode);
  const exact = items.find((item) => normalizeCode(item.request_code) === code);
  if (exact) return [exact];

  const flagged = items.find((item) => item.is_queried);
  if (flagged) return [flagged];

  return items.length === 1 ? items : [];
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Satu ID = satu pengajuan. Status contoh ditentukan dari angka terakhir ID,
// supaya semua tampilan bisa dicoba cukup dengan mengganti ID:
//   ...-001 menunggu verifikasi   ...-002 terverifikasi   ...-003 siap diunduh
//   ...-004 selesai               ...-005 ditolak         ...-006 disetujui, PDF belum ada
// ID lain (atau tanpa angka) dianggap ...-001.
function buildMockItem(requestCode) {
  const code = String(requestCode || "REQ-20260930-001").trim();
  const last = Number(code.match(/(\d+)\D*$/)?.[1] ?? 1) % 10;

  const base = {
    request_code: code,
    is_queried: true,
    submitted_at: "2026-09-28T08:15:00+07:00",
    can_download: false,
  };
  const verified = { verified_at: "2026-09-28T13:30:00+07:00" };
  const authorized = { ...verified, authorized_at: "2026-09-29T09:20:00+07:00" };

  switch (last) {
    case 2:
      return {
        ...base, ...verified, status: "verified",
        letter_type: { name: "SKTM Umum", category: "Keterangan", processing_time: "2-3 hari kerja" },
      };
    case 3:
      return {
        ...base, ...authorized, status: "authorized", letter_number: "470/74", can_download: true,
        letter_type: { name: "Surat Keterangan Domisili", category: "Keterangan" },
      };
    case 4:
      return {
        ...base, ...authorized, status: "completed", letter_number: "581/12", can_download: true,
        completed_at: "2026-09-30T09:00:00+07:00",
        letter_type: { name: "Surat Pengantar SKCK", category: "Pengantar" },
      };
    case 5:
      return {
        ...base, ...verified, status: "rejected",
        rejection_reason: "Foto KTP tidak terbaca. Silakan ajukan ulang dengan foto yang lebih jelas.",
        letter_type: { name: "Surat Keterangan Penghasilan", category: "Keterangan" },
      };
    case 6:
      return {
        ...base, ...authorized, status: "authorized",
        letter_type: { name: "Surat Keterangan Kelahiran", category: "Kependudukan" },
      };
    default:
      return {
        ...base, status: "submitted",
        letter_type: { name: "Surat Keterangan Usaha", category: "Keterangan", processing_time: "1-2 hari kerja" },
      };
  }
}

// PDF contoh satu halaman, dibuat di browser supaya Pratinjau & Unduh bisa dicoba.
function buildMockPdf(requestCode) {
  const text = `CONTOH SURAT - ${requestCode}`.replace(/[()\\]/g, "");
  const stream = `BT /F1 18 Tf 72 740 Td (${text}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefAt = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export async function lookupSubmissions({ nik, requestCode }) {
  if (USE_MOCK) {
    console.info("[SIBIMO] Cek Pengajuan memakai DATA CONTOH (mode mock aktif).");
    await wait(600);
    return [buildMockItem(requestCode)];
  }

  const res = await publicService.lookupLetterRequests({ nik, requestCode });
  const data = res.data?.data;
  return onlyRequested(Array.isArray(data) ? data : [], requestCode);
}

export async function fetchSubmissionPdf({ requestCode, nik, download = false }) {
  if (USE_MOCK) {
    await wait(400);
    return buildMockPdf(requestCode);
  }

  const res = await publicService.getLetterRequestPdf({ requestCode, nik, download });
  return res.data;
}

export async function getSubmissionErrorMessage(error, fallback = "Terjadi kesalahan. Coba lagi.") {
  const response = error?.response;

  if (!response) {
    return error?.code === "ECONNABORTED"
      ? "Server terlalu lama merespons. Coba lagi sebentar lagi."
      : "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
  }

  if (response.status === 429) {
    return "Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.";
  }

  let data = response.data;
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    try {
      data = JSON.parse(await data.text());
    } catch {
      data = null;
    }
  }

  if (response.status === 404 && data?.success !== false) {
    return "Layanan Cek Pengajuan belum tersedia di server.";
  }

  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }

  return data?.message || fallback;
}