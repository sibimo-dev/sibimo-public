<script setup>

import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import FileUpload from "primevue/fileupload";
import Message from "primevue/message";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useLetterApplicationStore } from "@/stores/letterApplication";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import { BADGE_STYLES, LETTER_CATEGORIES, LETTER_SERVICES } from "@/data/letterServices";

const route = useRoute();
const router = useRouter();
const letterApplicationStore = useLetterApplicationStore();
const residentStore = useResidentVerificationStore();

const step = ref(residentStore.isVerified ? "catalog" : "verify");

/* STEP 1 — Verifikasi NIK*/

const nikInput = ref(residentStore.nik);
const nikError = ref("");
const isChecking = ref(false);
const residentNotFound = ref(false);

async function checkNik() {
  nikError.value = "";
  residentNotFound.value = false;

  if (!/^\d{16}$/.test(nikInput.value.trim())) {
    nikError.value = "NIK harus terdiri dari 16 digit angka.";
    return;
  }

  isChecking.value = true;
  residentStore.setNik(nikInput.value.trim());
  // TODO(BE): ganti simulasi delay ini dengan pemanggilan API kependudukan.
  await new Promise((resolve) => setTimeout(resolve, 600));
  const found = residentStore.verifyNik();
  isChecking.value = false;

  if (found) {
    step.value = "catalog";
  } else {
    residentNotFound.value = true;
  }
}

function goToRegistration() {
  residentNotFound.value = false;
  step.value = "register";
}


/* STEP 2 — Pendaftaran warga baru (kalau NIK belum terdaftar)        */

const genderOptions = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
];

const registerForm = reactive({
  fullName: "",
  gender: null,
  placeOfBirth: "",
  dateOfBirth: null,
  fullAddress: "",
  whatsappNumber: "",
  occupation: "",
});
const registerErrors = ref({});

const supportingDocumentFile = ref(null);
const supportingDocumentName = ref(null);

function handleSupportingDocumentSelect(event) {
  const file = event.files?.[0];
  if (!file) return;

  supportingDocumentFile.value = file;
  supportingDocumentName.value = file.name;

  if (registerErrors.value.supportingDocument) {
    const nextErrors = { ...registerErrors.value };
    delete nextErrors.supportingDocument;
    registerErrors.value = nextErrors;
  }
}

function removeSupportingDocument() {
  supportingDocumentFile.value = null;
  supportingDocumentName.value = null;
}

function validateRegisterForm() {
  const nextErrors = {};
  if (!registerForm.fullName.trim()) nextErrors.fullName = "Nama lengkap wajib diisi.";
  if (!registerForm.gender) nextErrors.gender = "Jenis kelamin wajib dipilih.";
  if (!registerForm.placeOfBirth.trim()) nextErrors.placeOfBirth = "Tempat lahir wajib diisi.";
  if (!registerForm.dateOfBirth) nextErrors.dateOfBirth = "Tanggal lahir wajib diisi.";
  if (!registerForm.fullAddress.trim()) nextErrors.fullAddress = "Alamat lengkap wajib diisi.";
  if (registerForm.whatsappNumber.trim().length < 9) nextErrors.whatsappNumber = "Nomor WhatsApp tidak valid.";
  if (!registerForm.occupation.trim()) nextErrors.occupation = "Pekerjaan wajib diisi.";
  if (!supportingDocumentFile.value) nextErrors.supportingDocument = "Dokumen pendukung (KTP/KK) wajib diunggah.";
  registerErrors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

const isRegistering = ref(false);

async function submitRegistration() {
  if (!validateRegisterForm()) return;
  isRegistering.value = true;
  // TODO(BE): kirim data pendaftaran warga baru (termasuk file dokumen
  // pendukung) ke API kependudukan, kemungkinan lewat multipart/form-data.
  await new Promise((resolve) => setTimeout(resolve, 600));
  residentStore.registerNewResident({
    ...registerForm,
    supportingDocument: supportingDocumentFile.value,
  });
  isRegistering.value = false;
  step.value = "catalog";
}

function backToVerifyFromRegister() {
  step.value = "verify";
}

/* STEP 3 — Katalog Layanan Surat (fitur yang sudah dibuat sebelumnya) */

const DEFAULT_CATEGORY = LETTER_CATEGORIES[0].value;
const TOTAL_APPLICATIONS = 1248;

const searchQuery = ref("");
const activeCategory = ref(
  LETTER_CATEGORIES.some((category) => category.value === route.query.category)
    ? route.query.category
    : DEFAULT_CATEGORY,
);

watch(
  () => route.query.category,
  (categoryFromQuery) => {
    if (categoryFromQuery && categoryFromQuery !== activeCategory.value) {
      activeCategory.value = categoryFromQuery;
    }
  },
);

function selectCategory(categoryValue) {
  activeCategory.value = categoryValue;
  router.replace({ query: { ...route.query, category: categoryValue } });
}

const filteredServices = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase();
  return LETTER_SERVICES.filter((service) => {
    const matchesCategory = service.category === activeCategory.value;
    const matchesKeyword =
      !keyword ||
      service.title.toLowerCase().includes(keyword) ||
      service.shortCode.toLowerCase().includes(keyword) ||
      service.description.toLowerCase().includes(keyword);
    return matchesCategory && matchesKeyword;
  });
});

function badgeTagSeverity(badgeName) {
  return BADGE_STYLES[badgeName]?.tag ?? BADGE_STYLES.Umum.tag;
}

/* Palet warna pastel (versi lebih jelas/bold) untuk kartu layanan,
   dikelompokkan berdasarkan nama badge (Sosial, Ekonomi, Umum).
   Tambahkan key baru di sini kalau ada badge lain yang dipakai
   di data/letterServices.js */
const CARD_PASTEL_STYLES = {
  Sosial: {
    card: "bg-gradient-to-br from-sky-100 to-blue-50 border-sky-200 hover:border-sky-400 hover:shadow-sky-200/70",
    icon: "bg-sky-500 text-white",
    accent: "bg-sky-400",
  },
  Ekonomi: {
    card: "bg-gradient-to-br from-amber-100 to-orange-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-200/70",
    icon: "bg-amber-500 text-white",
    accent: "bg-amber-400",
  },
  Umum: {
    card: "bg-gradient-to-br from-violet-100 to-purple-50 border-violet-200 hover:border-violet-400 hover:shadow-violet-200/70",
    icon: "bg-violet-500 text-white",
    accent: "bg-violet-400",
  },
};

const DEFAULT_PASTEL_STYLE = {
  card: "bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 hover:border-slate-400 hover:shadow-slate-200/70",
  icon: "bg-slate-500 text-white",
  accent: "bg-slate-400",
};

function cardPastelClass(badgeName) {
  return (CARD_PASTEL_STYLES[badgeName] ?? DEFAULT_PASTEL_STYLE).card;
}

function iconPastelClass(badgeName) {
  return (CARD_PASTEL_STYLES[badgeName] ?? DEFAULT_PASTEL_STYLE).icon;
}

function accentPastelClass(badgeName) {
  return (CARD_PASTEL_STYLES[badgeName] ?? DEFAULT_PASTEL_STYLE).accent;
}

function openApplication(service) {
  letterApplicationStore.reset();
  letterApplicationStore.setLetterType(service.slug);
  router.push(`/services/apply/${service.slug}/personal-data`);
}

function changeNik() {
  residentStore.reset();
  nikInput.value = "";
  step.value = "verify";
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- ================= STEP: Verifikasi NIK ================= -->
    <div v-if="step === 'verify'" class="max-w-md mx-auto py-10">
      <div class="relative overflow-hidden rounded-2xl border-2 border-[#1e3a5f]/15 bg-gradient-to-br from-[#1e3a5f]/5 via-white to-sky-50 p-6 sm:p-8 text-center shadow-lg">
        <span class="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#1e3a5f]/10" />
        <span class="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-sky-200/30" />

        <span class="relative flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[#1e3a5f] text-white text-2xl shadow-md">
          <i class="pi pi-shield" />
        </span>
        <h1 class="relative text-xl font-semibold text-[var(--color-text-h)] mt-4">Verifikasi Data Warga</h1>
        <p class="relative text-sm mt-1 text-[var(--color-text-muted)]">
          Masukkan Nomor Induk Kependudukan (NIK) Anda untuk memastikan Anda
          sudah terdaftar sebagai warga kelurahan ini sebelum mengajukan surat.
        </p>

        <div class="relative mt-6 text-left flex flex-col gap-1">
          <label for="verify-nik" class="text-sm font-semibold text-[var(--color-text-h)]">NIK</label>
          <InputText
            id="verify-nik"
            v-model="nikInput"
            maxlength="16"
            placeholder="16 Digit NIK"
            :invalid="!!nikError"
            class="!border-2 !border-[#1e3a5f]/20 focus:!border-[#1e3a5f] !rounded-xl !py-3"
            @keyup.enter="checkNik"
          />
          <small v-if="nikError" class="text-red-500">{{ nikError }}</small>
        </div>

        <Message v-if="residentNotFound" severity="warn" :closable="false" class="relative mt-4 text-left">
          <span class="font-medium">NIK tidak ditemukan.</span>
          Anda belum terdaftar sebagai warga di kelurahan ini. Silakan lengkapi
          pendaftaran warga baru terlebih dahulu.
          <div class="mt-3">
            <Button label="Daftar Sebagai Warga Baru" size="small" icon="pi pi-user-plus" @click="goToRegistration" />
          </div>
        </Message>

        <Button
          label="Cek Data"
          icon="pi pi-search"
          class="relative w-full mt-4 !bg-[#1e3a5f] !border-[#1e3a5f] hover:!bg-[#2d5580] !py-3 !shadow-md"
          :loading="isChecking"
          @click="checkNik"
        />
      </div>
    </div>

    <!-- ================= STEP: Pendaftaran warga baru ================= -->
    <div v-else-if="step === 'register'" class="max-w-2xl mx-auto py-10">
      <div class="rounded-2xl border border-surface-200 bg-white p-6 sm:p-8">
        <Button
          label="Kembali ke Cek NIK"
          icon="pi pi-arrow-left"
          text
          size="small"
          class="!px-0"
          @click="backToVerifyFromRegister"
        />

        <h1 class="text-xl font-semibold text-[var(--color-text-h)] mt-3">Pendaftaran Warga Baru</h1>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">
          NIK <span class="font-medium text-[var(--color-text-h)]">{{ residentStore.nik }}</span>
          belum terdaftar. Lengkapi data berikut untuk mendaftar sebagai warga
          sebelum melanjutkan pengajuan surat.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div class="flex flex-col gap-1">
            <label for="reg-full-name" class="text-sm text-[var(--color-text-h)]">Nama Lengkap</label>
            <InputText id="reg-full-name" v-model="registerForm.fullName" placeholder="Sesuai KTP" :invalid="!!registerErrors.fullName" />
            <small v-if="registerErrors.fullName" class="text-red-500">{{ registerErrors.fullName }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label for="reg-gender" class="text-sm text-[var(--color-text-h)]">Jenis Kelamin</label>
            <Select
              id="reg-gender"
              v-model="registerForm.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pilih jenis kelamin"
              :invalid="!!registerErrors.gender"
              class="w-full"
            />
            <small v-if="registerErrors.gender" class="text-red-500">{{ registerErrors.gender }}</small>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-[var(--color-text-h)]">Tempat, Tanggal Lahir</label>
            <div class="flex gap-2">
              <InputText v-model="registerForm.placeOfBirth" placeholder="Kota/Kabupaten" class="flex-1" :invalid="!!registerErrors.placeOfBirth" />
              <DatePicker
                v-model="registerForm.dateOfBirth"
                showIcon
                iconDisplay="input"
                dateFormat="dd/mm/yy"
                placeholder="Tanggal"
                class="w-36"
                :invalid="!!registerErrors.dateOfBirth"
              />
            </div>
            <small v-if="registerErrors.placeOfBirth || registerErrors.dateOfBirth" class="text-red-500">
              {{ registerErrors.placeOfBirth || registerErrors.dateOfBirth }}
            </small>
          </div>

          <div class="flex flex-col gap-1">
            <label for="reg-whatsapp" class="text-sm text-[var(--color-text-h)]">Nomor WhatsApp</label>
            <InputText id="reg-whatsapp" v-model="registerForm.whatsappNumber" placeholder="+62 8xx-xxxx-xxxx" :invalid="!!registerErrors.whatsappNumber" />
            <small v-if="registerErrors.whatsappNumber" class="text-red-500">{{ registerErrors.whatsappNumber }}</small>
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label for="reg-occupation" class="text-sm text-[var(--color-text-h)]">Pekerjaan</label>
            <InputText id="reg-occupation" v-model="registerForm.occupation" placeholder="Contoh: Buruh" :invalid="!!registerErrors.occupation" />
            <small v-if="registerErrors.occupation" class="text-red-500">{{ registerErrors.occupation }}</small>
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label for="reg-address" class="text-sm text-[var(--color-text-h)]">Alamat Lengkap</label>
            <Textarea
              id="reg-address"
              v-model="registerForm.fullAddress"
              rows="3"
              autoResize
              placeholder="Sesuai domisili saat ini (Jalan, RT/RW, Dusun)"
              :invalid="!!registerErrors.fullAddress"
            />
            <small v-if="registerErrors.fullAddress" class="text-red-500">{{ registerErrors.fullAddress }}</small>
          </div>

          <div class="flex flex-col gap-1 sm:col-span-2">
            <label class="text-sm text-[var(--color-text-h)]">Dokumen Pendukung (KTP/KK)</label>

            <div
              class="rounded-xl border border-dashed p-4"
              :class="registerErrors.supportingDocument ? 'border-red-400 bg-red-50' : 'border-surface-300 bg-surface-50'"
            >
              <div v-if="supportingDocumentName" class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-2">
                  <i class="pi pi-file text-[var(--color-text-muted)]" />
                  <span class="truncate text-sm text-[var(--color-text-h)]">{{ supportingDocumentName }}</span>
                </div>
                <Button icon="pi pi-times" text rounded severity="danger" aria-label="Hapus dokumen" @click="removeSupportingDocument" />
              </div>

              <div v-else class="flex flex-col items-center gap-2 py-4 text-center">
                <i class="pi pi-cloud-upload text-2xl text-[var(--color-text-muted)]" />
                <span class="text-xs text-[var(--color-text-muted)]">
                  Unggah foto/scan KTP atau Kartu Keluarga (JPG, PNG, atau PDF)
                </span>
                <FileUpload
                  mode="basic"
                  name="supportingDocument"
                  accept="image/*,.pdf"
                  chooseLabel="Pilih Dokumen"
                  chooseIcon="pi pi-upload"
                  :auto="false"
                  :customUpload="true"
                  class="[&_input[type='file']]:hidden"
                  @select="handleSupportingDocumentSelect"
                />
              </div>
            </div>

            <small v-if="registerErrors.supportingDocument" class="text-red-500">{{ registerErrors.supportingDocument }}</small>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-surface-200">
          <Button label="Batal" severity="secondary" outlined @click="backToVerifyFromRegister" />
          <Button
            label="Daftar &amp; Lanjutkan"
            icon="pi pi-arrow-right"
            iconPos="right"
            :loading="isRegistering"
            @click="submitRegistration"
          />
        </div>
      </div>
    </div>

    <!-- ================= STEP: Katalog Layanan Surat ================= -->
    <template v-else>
      <div class="flex items-center justify-between gap-3 mb-4">
        <p class="text-xs text-[var(--color-text-muted)]">
          Masuk sebagai
          <span class="font-medium text-[var(--color-text-h)]">{{ residentStore.resident?.fullName }}</span>
        </p>
        <Button label="Ganti NIK" icon="pi pi-refresh" text size="small" @click="changeNik" />
      </div>

      <!-- Hero -->
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2d5580] p-6 sm:p-8">
        <span class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span class="pointer-events-none absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-white/10" />

        <div class="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold !text-white">Layanan Surat</h1>
            <p class="text-sm mt-1 max-w-xl !text-white/85">
              Akses cepat dan mudah untuk pengajuan berbagai dokumen kependudukan dan
              surat keterangan resmi.
            </p>
          </div>

          <div class="flex items-center gap-3 rounded-xl bg-white/95 backdrop-blur px-4 py-3 shrink-0 shadow-lg">
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a5f]/10 text-[#1e3a5f]">
              <i class="pi pi-file" />
            </span>
            <div class="leading-tight">
              <p class="text-[10px] tracking-wide uppercase text-[var(--color-text-muted)]">Total Permohonan</p>
              <p class="text-lg font-semibold text-[var(--color-text-h)]">
                {{ TOTAL_APPLICATIONS.toLocaleString("id-ID") }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Search box -->
      <div class="mt-6 rounded-2xl border-2 border-[#1e3a5f]/15 bg-gradient-to-br from-[#1e3a5f]/5 to-white p-6 shadow-sm">
        <label class="text-sm font-semibold text-[var(--color-text-h)] flex items-center gap-2" for="service-search">
          <i class="pi pi-search text-[#1e3a5f]" />
          Cari Layanan Surat
        </label>
        <IconField class="mt-2 block">
          <InputIcon class="pi pi-search" />
          <InputText
            id="service-search"
            v-model="searchQuery"
            class="w-full !border-2 !border-[#1e3a5f]/20 focus:!border-[#1e3a5f] !rounded-xl !py-3"
            placeholder="Ketik jenis surat (Cth: SKTM, SKU)..."
          />
        </IconField>
      </div>

      <!-- Tab kategori -->
      <div class="mt-6 flex flex-wrap gap-2">
        <Button
          v-for="category in LETTER_CATEGORIES"
          :key="category.value"
          :label="category.label"
          rounded
          size="small"
          :class="activeCategory === category.value ? '!bg-[#1e3a5f] !border-[#1e3a5f] !shadow-md' : '!bg-white'"
          :severity="activeCategory === category.value ? 'contrast' : 'secondary'"
          :outlined="activeCategory !== category.value"
          @click="selectCategory(category.value)"
        />
      </div>

      <!-- Grid card layanan (warna pastel per kategori) -->
      <div
        v-if="filteredServices.length"
        class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <button
          v-for="service in filteredServices"
          :key="service.slug"
          type="button"
          class="group relative overflow-hidden text-left rounded-2xl border-2 p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          :class="cardPastelClass(service.badge)"
          @click="openApplication(service)"
        >
          <!-- Aksen strip warna di sisi kiri kartu -->
          <span class="absolute inset-y-0 left-0 w-1.5" :class="accentPastelClass(service.badge)" />

          <!-- Lingkaran dekoratif transparan di pojok kanan atas -->
          <span
            class="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 transition-transform duration-300 group-hover:scale-125"
            :class="accentPastelClass(service.badge)"
          />

          <div class="relative flex items-start justify-between">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-xl text-xl shadow-md transition-transform duration-200 group-hover:scale-110"
              :class="iconPastelClass(service.badge)"
            >
              <i :class="service.icon" />
            </span>
            <Tag :value="service.badge" :severity="badgeTagSeverity(service.badge)" rounded class="font-semibold" />
          </div>

          <div class="relative">
            <h3 class="font-semibold text-[var(--color-text-h)]">{{ service.title }}</h3>
            <p class="text-sm mt-1 text-[var(--color-text-muted)]">{{ service.description }}</p>
          </div>

          <div class="relative flex items-center gap-1 text-xs font-medium text-[var(--color-text-h)] mt-1 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
            <span>Ajukan sekarang</span>
            <i class="pi pi-arrow-right text-[10px]" />
          </div>
        </button>
      </div>

      <!-- Empty state -->
      <div v-else class="mt-6 rounded-2xl border border-dashed border-surface-300 p-10 text-center">
        <i class="pi pi-inbox text-2xl text-[var(--color-text-muted)]" />
        <p class="mt-3 text-sm text-[var(--color-text-muted)]">
          Tidak ada layanan surat yang cocok dengan pencarian atau kategori ini.
        </p>
      </div>
    </template>
  </div>
</template>