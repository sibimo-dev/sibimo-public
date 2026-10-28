const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const pdfText = (value) => String(value ?? "")
  // Helvetica bawaan PDF tidak mendukung seluruh Unicode. Karakter umum
  // Indonesia tetap aman; karakter lain diganti agar PDF tetap valid.
  .replace(/[^\x20-\x7E]/g, "?")
  .replace(/\\/g, "\\\\")
  .replace(/\(/g, "\\(")
  .replace(/\)/g, "\\)");

const safeFilePart = (value) => String(value ?? "")
  .normalize("NFKD")
  .replace(/[^\w\s.-]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .slice(0, 100) || "pengajuan-surat";

function wrapText(value, maxLength = 82) {
  const words = String(value ?? "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > maxLength) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function formatDateTime(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = monthNames[date.getMonth()] ?? "";
  const year = date.getFullYear();
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
  return `${day} ${month} ${year}, ${time} WIB`;
}

function buildPdf(lines) {
  const streamLines = [
    "BT",
    "/F1 18 Tf",
    "72 770 Td",
    `(${pdfText(lines[0])}) Tj`,
    "/F1 11 Tf",
  ];
  for (const line of lines.slice(1)) {
    streamLines.push("0 -24 Td", `(${pdfText(line)}) Tj`);
  }
  streamLines.push("ET");
  const stream = streamLines.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];

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
  return new Blob([pdf], { type: "application/pdf" });
}

export function downloadSubmissionInvoice({ entries = [], senderName, documentTitle, submittedAt = new Date() }) {
  const normalizedEntries = entries.filter((entry) => entry?.code).map((entry) => ({
    code: entry.code,
    title: entry.title || documentTitle || "Surat",
  }));
  if (!normalizedEntries.length) return false;

  const title = documentTitle || normalizedEntries[0].title;
  const lines = [
    "BUKTI PENGAJUAN SURAT",
    "KALURAHAN BIMOMARTANI",
    "",
    ...wrapText(`Nama Surat: ${title}`),
    ...wrapText(`Nama Pengirim: ${senderName || "Pemohon"}`),
    "",
    ...(normalizedEntries.length === 1
      ? [`Nomor Request: ${normalizedEntries[0].code}`]
      : ["Nomor Request:", ...normalizedEntries.flatMap((entry, index) => wrapText(`${index + 1}. ${entry.code} - ${entry.title}`))]),
    `Tanggal & Waktu Kirim: ${formatDateTime(submittedAt)}`,
    "",
  ].flatMap((line) => wrapText(line));

  const blob = buildPdf(lines);
  const firstCode = safeFilePart(normalizedEntries[0].code);
  const fileName = `${firstCode}-${safeFilePart(title)}.pdf`;
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
