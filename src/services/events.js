import api from "./api";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function parseDateSafe(dateString) {
  if (!dateString) return new Date();
  const datePart = dateString.split("T")[0]; // buang bagian jam kalau ada (mis. "2026-09-06T00:00:00.000000Z")
  const [year, month, day] = datePart.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatTime(t) {
  if (!t) return "";
  return t.slice(0, 5).replace(":", "."); // "09:00:00" -> "09.00"
}

function mapAgendaItem(agenda, index) {
  const date = parseDateSafe(agenda.event_date);
  return {
    no: index + 1,
    day: DAY_NAMES[date.getDay()],
    date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    time: agenda.end_time ? `${formatTime(agenda.start_time)} - ${formatTime(agenda.end_time)}` : formatTime(agenda.start_time),
    event: agenda.title,
    place: agenda.location || "-",
    attendee: agenda.attendee || "Seluruh Warga",
    _eventDate: agenda.event_date,
  };
}

// kelompokkan list flat dari backend jadi struktur per-bulan
// yang sama persis dengan bentuk agendaMonths dummy sebelumnya
function groupByMonth(agendas) {
  const sorted = [...agendas].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  const groups = new Map();

  sorted.forEach((agenda) => {
    const d = parseDateSafe(agenda.event_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        monthLabel: MONTH_NAMES[d.getMonth()],
        year: d.getFullYear(),
        dayHighlight: String(d.getDate()).padStart(2, "0"),
        title: `Agenda ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        location: "Kalurahan Bimomartani",
        excerpt: "",
        items: [],
      });
    }
    groups.get(key).items.push(agenda);
  });

  return Array.from(groups.values()).map((group) => {
    const itemTitles = group.items.slice(0, 3).map((a) => a.title).join(", ");
    return {
      ...group,
      excerpt: itemTitles ? `${itemTitles}, dan agenda lainnya.` : "Belum ada agenda pada bulan ini.",
      items: group.items.map(mapAgendaItem),
    };
  });
}

let cache = null;

export async function fetchAgendaMonths() {
  const res = await api.get("/agendas");
  cache = groupByMonth(res.data.data);
  return cache;
}

export function getAgendaMonthsSync() {
  return cache || [];
}

export function getMonthByKey(key) {
  return (cache || []).find((m) => m.key === key);
}