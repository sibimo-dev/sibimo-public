<script setup>
/* Wizard pengajuan 1 surat (dipakai file surat yang berdiri sendiri). 3 langkah:
   1) Isian surat   2) Dokumen pendukung   3) Cek ulang + pernyataan dokumen asli + kirim
   Setelah kirim muncul pop-up berhasil (kode surat) atau gagal.
   Surat nikah/kelahiran/kematian sekarang diajukan lewat paket (BundleWizard). */
import { computed, inject, reactive, ref, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import Message from "primevue/message";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import LetterFormFields from "./LetterFormFields.vue";
import DocUploader from "./DocUploader.vue";
import FileThumb from "./FileThumb.vue";
import FilePreviewDialog from "./FilePreviewDialog.vue";
import { copyText } from "./copyText";
import WizardStepper from "./WizardStepper.vue";
import { display, fillForm, filledRows, fmtDate, normalizeDocs, validateDocs, validateFields, MAX_FILE_MB } from "./formLogic";
import { hue as getHue, HUES, SECTION_HUES } from "./pastel";

const props = defineProps({
  title: { type: String, required: true },
  code: { type: String, default: "SRT" }, // awalan kode surat, contoh: SKTM
  sections: { type: Array, required: true }, // lihat letterFields.js
  documents: { type: Array, default: () => [] }, // "Nama dokumen" atau { label, optional }
  hue: { type: String, default: "violet" },
});

const STEPS = ["Isian Surat", "Dokumen Pendukung", "Cek & Kirim"];
// Warna mengikuti kategori surat (diberikan LetterOutlet); `hue` prop hanya cadangan bila wizard dipakai tanpa outlet.
const injectedHue = inject("letterHue", null);
const hueName = computed(() => unref(injectedHue) ?? props.hue);
const h = computed(() => getHue(hueName.value));

const route = useRoute();
const router = useRouter();
const resident = useResidentVerificationStore();

const catalogName = computed(() => (route.path.startsWith("/services/permit") ? "permit-catalog" : "general-catalog"));
// kembali ke katalog dengan tab kategori yang sama (query ?letter= otomatis hilang)
const catalogTo = computed(() => ({ name: catalogName.value, query: route.query.category ? { category: route.query.category } : {} }));

/* ---------- Data ---------- */
// Kontak WhatsApp selalu ada di semua surat (untuk notifikasi status pengajuan).
const allSections = computed(() => [
  ...props.sections,
  {
    title: "Kontak Notifikasi",
    hint: "Status verifikasi dan otorisasi surat akan dikirim melalui WhatsApp ke nomor ini.",
    fields: [{ key: "whatsapp", label: "Nomor WhatsApp", type: "text", from: "phoneNumber", placeholder: "08xx-xxxx-xxxx" }],
  },
]);
const docList = computed(() => normalizeDocs(props.documents));

const form = reactive({});
fillForm(form, allSections.value, (k) => (k === "nik" ? resident.nik : resident.resident?.[k]));

const files = reactive({}); // { [indexDokumen]: File }
const preview = reactive({ open: false, file: null, title: "" });
const openPreview = (d) => Object.assign(preview, { open: true, file: files[d.id], title: d.label });
const errors = ref({});
const fileErrors = ref({});

function onFileSelect(id, file) {
  files[id] = file;
  const next = { ...fileErrors.value };
  delete next[id];
  fileErrors.value = next;
}

/* ---------- Langkah ---------- */
const current = ref(0);
const isFirst = computed(() => current.value === 0);
const isLast = computed(() => current.value === STEPS.length - 1);
const confirmOpen = ref(false); // pop-up konfirmasi kirim
const isOriginal = ref(false); // ceklis "dokumen asli"
const confirmError = ref(false);

function goTo(step) {
  current.value = step;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function back() {
  if (isFirst.value) router.push(catalogTo.value);
  else goTo(current.value - 1);
}

function next() {
  if (current.value === 0) {
    errors.value = validateFields(allSections.value, form);
    if (Object.keys(errors.value).length) return;
  }
  if (current.value === 1) {
    fileErrors.value = validateDocs(docList.value, files);
    if (Object.keys(fileErrors.value).length) return;
  }
  if (!isLast.value) return goTo(current.value + 1);
  if (!isOriginal.value) {
    confirmError.value = true;
    return;
  }
  confirmOpen.value = true; // tanya dulu sebelum benar-benar dikirim
}

/* ---------- Tampilan cek ulang ---------- */
const reviewSections = computed(() =>
  allSections.value
    .map((s) => ({ ...s, fields: s.fields.filter((f) => !f.showIf || f.showIf(form)) }))
    .filter((s) => s.fields.length),
);

/* ---------- Kirim ---------- */
const isSubmitting = ref(false);
const result = reactive({ open: false, ok: false, code: "", message: "" });

// TODO(BE): ganti dengan request ke backend (kirim `form` + `files`), backend yang membuat kode surat.
async function sendApplication() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return { code: `${props.code}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}` };
}

async function submit() {
  isSubmitting.value = true;
  try {
    const res = await sendApplication();
    Object.assign(result, { open: true, ok: true, code: res.code, message: "" });
  } catch (err) {
    Object.assign(result, { open: true, ok: false, code: "", message: err?.message || "Terjadi kesalahan saat mengirim pengajuan." });
  } finally {
    isSubmitting.value = false;
  }
}

const copied = ref(false);
const copyFailed = ref(false);
async function copyCode() {
  const ok = await copyText(result.code);
  copied.value = ok;
  copyFailed.value = !ok;
  setTimeout(() => { copied.value = false; copyFailed.value = false; }, 1500);
}
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 border border-white shadow-sm" :class="h.hero">
      <span class="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full" :class="h.blob" />
      <span class="pointer-events-none absolute right-16 -bottom-10 h-24 w-24 rounded-full bg-white/60" />
      <p class="relative text-xs font-medium uppercase tracking-wide" :class="h.text">Pengajuan Surat</p>
      <h1 class="relative text-xl font-semibold text-[var(--color-text-h)] mt-1">{{ title }}</h1>
    </div>

    <div class="mt-6 rounded-2xl border bg-white px-4 py-4" :class="h.soft">
      <WizardStepper :steps="STEPS" :current="current" :hue="hueName" @go="goTo" />
    </div>

    <div class="mt-4 rounded-3xl border border-surface-200 bg-white p-5 sm:p-7 shadow-sm">
      <!-- ============ STEP 1: ISIAN SURAT ============ -->
      <div v-if="current === 0">
        <LetterFormFields :sections="allSections" :form="form" :errors="errors" />
      </div>

      <!-- ============ STEP 2: DOKUMEN PENDUKUNG ============ -->
      <div v-else-if="current === 1">
        <h2 class="text-lg font-semibold text-[var(--color-text-h)]">Dokumen Pendukung</h2>
        <p class="text-sm mt-1 mb-6 text-[var(--color-text-muted)]">Unggah foto/scan dokumen asli (JPG, PNG, atau PDF, maksimal {{ MAX_FILE_MB }} MB per file).</p>
        <DocUploader :docs="docList" :files="files" :errors="fileErrors" @select="onFileSelect" @remove="(id) => delete files[id]" />
      </div>

      <!-- ============ STEP 3: CEK ULANG & KIRIM ============ -->
      <div v-else>
        <h2 class="text-lg font-semibold text-[var(--color-text-h)]">Cek Ulang Pengajuan</h2>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">Pastikan isian dan dokumen di bawah sudah benar sebelum dikirim.</p>

        <div class="mt-6 flex flex-col gap-4">
          <div v-for="(section, si) in reviewSections" :key="section.title" class="rounded-2xl border p-4" :class="HUES[SECTION_HUES[si % SECTION_HUES.length]].softer">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-[var(--color-text-h)]">{{ section.title }}</p>
              <Button label="Ubah" icon="pi pi-pencil" text size="small" @click="goTo(0)" />
            </div>
            <dl class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <template v-for="field in section.fields" :key="field.key">
                <div v-if="field.type === 'rows'" class="sm:col-span-2">
                  <dt class="text-xs text-[var(--color-text-muted)]">{{ field.label }}</dt>
                  <dd v-if="!filledRows(field, form).length" class="text-[var(--color-text-h)]">-</dd>
                  <ol v-else class="mt-1 list-decimal pl-5 text-[var(--color-text-h)]">
                    <li v-for="(row, i) in filledRows(field, form)" :key="i">
                      {{ field.columns.map((c) => (c.type === 'date' ? fmtDate(row[c.key]) : row[c.key])).filter(Boolean).join(" · ") }}
                    </li>
                  </ol>
                </div>
                <div v-else :class="field.span === 2 || field.type === 'checks' ? 'sm:col-span-2' : ''">
                  <dt class="text-xs text-[var(--color-text-muted)]">{{ field.label }}</dt>
                  <dd class="text-[var(--color-text-h)] break-words">{{ display(field, form[field.key]) }}</dd>
                </div>
              </template>
            </dl>
          </div>

          <div class="rounded-2xl border p-4 bg-gradient-to-br from-sky-50/80 to-white border-sky-100">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-[var(--color-text-h)]">Dokumen Pendukung</p>
              <Button label="Ubah" icon="pi pi-pencil" text size="small" @click="goTo(1)" />
            </div>
            <ul class="mt-2 flex flex-col gap-2 text-sm">
              <li v-for="d in docList" :key="d.id" class="flex items-center gap-3">
                <FileThumb v-if="files[d.id]" :file="files[d.id]" class="h-12 w-12" />
                <i v-else class="pi pi-minus-circle mx-3.5 text-[var(--color-text-muted)]" />
                <span class="min-w-0 flex-1 text-[var(--color-text-h)]">
                  {{ d.label }}
                  <span class="block truncate text-xs text-[var(--color-text-muted)]">{{ files[d.id] ? files[d.id].name : "Tidak diunggah (opsional)" }}</span>
                </span>
                <Button v-if="files[d.id]" label="Lihat" icon="pi pi-eye" size="small" severity="secondary" outlined @click="openPreview(d)" />
              </li>
              <li v-if="!docList.length" class="text-[var(--color-text-muted)]">Tidak ada dokumen pendukung.</li>
            </ul>
          </div>

          <!-- Pernyataan dokumen asli -->
          <div class="rounded-2xl border-2 p-4" :class="confirmError && !isOriginal ? 'border-red-300 bg-red-50' : h.soft">
            <label class="flex items-start gap-3 cursor-pointer">
              <Checkbox v-model="isOriginal" binary class="mt-0.5" @update:modelValue="confirmError = false" />
              <span class="text-sm text-[var(--color-text-h)]">
                Saya menyatakan bahwa seluruh data yang saya isi sudah benar dan dokumen yang saya unggah adalah <b>dokumen asli</b>. Saya bersedia menerima sanksi sesuai ketentuan bila data atau dokumen terbukti palsu.
              </span>
            </label>
            <small v-if="confirmError && !isOriginal" class="block mt-2 text-red-500">Centang pernyataan ini sebelum mengirim pengajuan.</small>
          </div>
        </div>
      </div>

      <!-- Tombol navigasi -->
      <div class="flex justify-between gap-3 mt-7 pt-6 border-t border-surface-200">
        <Button :label="isFirst ? 'Kembali ke Katalog' : 'Kembali'" icon="pi pi-arrow-left" severity="secondary" outlined :disabled="isSubmitting" @click="back" />
        <Button
          :label="isLast ? 'Kirim Pengajuan' : 'Lanjut'"
          :icon="isLast ? 'pi pi-send' : 'pi pi-arrow-right'"
          iconPos="right"
          :class="h.btn"
          :loading="isSubmitting"
          @click="next"
        />
      </div>
    </div>

    <FilePreviewDialog v-model="preview.open" :file="preview.file" :title="preview.title" />

    <!-- ============ POP-UP KONFIRMASI KIRIM ============ -->
    <Dialog v-model:visible="confirmOpen" modal :closable="!isSubmitting" :draggable="false" :style="{ width: '26rem', maxWidth: '94vw' }" header="Kirim Pengajuan?">
      <div class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-2xl"><i class="pi pi-question" /></span>
        <p class="text-sm text-[var(--color-text-h)]">Apakah Anda yakin ingin mengirim pengajuan <b>{{ title }}</b> sekarang?</p>
        <p class="text-xs text-[var(--color-text-muted)]">Setelah dikirim, pengajuan akan diproses oleh petugas dan data tidak bisa diubah lagi dari sini.</p>
      </div>
      <template #footer>
        <Button label="Periksa Lagi" severity="secondary" outlined :disabled="isSubmitting" @click="confirmOpen = false" />
        <Button label="Ya, Kirim Pengajuan" icon="pi pi-send" :class="h.btn" :loading="isSubmitting" @click="confirmOpen = false; submit()" />
      </template>
    </Dialog>

    <!-- ============ POP-UP HASIL KIRIM ============ -->
    <Dialog v-model:visible="result.open" modal :closable="false" :draggable="false" :style="{ width: '28rem', maxWidth: '92vw' }" :header="result.ok ? 'Pengajuan Berhasil' : 'Pengajuan Gagal'">
      <div v-if="result.ok" class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl"><i class="pi pi-check" /></span>
        <p class="text-sm text-[var(--color-text-muted)]">Pengajuan <b>{{ title }}</b> berhasil dikirim.</p>
        <div class="w-full rounded-2xl border border-dashed p-3" :class="h.soft">
          <p class="text-xs text-[var(--color-text-muted)]">Kode Surat</p>
          <p class="text-lg font-semibold tracking-wide text-[var(--color-text-h)] select-all">{{ result.code }}</p>
          <Button :label="copied ? 'Tersalin' : copyFailed ? 'Gagal, salin manual' : 'Salin kode'" :icon="copied ? 'pi pi-check' : 'pi pi-copy'" text size="small" :severity="copyFailed ? 'danger' : undefined" @click="copyCode" />
        </div>
        <p class="text-sm text-[var(--color-text-h)]">Pengajuan Anda sedang <b>menunggu proses verifikasi dan otorisasi</b> oleh petugas. Setelah selesai, Anda akan mendapat notifikasi melalui <b>WhatsApp</b> ke nomor {{ form.whatsapp }}.</p>
      </div>
      <div v-else class="flex flex-col items-center text-center gap-3">
        <span class="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl"><i class="pi pi-times" /></span>
        <p class="text-sm text-[var(--color-text-h)]">Pengajuan belum berhasil dikirim.</p>
        <Message severity="error" :closable="false" class="w-full">{{ result.message }}</Message>
        <p class="text-xs text-[var(--color-text-muted)]">Data yang sudah Anda isi tidak hilang. Silakan coba kirim lagi.</p>
      </div>

      <template #footer>
        <template v-if="result.ok">
          <Button label="Ke Katalog" severity="secondary" outlined @click="router.push(catalogTo)" />
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
