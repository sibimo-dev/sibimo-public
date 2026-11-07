/**
 * Bukti Pengajuan Surat (PDF).
 *
 * PDF dirangkai langsung tanpa library tambahan (vektor + font bawaan PDF),
 * jadi tidak menambah ukuran bundle. Seluruh koordinat layout ditulis dalam
 * "px desain" (lebar halaman 924 px, mengikuti mockup) lalu dikonversi ke
 * poin PDF (A4 = 595 x 842 pt) lewat skala S.
 *
 * Warna mengikuti navbar/footer situs (primary-900 -> primary-800) dan
 * aksen emas `secondary` dari theme/sibimoPreset.js.
 */

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/* ---------- Palet (sinkron dengan sibimoPreset.js) ---------- */
const COLOR = {
  navy: "#22314f", // primary-900
  navyTint: "#e8edf4",
  gold: "#c9a227", // secondary
  heading: "#212525",
  text: "#434c4f",
  muted: "#707d81",
  border: "#e2e6e8",
  boxWarm: "#faf9f6",
  boxGray: "#f6f8f9",
  white: "#ffffff",
};

/* ---------- Ukuran halaman & skala ---------- */
const PAGE_W = 595;
const PAGE_H = 842;
const S = PAGE_W / 924; // px desain -> pt
const REF_H = PAGE_H / S;
const MARGIN = 56; // px desain
const RIGHT = 868; // tepi kanan konten (px desain)
const FOOTER_LINE_Y = 1250;
const TOP_SHIFT = 120; // ruang atas setelah header dihapus
const CONTENT_BOTTOM = 1222 + TOP_SHIFT; // batas bawah konten (koordinat konten) sebelum footer

const BRAND = {
  site: "bimomartani.id",
};

/* ---------- Lebar glyph font bawaan PDF (AFM, ASCII 32-126) ---------- */
const AFM = {
  F1: [ // Helvetica
    278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
    556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015,
    667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611,
    278, 278, 278, 469, 556, 333,
    556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500,
    334, 260, 334, 584,
  ],
  F2: [ // Helvetica-Bold
    278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
    556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975,
    722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611,
    333, 278, 333, 584, 556, 333,
    556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500,
    389, 280, 389, 584,
  ],
  F3: [ // Times-Bold
    250, 333, 555, 500, 500, 1000, 833, 278, 333, 333, 500, 570, 250, 333, 250, 278,
    500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 333, 333, 570, 570, 570, 500, 930,
    722, 667, 722, 722, 667, 611, 778, 778, 389, 500, 778, 667, 944, 722, 778, 611, 778, 722, 556, 667, 722, 722, 1000, 722, 722, 667,
    333, 278, 333, 581, 500, 333,
    500, 556, 444, 556, 444, 333, 500, 556, 278, 333, 556, 278, 833, 556, 500, 556, 556, 444, 389, 333, 556, 500, 722, 500, 500, 444,
    394, 220, 394, 520,
  ],
};
const MONO = new Set(["F4", "F5"]); // Courier: lebar tetap 600

/* ---------- Util teks ---------- */
const pdfText = (value) => String(value ?? "")
  // Font bawaan PDF hanya mendukung ASCII dengan aman. Huruf beraksen diubah
  // ke huruf dasarnya; karakter lain yang tak dikenal diganti "?".
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013\u2014]/g, "-")
  .replace(/\s+/g, " ")
  .replace(/[^\x20-\x7E]/g, "?")
  .trim();

const escapePdf = (value) => value
  .replace(/\\/g, "\\\\")
  .replace(/\(/g, "\\(")
  .replace(/\)/g, "\\)");

const safeFilePart = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[^\w\s.-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .slice(0, 100) || "pengajuan-surat";

/** Lebar teks dalam px desain. */
function textWidth(value, font, sizePx) {
  if (MONO.has(font)) return value.length * 0.6 * sizePx;
  const table = AFM[font];
  let total = 0;
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    total += table[code - 32] ?? 556;
  }
  return (total / 1000) * sizePx;
}

/** Bungkus teks per kata sesuai lebar maksimum (px desain); kata terlalu panjang dipotong. */
function wrapByWidth(value, font, sizePx, maxWidth, maxLines = Infinity) {
  const words = pdfText(value).split(" ").filter(Boolean);
  const lines = [];
  let current = "";
  const push = (line) => { if (line) lines.push(line); };
  for (let word of words) {
    while (textWidth(word, font, sizePx) > maxWidth) {
      let cut = word.length - 1;
      while (cut > 1 && textWidth(word.slice(0, cut), font, sizePx) > maxWidth) cut -= 1;
      if (current) { push(current); current = ""; }
      push(word.slice(0, cut));
      word = word.slice(cut);
    }
    const next = current ? `${current} ${word}` : word;
    if (current && textWidth(next, font, sizePx) > maxWidth) {
      push(current);
      current = word;
    } else {
      current = next;
    }
  }
  push(current);
  if (!lines.length) lines.push("");
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 1 && textWidth(`${last}...`, font, sizePx) > maxWidth) last = last.slice(0, -1);
    kept[maxLines - 1] = `${last}...`;
    return kept;
  }
  return lines;
}

/** Waktu dalam WIB (UTC+7) terlepas dari zona waktu perangkat. */
function wibParts(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const wib = new Date(date.getTime() + 7 * 3600 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${pad(wib.getUTCDate())} ${monthNames[wib.getUTCMonth()]} ${wib.getUTCFullYear()}`,
    time: `${pad(wib.getUTCHours())}:${pad(wib.getUTCMinutes())}:${pad(wib.getUTCSeconds())}`,
  };
}

/* ---------- Primitif gambar PDF ---------- */
const num = (n) => (Math.round(n * 100) / 100).toString();
const X = (x) => x * S;
let OFFSET = 0; // pergeseran vertikal (px desain); footer digambar dengan OFFSET = 0
const Y = (y) => PAGE_H - (y - OFFSET) * S;

function rgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => num(parseInt(h.slice(i, i + 2), 16) / 255)).join(" ");
}

/** Path persegi bulat; (x, y) = pojok kiri-atas dalam px desain. */
function roundRectPath(x, y, w, h, r) {
  const l = X(x);
  const b = Y(y + h);
  const W = w * S;
  const H = h * S;
  const R = Math.min(r * S, W / 2, H / 2);
  const k = R * 0.5523;
  const t = b + H;
  const rt = l + W;
  return [
    `${num(l + R)} ${num(b)} m`,
    `${num(rt - R)} ${num(b)} l`,
    `${num(rt - R + k)} ${num(b)} ${num(rt)} ${num(b + R - k)} ${num(rt)} ${num(b + R)} c`,
    `${num(rt)} ${num(t - R)} l`,
    `${num(rt)} ${num(t - R + k)} ${num(rt - R + k)} ${num(t)} ${num(rt - R)} ${num(t)} c`,
    `${num(l + R)} ${num(t)} l`,
    `${num(l + R - k)} ${num(t)} ${num(l)} ${num(t - R + k)} ${num(l)} ${num(t - R)} c`,
    `${num(l)} ${num(b + R)} l`,
    `${num(l)} ${num(b + R - k)} ${num(l + R - k)} ${num(b)} ${num(l + R)} ${num(b)} c`,
    "h",
  ].join("\n");
}

class Canvas {
  constructor() { this.ops = []; }

  rect(x, y, w, h, fill) {
    this.ops.push(`${rgb(fill)} rg ${num(X(x))} ${num(Y(y + h))} ${num(w * S)} ${num(h * S)} re f`);
  }

  round(x, y, w, h, r, { fill, stroke, lineWidth = 1, dash } = {}) {
    const ops = ["q", roundRectPath(x, y, w, h, r)];
    if (fill) ops.push(`${rgb(fill)} rg`);
    if (stroke) ops.push(`${rgb(stroke)} RG ${num(lineWidth * S)} w`);
    if (dash) ops.push(`[${dash.map((d) => num(d * S)).join(" ")}] 0 d`);
    ops.push(fill && stroke ? "B" : fill ? "f" : "S", "Q");
    this.ops.push(ops.join("\n"));
  }

  /** Persegi bulat berisi + pita samping (dipotong mengikuti sudut bulat). */
  roundWithBar(x, y, w, h, r, { fill, stroke, bar, barWidth }) {
    this.ops.push([
      "q",
      roundRectPath(x, y, w, h, r), "W n",
      `${rgb(fill)} rg ${num(X(x))} ${num(Y(y + h))} ${num(w * S)} ${num(h * S)} re f`,
      `${rgb(bar)} rg ${num(X(x))} ${num(Y(y + h))} ${num(barWidth * S)} ${num(h * S)} re f`,
      "Q",
    ].join("\n"));
    this.round(x, y, w, h, r, { stroke, lineWidth: 1 });
  }

  hline(x1, x2, y, color, width = 1) {
    this.ops.push(`${rgb(color)} RG ${num(width * S)} w ${num(X(x1))} ${num(Y(y))} m ${num(X(x2))} ${num(Y(y))} l S`);
  }

  /** align: "left" | "right" | "center"; (x, baseline) dalam px desain. */
  text(value, x, baseline, { font = "F1", size = 14, color = COLOR.text, align = "left" } = {}) {
    const str = pdfText(value);
    if (!str) return;
    const w = textWidth(str, font, size);
    const left = align === "right" ? x - w : align === "center" ? x - w / 2 : x;
    this.ops.push(`BT /${font} ${num(size * S)} Tf ${rgb(color)} rg ${num(X(left))} ${num(Y(baseline))} Td (${escapePdf(str)}) Tj ET`);
  }
}

/* ---------- Bagian-bagian halaman ---------- */
function drawFooter(c, pageNo, pageCount) {
  c.hline(0, 924, FOOTER_LINE_Y, COLOR.border);
  c.text("Dokumen ini dibuat otomatis oleh sistem dan sah tanpa tanda tangan basah.", MARGIN, 1284, { size: 13, color: COLOR.muted });
  c.text(BRAND.site, RIGHT - 1, 1284, { font: "F2", size: 13, color: COLOR.navy, align: "right" });
  if (pageCount > 1) {
    c.text(`Halaman ${pageNo} dari ${pageCount}`, RIGHT - 1, FOOTER_LINE_Y - 12, { size: 12, color: COLOR.muted, align: "right" });
  }
}

function drawTableHeader(c, y) {
  c.round(MARGIN, y, RIGHT - MARGIN, 44, 8, { fill: COLOR.navy });
  const base = y + 28;
  const style = { font: "F2", size: 14, color: COLOR.white };
  c.text("No", 72, base, style);
  c.text("Jenis surat", 137, base, style);
  c.text("Nomor request", 510, base, style);
  c.text("Status", 851, base, { ...style, align: "right" });
  return y + 44;
}

/* ---------- Penyusun PDF ---------- */
function assemblePdf(pageStreams) {
  const FONTS = ["Helvetica", "Helvetica-Bold", "Times-Bold", "Courier-Bold", "Courier"];
  const fontRefs = FONTS.map((_, i) => `/F${i + 1} ${3 + i} 0 R`).join(" ");
  const firstPageObj = 3 + FONTS.length;

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageStreams.map((_, i) => `${firstPageObj + i * 2} 0 R`).join(" ")}] /Count ${pageStreams.length} >>`,
    ...FONTS.map((name) => `<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`),
  ];
  pageStreams.forEach((stream, i) => {
    const contentObj = firstPageObj + i * 2 + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${contentObj} 0 R /Resources << /Font << ${fontRefs} >> >> >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    );
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefAt = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`;
  return pdf;
}

const DEFAULT_CATEGORY = "Layanan administrasi kependudukan";

/**
 * Menyusun PDF bukti pengajuan.
 * entries: [{ code, title, category? }]; category = keterangan di bawah nama surat.
 */
export function buildSubmissionInvoicePdf({ entries = [], senderName, senderInfo, documentTitle, submittedAt = new Date() } = {}) {
  const rows = entries.filter((entry) => entry?.code).map((entry) => ({
    code: pdfText(entry.code),
    title: entry.title || documentTitle || "Surat",
    category: entry.category || DEFAULT_CATEGORY,
  }));
  if (!rows.length) return null;

  const when = wibParts(submittedAt);
  const sender = pdfText(senderName) || "Pemohon";
  const firstCode = rows[0].code;
  const multiple = rows.length > 1;

  OFFSET = TOP_SHIFT;
  const pages = [];
  let c;
  const newPage = (withTableHeader = false) => {
    c = new Canvas();
    pages.push(c);
    return withTableHeader ? drawTableHeader(c, 190) : 190;
  };

  /* --- Halaman 1: judul, nomor request, pemohon, waktu --- */
  newPage();
  c.text("Bukti Pengajuan Surat", MARGIN, 220, { font: "F3", size: 36, color: COLOR.navy });
  c.text("Simpan dokumen ini untuk memantau dan mengambil surat Anda.", MARGIN, 250, { size: 14, color: COLOR.muted });

  c.round(768, 187, 99, 38, 19, { stroke: COLOR.navy, lineWidth: 1.5 });
  c.text("Diterima", 817.5, 211, { font: "F2", size: 14, color: COLOR.navy, align: "center" });

  c.roundWithBar(MARGIN, 289, RIGHT - MARGIN - 1, 150, 8, { fill: COLOR.boxWarm, stroke: COLOR.border, bar: COLOR.gold, barWidth: 6 });
  const reqShift = multiple ? 0 : 6; // tanpa baris tambahan, isi kotak diturunkan agar rata tengah
  c.text(multiple ? "Nomor request utama" : "Nomor request", 87, 346 + reqShift, { size: 14, color: COLOR.muted });
  c.text(firstCode, 87, 386 + reqShift, { font: "F4", size: 30, color: COLOR.navy });
  if (multiple) c.text(`+ ${rows.length - 1} nomor request lainnya pada tabel di bawah`, 87, 415, { size: 12.5, color: COLOR.muted });
  /* Pemohon & waktu */
  const colLeft = { x: MARGIN, w: 390 };
  const colRight = { x: 478, w: RIGHT - 478 };
  c.text("Diajukan oleh", colLeft.x, 490, { font: "F2", size: 13, color: COLOR.muted });
  c.hline(colLeft.x, colLeft.x + colLeft.w, 502, COLOR.border, 1.5);
  c.text("Waktu pengajuan", colRight.x, 490, { font: "F2", size: 13, color: COLOR.muted });
  c.hline(colRight.x, colRight.x + colRight.w, 502, COLOR.border, 1.5);

  const nameLines = wrapByWidth(sender, "F2", 19, colLeft.w, 2);
  let nameBase = 534;
  nameLines.forEach((line) => {
    c.text(line, colLeft.x, nameBase, { font: "F2", size: 19, color: COLOR.heading });
    nameBase += 24;
  });
  const infoBase = nameBase - 24 + 27;
  c.text(pdfText(senderInfo) || "-", colLeft.x, infoBase, { size: 14, color: COLOR.muted });

  c.text(when?.date ?? "-", colRight.x, 534, { font: "F2", size: 19, color: COLOR.heading });
  c.text(when ? `Pukul ${when.time} WIB` : "-", colRight.x, 561, { size: 14, color: COLOR.muted });

  /* --- Tabel --- */
  let y = drawTableHeader(c, Math.max(605, infoBase + 44));
  rows.forEach((row, index) => {
    const titleLines = wrapByWidth(row.title, "F1", 15, 353, 3);
    const categoryLines = wrapByWidth(row.category, "F1", 13, 353, 1);
    const rowH = 22 + titleLines.length * 20 + 3 + categoryLines.length * 20 + 12;
    if (y + rowH > CONTENT_BOTTOM) y = newPage(true);

    const first = y + 33;
    c.text(String(index + 1), 72, first, { size: 15, color: COLOR.text });
    titleLines.forEach((line, i) => c.text(line, 137, first + i * 20, { size: 15, color: COLOR.heading }));
    const subBase = first + (titleLines.length - 1) * 20 + 23;
    c.text(categoryLines[0], 137, subBase, { size: 13, color: COLOR.muted });
    c.text(row.code, 510, first, { font: "F5", size: 13, color: COLOR.heading });
    c.text("Diterima", 851, first, { font: "F2", size: 15, color: COLOR.navy, align: "right" });
    y += rowH;
    c.hline(MARGIN, RIGHT, y, COLOR.border, 1.5);
  });

  /* --- Ringkasan & langkah selanjutnya --- */
  const summaryH = 152 + 41 + 143;
  if (y + summaryH > CONTENT_BOTTOM) y = newPage(false);

  const sumTop = y + 45;
  c.text("Estimasi selesai", 421, sumTop, { size: 15, color: COLOR.text });
  c.text("1-3 hari kerja", RIGHT - 1, sumTop, { size: 15, color: COLOR.text, align: "right" });
  c.text("Biaya layanan", 421, sumTop + 37, { size: 15, color: COLOR.text });
  c.text("Gratis", RIGHT - 1, sumTop + 37, { size: 15, color: COLOR.text, align: "right" });
  c.round(421, sumTop + 57, RIGHT - 421 - 1, 50, 6, { fill: COLOR.navyTint });
  c.text("Kode untuk pelacakan", 440, sumTop + 89, { font: "F2", size: 15, color: COLOR.navy });
  c.text(multiple ? `${rows.length} nomor request` : firstCode, 849, sumTop + 89, { font: "F2", size: 15, color: COLOR.navy, align: "right" });

  const stepsTop = sumTop + 57 + 50 + 41;
  c.round(MARGIN, stepsTop, RIGHT - MARGIN - 1, 143, 8, { fill: COLOR.boxGray, stroke: COLOR.border });
  c.text("Langkah selanjutnya", 80, stepsTop + 36, { font: "F2", size: 15, color: COLOR.navy });
  [
    `1. Simpan atau cetak bukti ini dan jangan hilangkan nomor request.`,
    `2. Pantau status pengajuan di ${BRAND.site} dengan memasukkan nomor request.`,
    `3. Bila surat sudah selesai, tunjukkan bukti ini di kantor kalurahan untuk pengambilan.`,
  ].forEach((line, i) => c.text(line, 80, stepsTop + 65 + i * 26, { size: 14, color: COLOR.text }));

  OFFSET = 0;
  pages.forEach((page, i) => drawFooter(page, i + 1, pages.length));
  return new Blob([assemblePdf(pages.map((p) => p.ops.join("\n")))], { type: "application/pdf" });
}

export function downloadSubmissionInvoice({ entries = [], senderName, senderInfo, documentTitle, submittedAt = new Date() }) {
  const blob = buildSubmissionInvoicePdf({ entries, senderName, senderInfo, documentTitle, submittedAt });
  if (!blob) return false;

  const first = entries.find((entry) => entry?.code);
  const title = documentTitle || first.title || "Surat";
  const fileName = `${safeFilePart(first.code)}-${safeFilePart(title)}.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  return fileName;
}