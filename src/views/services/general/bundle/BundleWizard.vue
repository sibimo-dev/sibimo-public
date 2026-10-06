<script setup>
/* Wizard PAKET surat (banyak surat dalam 1 pengajuan). Dipakai juga oleh Pendaftaran Warga Baru (register)
   lewat `bundle.ui` (teks, tombol kembali, tombol selesai). 4 langkah tetap, berapa pun surat yang dipilih:
   1) Pilih Surat      : ceklis surat yang dibutuhkan
   2) Isian Surat      : data pemohon (terisi otomatis dari data warga) + isian KHUSUS tiap surat terpilih.
                         Step di dalam step: 1 surat = 1 halaman, lanjut ke surat berikutnya (tidak scroll panjang)
   3) Dokumen          : 1 halaman untuk SEMUA surat. Dokumen yang sama (KTP, KK, dst.) digabung dan cukup
                         diunggah sekali; file otomatis berlaku untuk setiap surat yang membutuhkannya
   4) Cek & Kirim      : cek ulang semua isian & dokumen → pernyataan dokumen asli → kirim

   Isian dipakai bersama antar surat: kunci field yang sama (dan pasangan kunci di `bundle.aliases`)
   terisi otomatis dari surat di atasnya, tetap bisa direvisi. */
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Message from "primevue/message";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import LetterFormFields from "@/views/services/layout/LetterFormFields.vue";
import DocUploader from "@/views/services/layout/DocUploader.vue";
import FileThumb from "@/views/services/layout/FileThumb.vue";
import FilePreviewDialog from "@/views/services/layout/FilePreviewDialog.vue";
import { copyText } from "@/views/services/layout/copyText";
import WizardStepper from "@/views/services/layout/WizardStepper.vue";
import { applyAliases, buildAliasIndex, display, fillForm, filledRows, fmtDate, normalizeDocs, validateDocs, validateFields, MAX_FILE_MB } from "@/views/services/layout/formLogic";
import { HUES, SECTION_HUES, hue } from "@/views/services/layout/pastel";

const props = defineProps({
  bundle: { type: Object, required: true }, // lihat bundles.js
  hue: { type: String, default: "" }, // warna kategori (permohonan = biru); kosong → warna bawaan paket
});

const router = useRouter();
const resident = useResidentVerificationStore();
const ui = computed(() => props.bundle.ui ?? {}); // penyesuaian teks/navigasi (dipakai register); kosong = tampilan paket
const hueName = computed(() => props.hue || props.bundle.hue);
const h = computed(() => hue(hueName.value));

/* ---------- Data bersama ---------- */
const NOTIF_SECTION = {
  title: "Kontak Notifikasi",
  hint: "Status verifikasi dan otorisasi surat akan dikirim melalui WhatsApp ke nomor ini.",
  fields: [{ key: "whatsapp", label: "Nomor WhatsApp", type: "text", from: "phoneNumber", placeholder: "08xx-xxxx-xxxx" }],
};
const lookup = (k) => (k === "nik" ? resident.nik : resident.resident?.[k]);
const aliasIndex = buildAliasIndex(props.bundle.aliases);

const form = reactive({});
fillForm(form, [...props.bundle.letters.flatMap((l) => l.sections), NOTIF_SECTION], lookup);

const files = reactive({}); // { "<letterId>::<index>": File }
const preview = reactive({ open: false, file: null, title: "" });
const openPreview = (d) => Object.assign(preview, { open: true, file: files[d.id], title: d.label });
const autoFilled = reactive({}); // { [fieldKey]: true } — penanda "terisi otomatis"
const errors = ref({});
const fileErrors = ref({});
const stepAlert = ref("");

/* ---------- Surat terpilih → langkah ---------- */
const selected = ref([...(props.bundle.ui?.preselected ?? [])].filter((id) => props.bundle.letters.some((l) => l.id === id)));
const selectError = ref(false);
const selectedLetters = computed(() => props.bundle.letters.filter((l) => selected.value.includes(l.id)));
const docsOf = (letter) => normalizeDocs(letter.documents, letter.id);
const sectionsOf = (letter) => (letter.id === selectedLetters.value[0]?.id ? [...letter.sections, NOTIF_SECTION] : letter.sections);

const STEPS = ["Pilih Surat", "Isian Surat", "Dokumen", "Cek & Kirim"];
const STEP_SELECT = 0;
const STEP_FIELDS = 1;
const STEP_DOCS = 2;
const STEP_REVIEW = 3;
const current = ref(0);
const maxReached = ref(0);
const isChecklist = computed(() => current.value === STEP_SELECT);
const isFields = computed(() => current.value === STEP_FIELDS);
const isDocs = computed(() => current.value === STEP_DOCS);
const isReview = computed(() => current.value === STEP_REVIEW);

// sub-langkah: indeks surat yang sedang tampil pada langkah Isian
const fieldIdx = ref(0);
const fLetter = computed(() => selectedLetters.value[Math.min(fieldIdx.value, selectedLetters.value.length - 1)] ?? null);
const lastIdx = computed(() => selectedLetters.value.length - 1);
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const groups = computed(() => {
  const map = new Map();
  for (const l of props.bundle.letters) {
    if (l.hidden) continue; // surat pendamping (lihat `with`): tidak punya kartu sendiri
    if (!map.has(l.group)) map.set(l.group, []);
    map.get(l.group).push(l);
  }
  return [...map.entries()].map(([title, letters]) => ({ title, letters }));
});
const groupHue = (gi) => HUES[SECTION_HUES[(gi + 1) % SECTION_HUES.length]];
// surat boleh punya warna sendiri (`hue`), mis. kartu dokumen di register; bila tidak, ikut warna kelompoknya
const cardHue = (l, gi) => (l.hue ? hue(l.hue) : groupHue(gi));
const isSelected = (id) => selected.value.includes(id);
/* Satu kartu bisa membawa surat pendamping: letter.with = [id, ...] (surat pendamping diberi hidden: true).
   Memilih kartu = memilih semuanya; tiap surat tetap punya langkah isian sendiri. */
function toggle(id) {
  selectError.value = false;
  const ids = [id, ...(props.bundle.letters.find((l) => l.id === id)?.with ?? [])];
  selected.value = isSelected(id) ? selected.value.filter((x) => !ids.includes(x)) : [...new Set([...selected.value, ...ids])];
}
const visibleLetters = computed(() => props.bundle.letters.filter((l) => !l.hidden));
const visibleSelected = computed(() => visibleLetters.value.filter((l) => selected.value.includes(l.id)).length);
const selectAll = () => {
  selectError.value = false;
  selected.value = props.bundle.letters.map((l) => l.id);
};
const clearAll = () => (selected.value = []);

/* ---------- Navigasi ---------- */
function resetAlerts() {
  errors.value = {};
  fileErrors.value = {};
  stepAlert.value = "";
}

/* Pindah langkah utama. `letterId` (opsional) = surat yang ditampilkan pada langkah Isian/Dokumen. */
function goTo(step, letterId = null) {
  if (step !== current.value) resetAlerts();
  current.value = step;
  maxReached.value = Math.max(Math.min(maxReached.value, STEPS.length - 1), step);
  const idx = letterId ? Math.max(0, selectedLetters.value.findIndex((l) => l.id === letterId)) : 0;
  if (step === STEP_FIELDS) fieldIdx.value = idx;
  if (step === STEP_DOCS || step === STEP_REVIEW) syncShared();
  scrollTop();
}
// pindah surat di dalam langkah yang sama
function goSub(idx) {
  resetAlerts();
  fieldIdx.value = idx;
  scrollTop();
}

// isi otomatis field yang masih kosong dari surat lain setiap kali sebuah surat ditampilkan
watch([current, fieldIdx], () => {
  const l = isFields.value ? fLetter.value : null;
  if (l) for (const key of applyAliases(form, sectionsOf(l), aliasIndex)) autoFilled[key] = true;
});

const nextLabel = computed(() => {
  if (isReview.value) return ui.value.submitLabel ?? "Kirim Pengajuan";
  if (isChecklist.value) return `Lanjut (${selected.value.length} surat)`;
  if (!isFields.value) return "Lanjut ke Cek & Kirim";
  if (fieldIdx.value < lastIdx.value) return `Lanjut ke ${selectedLetters.value[fieldIdx.value + 1].code}`;
  return "Lanjut ke Dokumen";
});

function back() {
  if (isChecklist.value) return router.push(ui.value.back ?? { name: "general-catalog", query: { category: "permohonan" } });
  if (isFields.value) return fieldIdx.value > 0 ? goSub(fieldIdx.value - 1) : goTo(STEP_SELECT);
  if (isDocs.value) return goTo(STEP_FIELDS, selectedLetters.value[lastIdx.value]?.id);
  goTo(STEP_DOCS);
}

const focusFirstError = () => nextTick(() => document.querySelector("[aria-invalid='true'], .border-red-300")?.scrollIntoView({ block: "center", behavior: "smooth" }));

function next() {
  if (isChecklist.value) {
    if (!selected.value.length) {
      selectError.value = true;
      return;
    }
    return goTo(STEP_FIELDS);
  }
  if (isReview.value) return confirmAndSubmit();

  if (isFields.value) {
    const l = fLetter.value;
    if (Object.keys(fieldErrorsOf(l)).length) {
      errors.value = { _checked: true };
      stepAlert.value = `Masih ada isian wajib yang belum lengkap pada surat ${l.code}.`;
      return focusFirstError();
    }
    if (fieldIdx.value < lastIdx.value) return goSub(fieldIdx.value + 1);
    // surat terakhir: pastikan tidak ada surat sebelumnya yang terlewat (bisa loncat lewat penanda)
    const bad = selectedLetters.value.findIndex((x) => Object.keys(fieldErrorsOf(x)).length);
    if (bad >= 0) {
      goSub(bad);
      errors.value = { _checked: true };
      stepAlert.value = `Surat ${selectedLetters.value[bad].code} belum lengkap. Lengkapi dulu sebelum lanjut.`;
      return focusFirstError();
    }
    return goTo(STEP_DOCS);
  }

  // langkah dokumen (1 halaman untuk semua surat)
  const de = validateDocs(sharedDocs.value, files);
  if (Object.keys(de).length) {
    fileErrors.value = de;
    stepAlert.value = `Masih ada ${Object.keys(de).length} dokumen wajib yang belum diunggah.`;
    return focusFirstError();
  }
  goTo(STEP_REVIEW);
}

/* ---------- Isian ---------- */
const onEdit = (key) => delete autoFilled[key];
// error ditampilkan hanya setelah pengguna menekan "Lanjut" (errors._checked), dihitung per surat
const fieldErrorsOf = (letter) => validateFields(sectionsOf(letter), form);
const shownErrors = (letter) => (errors.value._checked ? fieldErrorsOf(letter) : {});
const autoCount = computed(() => {
  const keys = new Set(selectedLetters.value.flatMap((l) => sectionsOf(l).flatMap((s) => s.fields)).map((f) => f.key));
  return [...keys].filter((k) => autoFilled[k]).length;
});

/* ---------- Dokumen ---------- */
/* Dokumen dengan label sama di beberapa surat (KTP, KK, …) digabung jadi 1 entri unggah.
   Setiap entri menyimpan `ids` = id dokumen per-surat; file yang diunggah disalin ke semua id itu,
   sehingga validasi, cek ulang, dan payload per surat tetap bekerja seperti sebelumnya. */
const sharedDocs = computed(() => {
  const map = new Map();
  for (const l of selectedLetters.value) {
    for (const d of docsOf(l)) {
      const cur = map.get(d.label);
      if (!cur) map.set(d.label, { id: d.id, label: d.label, optional: !!d.optional, ids: [d.id] });
      else {
        cur.ids.push(d.id);
        cur.optional = cur.optional && !!d.optional; // wajib bila wajib di salah satu surat
      }
    }
  }
  return [...map.values()];
});
const sharedOf = (id) => sharedDocs.value.find((d) => d.id === id);
// samakan file untuk surat yang baru ditambahkan / dipilih ulang
function syncShared() {
  for (const d of sharedDocs.value) {
    const src = d.ids.find((id) => files[id]);
    if (src) d.ids.forEach((id) => (files[id] = files[src]));
  }
}
function onFileSelect(id, file) {
  (sharedOf(id)?.ids ?? [id]).forEach((x) => (files[x] = file));
  const next = { ...fileErrors.value };
  delete next[id];
  fileErrors.value = next;
}
function onFileRemove(id) {
  (sharedOf(id)?.ids ?? [id]).forEach((x) => delete files[x]);
}
const docsMissing = computed(() => Object.keys(validateDocs(sharedDocs.value, files)).length);

/* ---------- Cek ulang ---------- */
const reviewOpen = reactive({});
const toggleReview = (id) => (reviewOpen[id] = !reviewOpen[id]);
const setAllReview = (v) => selectedLetters.value.forEach((l) => (reviewOpen[l.id] = v));
const visibleSections = (l) => sectionsOf(l).map((s) => ({ ...s, fields: s.fields.filter((f) => !f.showIf || f.showIf(form)) })).filter((s) => s.fields.length);

const status = computed(() =>
  Object.fromEntries(
    selectedLetters.value.map((l) => {
      const fe = Object.keys(validateFields(sectionsOf(l), form)).length;
      return [l.id, { ok: !fe, fields: fe }];
    }),
  ),
);
const incomplete = computed(() => selectedLetters.value.filter((l) => !status.value[l.id].ok));

const confirmOpen = ref(false); // pop-up konfirmasi kirim
const isOriginal = ref(false);
const confirmError = ref(false);

function confirmAndSubmit() {
  if (incomplete.value.length || docsMissing.value) {
    stepAlert.value = [
      incomplete.value.length ? `${incomplete.value.length} surat belum lengkap isiannya.` : "",
      docsMissing.value ? `${docsMissing.value} dokumen wajib belum diunggah.` : "",
      "Lengkapi dulu sebelum mengirim.",
    ].filter(Boolean).join(" ");
    incomplete.value.forEach((l) => (reviewOpen[l.id] = true));
    return;
  }
  stepAlert.value = "";
  if (!isOriginal.value) {
    confirmError.value = true;
    return;
  }
  confirmOpen.value = true; // tanya dulu sebelum benar-benar dikirim
}

/* ---------- Kirim ---------- */
const isSubmitting = ref(false);
const result = reactive({ open: false, ok: false, codes: [], message: "" });

// TODO(BE): kirim paket ke backend. Payload per surat = nilai field milik surat itu + file miliknya;
// backend yang membuat kode surat dan men-generate PDF per surat dari template masing-masing.
function buildPayload() {
  return {
    bundle: props.bundle.slug,
    letters: selectedLetters.value.map((l) => ({
      id: l.id,
      code: l.code,
      title: l.title,
      fields: Object.fromEntries(sectionsOf(l).flatMap((s) => s.fields).map((f) => [f.key, form[f.key]])),
      files: docsOf(l).filter((d) => files[d.id]).map((d) => ({ label: d.label, file: files[d.id] })),
    })),
  };
}
async function sendApplication(/* payload */) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return { codes: selectedLetters.value.map((l) => ({ title: l.title, code: `${l.code}-${stamp}-${rand()}` })) };
}
async function submit() {
  isSubmitting.value = true;
  try {
    const res = await sendApplication(buildPayload());
    Object.assign(result, { open: true, ok: true, codes: res.codes, message: "" });
  } catch (err) {
    Object.assign(result, { open: true, ok: false, codes: [], message: err?.message || "Terjadi kesalahan saat mengirim pengajuan." });
  } finally {
    isSubmitting.value = false;
  }
}

const copied = ref(false); // "salin semua"
const copiedCode = ref(""); // kode yang baru disalin satuan
const copyFailed = ref(false);
async function copyCodes() {
  const ok = await copyText(result.codes.map((c) => `${c.title}: ${c.code}`).join("\n"));
  copied.value = ok;
  copyFailed.value = !ok;
  setTimeout(() => { copied.value = false; copyFailed.value = false; }, 1500);
}
async function copyOne(code) {
  const ok = await copyText(code);
  copiedCode.value = ok ? code : "";
  copyFailed.value = !ok;
  setTimeout(() => { copiedCode.value = ""; copyFailed.value = false; }, 1500);
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Hero -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 sm:p-7 border border-white shadow-sm" :class="h.hero">
      <span class="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full" :class="h.blob" />
      <span class="pointer-events-none absolute right-16 -bottom-10 h-24 w-24 rounded-full bg-white/60" />
      <div class="relative flex items-start gap-4">
        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl shadow-sm" :class="h.icon"><i :class="bundle.icon" /></span>
        <div class="min-w-0">
          <p class="text-xs font-medium uppercase tracking-wide" :class="h.text">{{ ui.kindLabel ?? "Paket Pengajuan Surat" }}</p>
          <h1 class="text-xl font-semibold text-[var(--color-text-h)] mt-0.5">{{ bundle.title }}</h1>
          <p class="text-sm mt-1 text-[var(--color-text-muted)]">{{ bundle.description }}</p>
        </div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="mt-6 rounded-2xl border bg-white px-4 py-4" :class="h.soft">
      <WizardStepper :steps="STEPS" :current="current" :maxReached="maxReached" :hue="hueName" @go="goTo" />
    </div>

    <div class="mt-4 rounded-3xl border border-surface-200 bg-white p-5 sm:p-7 shadow-sm">
      <!-- ============ LANGKAH 1: CEKLIS SURAT ============ -->
      <div v-if="isChecklist">
        <h2 class="text-lg font-semibold text-[var(--color-text-h)]">{{ ui.selectTitle ?? "Surat apa saja yang Anda butuhkan?" }}</h2>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">
          {{ ui.selectHint ?? "Centang semua surat yang ingin diajukan. Setiap surat yang dipilih mendapat satu langkah pengisian sendiri." }}
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <Button label="Pilih semua" icon="pi pi-check-square" size="small" severity="secondary" outlined @click="selectAll" />
          <Button label="Kosongkan" icon="pi pi-times" size="small" severity="secondary" text :disabled="!selected.length" @click="clearAll" />
          <span class="ml-auto rounded-full px-3 py-1 text-xs font-semibold" :class="h.pill">{{ visibleSelected }} dari {{ visibleLetters.length }} surat dipilih</span>
        </div>

        <div v-for="(g, gi) in groups" :key="g.title" class="mt-6">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :class="groupHue(gi).dot" />
            <p class="text-sm font-semibold text-[var(--color-text-h)]">{{ g.title }}</p>
          </div>
          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              v-for="l in g.letters"
              :key="l.id"
              class="relative flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
              :class="isSelected(l.id) ? cardHue(l, gi).selected : cardHue(l, gi).idle"
            >
              <Checkbox :modelValue="isSelected(l.id)" binary class="mt-0.5" @update:modelValue="toggle(l.id)" />
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide" :class="cardHue(l, gi).icon"><i v-if="l.icon" :class="l.icon" class="text-[10px]" />{{ l.cardCode ?? l.code }}</span>
                  <span class="text-sm font-semibold text-[var(--color-text-h)]">{{ l.cardTitle ?? l.title }}</span>
                </span>
                <span class="block text-xs mt-1 text-[var(--color-text-muted)]">{{ l.cardDescription ?? l.description }}</span>
              </span>
            </label>
          </div>
        </div>

        <Message v-if="selectError" severity="warn" :closable="false" class="mt-5">Pilih minimal satu surat untuk melanjutkan.</Message>
      </div>

      <!-- ============ LANGKAH 2: ISIAN — 1 SURAT PER HALAMAN ============ -->
      <div v-else-if="isFields && fLetter" :key="`f-${fLetter.id}`">
        <!-- penanda sub-langkah per surat -->
        <div v-if="selectedLetters.length > 1" class="flex flex-wrap items-center gap-2">
          <button
            v-for="(l, i) in selectedLetters"
            :key="l.id"
            type="button"
            class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors"
            :class="i === fieldIdx ? h.icon : Object.keys(fieldErrorsOf(l)).length ? 'bg-white border-surface-200 text-[var(--color-text-muted)]' : 'bg-emerald-50 border-emerald-200 text-emerald-700'"
            :aria-current="i === fieldIdx ? 'step' : undefined"
            :title="l.title"
            @click="goSub(i)"
          >
            <i v-if="i !== fieldIdx && !Object.keys(fieldErrorsOf(l)).length" class="pi pi-check text-[9px]" />
            {{ l.code }}
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-2" :class="selectedLetters.length > 1 ? 'mt-4' : ''">
          <span class="rounded-md px-2 py-0.5 text-xs font-bold tracking-wide" :class="h.icon">{{ fLetter.code }}</span>
          <span class="text-xs text-[var(--color-text-muted)]">Isian surat {{ fieldIdx + 1 }} dari {{ selectedLetters.length }}</span>
        </div>
        <h2 class="text-lg font-semibold text-[var(--color-text-h)] mt-1">{{ fLetter.title }}</h2>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">{{ fLetter.description }}</p>

        <div v-if="sectionsOf(fLetter).flatMap((s) => s.fields).some((f) => autoFilled[f.key])" class="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">
          <i class="pi pi-bolt mt-0.5" />
          <span>Sebagian isian terisi otomatis dari data tersimpan / surat sebelumnya. Periksa dan ubah bila perlu.</span>
        </div>

        <div class="mt-5">
          <LetterFormFields :sections="sectionsOf(fLetter)" :form="form" :errors="shownErrors(fLetter)" :autoFilled="autoFilled" :idPrefix="`f-${fLetter.id}`" @edit="onEdit" />
        </div>

        <Message v-if="stepAlert" severity="error" :closable="false" class="mt-5">{{ stepAlert }}</Message>
      </div>

      <!-- ============ LANGKAH 3: DOKUMEN — 1 HALAMAN UNTUK SEMUA SURAT ============ -->
      <div v-else-if="isDocs">
        <h2 class="text-lg font-semibold text-[var(--color-text-h)]">Dokumen Pendukung</h2>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">
          Unggah foto/scan dokumen asli (JPG, PNG, atau PDF, maksimal {{ MAX_FILE_MB }} MB per file). Cukup satu kali unggah, dokumen otomatis dipakai untuk semua surat dalam pengajuan ini.
        </p>

        <section class="mt-5 rounded-2xl border p-4 sm:p-5 bg-gradient-to-br from-sky-50/80 to-white border-sky-100">
          <DocUploader :docs="sharedDocs" :files="files" :errors="fileErrors" @select="onFileSelect" @remove="onFileRemove" />
        </section>

        <Message v-if="stepAlert" severity="error" :closable="false" class="mt-5">{{ stepAlert }}</Message>
      </div>

      <!-- ============ LANGKAH TERAKHIR: CEK & KIRIM ============ -->
      <div v-else>
        <h2 class="text-lg font-semibold text-[var(--color-text-h)]">Cek Ulang Pengajuan</h2>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">Periksa isian setiap surat dan dokumen pendukung. Klik “Ubah” untuk kembali memperbaiki.</p>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="h.pill">{{ selectedLetters.length }} surat</span>
          <span v-if="!incomplete.length && !docsMissing" class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"><i class="pi pi-check-circle text-[11px]" /> Semua lengkap</span>
          <span v-else class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"><i class="pi pi-exclamation-triangle text-[11px]" /> {{ incomplete.length + (docsMissing ? 1 : 0) }} belum lengkap</span>
          <span class="ml-auto flex gap-1">
            <Button label="Buka semua" size="small" text @click="setAllReview(true)" />
            <Button label="Tutup semua" size="small" text severity="secondary" @click="setAllReview(false)" />
          </span>
        </div>

        <div class="mt-4 flex flex-col gap-3">
          <article v-for="(l, li) in selectedLetters" :key="l.id" class="overflow-hidden rounded-2xl border" :class="status[l.id].ok ? HUES[SECTION_HUES[li % SECTION_HUES.length]].soft : 'bg-amber-50 border-amber-300'">
            <button type="button" class="flex w-full items-center gap-3 px-4 py-3 text-left" :aria-expanded="!!reviewOpen[l.id]" @click="toggleReview(l.id)">
              <span class="rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide bg-white/80 text-[var(--color-text-h)]">{{ l.code }}</span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold text-[var(--color-text-h)]">{{ l.title }}</span>
                <span class="block text-xs text-[var(--color-text-muted)]">
                  <template v-if="status[l.id].ok">Isian lengkap</template>
                  <span v-else class="text-amber-800">{{ status[l.id].fields }} isian belum lengkap</span>
                </span>
              </span>
              <i class="pi" :class="status[l.id].ok ? 'pi-check-circle text-emerald-600' : 'pi-exclamation-triangle text-amber-600'" />
              <i class="pi text-xs text-[var(--color-text-muted)]" :class="reviewOpen[l.id] ? 'pi-chevron-up' : 'pi-chevron-down'" />
            </button>

            <div v-if="reviewOpen[l.id]" class="border-t border-white/80 bg-white px-4 py-4">
              <div class="flex justify-end">
                <Button label="Ubah" icon="pi pi-pencil" text size="small" @click="goTo(STEP_FIELDS, l.id)" />
              </div>
              <div v-for="section in visibleSections(l)" :key="section.title" class="mb-4 last:mb-0">
                <p class="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{{ section.title }}</p>
                <dl class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <template v-for="field in section.fields" :key="field.key">
                    <div v-if="field.type === 'rows'" class="sm:col-span-2">
                      <dt class="text-xs text-[var(--color-text-muted)]">{{ field.label }}</dt>
                      <dd v-if="!filledRows(field, form).length" class="text-[var(--color-text-h)]">-</dd>
                      <ol v-else class="mt-1 list-decimal pl-5 text-[var(--color-text-h)]">
                        <li v-for="(row, i) in filledRows(field, form)" :key="i">{{ field.columns.map((c) => (c.type === 'date' ? fmtDate(row[c.key]) : row[c.key])).filter(Boolean).join(" · ") }}</li>
                      </ol>
                    </div>
                    <div v-else :class="field.span === 2 || field.type === 'checks' ? 'sm:col-span-2' : ''">
                      <dt class="text-xs text-[var(--color-text-muted)]">{{ field.label }}</dt>
                      <dd class="text-[var(--color-text-h)] break-words">{{ display(field, form[field.key]) }}</dd>
                    </div>
                  </template>
                </dl>
              </div>
            </div>
          </article>
        </div>

        <!-- Dokumen pendukung (gabungan semua surat) -->
        <div class="mt-3 overflow-hidden rounded-2xl border" :class="docsMissing ? 'bg-amber-50 border-amber-300' : 'bg-gradient-to-br from-sky-50/80 to-white border-sky-100'">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-[var(--color-text-h)]">Dokumen Pendukung</p>
              <p class="text-xs" :class="docsMissing ? 'text-amber-800' : 'text-[var(--color-text-muted)]'">
                {{ docsMissing ? `${docsMissing} dokumen wajib belum diunggah` : `${sharedDocs.filter((d) => files[d.id]).length} dokumen terunggah` }}
              </p>
            </div>
            <Button label="Ubah" icon="pi pi-pencil" text size="small" @click="goTo(STEP_DOCS)" />
          </div>
          <ul class="flex flex-col gap-2 border-t border-white/80 bg-white px-4 py-4 text-sm">
            <li v-for="d in sharedDocs" :key="d.id" class="flex items-center gap-3">
              <FileThumb v-if="files[d.id]" :file="files[d.id]" class="h-12 w-12" />
              <i v-else class="pi mx-3.5" :class="d.optional ? 'pi-minus-circle text-[var(--color-text-muted)]' : 'pi-times-circle text-red-500'" />
              <span class="min-w-0 flex-1 text-[var(--color-text-h)]">
                {{ d.label }}
                <span class="block truncate text-xs text-[var(--color-text-muted)]">{{ files[d.id] ? files[d.id].name : d.optional ? "Tidak diunggah (opsional)" : "Belum diunggah" }}</span>
              </span>
              <Button v-if="files[d.id]" label="Lihat" icon="pi pi-eye" size="small" severity="secondary" outlined @click="openPreview(d)" />
            </li>
          </ul>
        </div>

        <!-- Pernyataan dokumen asli -->
        <div class="mt-5 rounded-2xl border-2 p-4" :class="confirmError && !isOriginal ? 'border-red-300 bg-red-50' : h.soft">
          <label class="flex items-start gap-3 cursor-pointer">
            <Checkbox v-model="isOriginal" binary class="mt-0.5" @update:modelValue="confirmError = false" />
            <span class="text-sm text-[var(--color-text-h)]">
              Saya menyatakan bahwa seluruh data yang saya isi sudah benar dan dokumen yang saya unggah adalah <b>dokumen asli</b>. Saya bersedia menerima sanksi sesuai ketentuan bila data atau dokumen terbukti palsu.
            </span>
          </label>
          <small v-if="confirmError && !isOriginal" class="block mt-2 text-red-500">Centang pernyataan ini sebelum mengirim pengajuan.</small>
        </div>

        <Message v-if="stepAlert" severity="error" :closable="false" class="mt-4">
          {{ stepAlert }}
          <span v-if="incomplete.length" class="block mt-1 text-xs">Surat yang perlu dilengkapi: {{ incomplete.map((l) => l.code).join(", ") }}.</span>
          <span v-if="docsMissing" class="block mt-1 text-xs">Dokumen wajib belum lengkap, klik “Ubah” pada bagian Dokumen Pendukung.</span>
        </Message>
      </div>

      <!-- Tombol navigasi -->
      <div class="flex justify-between gap-3 mt-7 pt-6 border-t border-surface-200">
        <Button :label="current === 0 ? (ui.backLabel ?? 'Kembali ke Katalog') : 'Kembali'" icon="pi pi-arrow-left" severity="secondary" outlined :disabled="isSubmitting" @click="back" />
        <Button
          :label="nextLabel"
          :icon="isReview ? 'pi pi-send' : 'pi pi-arrow-right'"
          iconPos="right"
          :class="h.btn"
          :loading="isSubmitting"
          @click="next"
        />
      </div>
    </div>

    <FilePreviewDialog v-model="preview.open" :file="preview.file" :title="preview.title" />

    <!-- ============ POP-UP KONFIRMASI KIRIM ============ -->
    <Dialog v-model:visible="confirmOpen" modal :closable="!isSubmitting" :draggable="false" :style="{ width: '28rem', maxWidth: '94vw' }" :header="ui.confirmTitle ?? 'Kirim Pengajuan?'">
      <div class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-2xl"><i class="pi pi-question" /></span>
        <p v-if="ui.confirmText" class="text-sm text-[var(--color-text-h)]">{{ ui.confirmText }}</p>
        <p v-else class="text-sm text-[var(--color-text-h)]">Apakah Anda yakin ingin mengirim paket <b>{{ bundle.title }}</b> ({{ selectedLetters.length }} surat) sekarang?</p>
        <p class="text-xs text-[var(--color-text-muted)]">{{ ui.confirmNote ?? "Setelah dikirim, pengajuan akan diproses oleh petugas dan data tidak bisa diubah lagi dari sini." }}</p>
      </div>
      <template #footer>
        <Button label="Periksa Lagi" severity="secondary" outlined :disabled="isSubmitting" @click="confirmOpen = false" />
        <Button :label="ui.confirmYes ?? 'Ya, Kirim Pengajuan'" icon="pi pi-send" :class="h.btn" :loading="isSubmitting" @click="confirmOpen = false; submit()" />
      </template>
    </Dialog>

    <!-- ============ POP-UP HASIL KIRIM ============ -->
    <Dialog v-model:visible="result.open" modal :closable="false" :draggable="false" :style="{ width: '30rem', maxWidth: '94vw' }" :header="result.ok ? (ui.doneTitle ?? 'Pengajuan Berhasil') : (ui.failTitle ?? 'Pengajuan Gagal')">
      <div v-if="result.ok" class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl"><i class="pi pi-check" /></span>
        <p v-if="ui.doneIntro" class="text-sm text-[var(--color-text-muted)]">{{ ui.doneIntro }}</p>
        <p v-else class="text-sm text-[var(--color-text-muted)]">Paket <b>{{ bundle.title }}</b> berhasil dikirim ({{ result.codes.length }} surat).</p>
        <ul class="w-full rounded-2xl border border-dashed p-3 text-left" :class="h.soft">
          <li v-for="c in result.codes" :key="c.code" class="flex items-center justify-between gap-3 py-1 text-sm">
            <span class="truncate text-[var(--color-text-h)]">{{ c.title }}</span>
            <span class="flex shrink-0 items-center gap-1">
              <span class="font-semibold tracking-wide text-[var(--color-text-h)] select-all">{{ c.code }}</span>
              <Button :icon="copiedCode === c.code ? 'pi pi-check' : 'pi pi-copy'" text rounded size="small" severity="secondary" :aria-label="`Salin kode ${c.title}`" @click="copyOne(c.code)" />
            </span>
          </li>
          <li class="pt-1 text-center"><Button :label="copied ? 'Tersalin' : copyFailed ? 'Gagal, salin manual' : 'Salin semua kode'" :icon="copied ? 'pi pi-check' : 'pi pi-copy'" text size="small" :severity="copyFailed ? 'danger' : undefined" @click="copyCodes" /></li>
        </ul>
        <p v-if="ui.doneMessage" class="text-sm text-[var(--color-text-h)]">{{ ui.doneMessage }} Notifikasi akan dikirim melalui <b>WhatsApp</b> ke nomor {{ form.whatsapp }}.</p>
        <p v-else class="text-sm text-[var(--color-text-h)]">Pengajuan Anda sedang <b>menunggu proses verifikasi dan otorisasi</b> oleh petugas. Setelah selesai, Anda akan mendapat notifikasi melalui <b>WhatsApp</b> ke nomor {{ form.whatsapp }}.</p>
      </div>
      <div v-else class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl"><i class="pi pi-times" /></span>
        <p class="text-sm text-[var(--color-text-h)]">Pengajuan belum berhasil dikirim.</p>
        <Message severity="error" :closable="false" class="w-full">{{ result.message }}</Message>
        <p class="text-xs text-[var(--color-text-muted)]">Data yang sudah Anda isi tidak hilang. Silakan coba kirim lagi.</p>
      </div>

      <template #footer>
        <template v-if="result.ok && ui.done">
          <Button :label="ui.done.label" :icon="ui.done.icon" :class="h.btn" @click="ui.done.run(router)" />
        </template>
        <template v-else-if="result.ok">
          <Button label="Ke Katalog" severity="secondary" outlined @click="router.push({ name: 'general-catalog', query: { category: 'permohonan' } })" />
          <Button label="Lihat Dokumen Saya" :class="h.btn" @click="router.push({ name: 'my-documents' })" />
        </template>
        <template v-else>
          <Button label="Tutup" severity="secondary" outlined @click="result.open = false" />
          <Button label="Coba Lagi" icon="pi pi-refresh" :class="h.btn" :loading="isSubmitting" @click="result.open = false; submit()" />
        </template>
      </template>
    </Dialog>
  </div>
</template>