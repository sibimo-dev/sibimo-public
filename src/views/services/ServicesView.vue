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

function badgeIconClass(badgeName) {
  return BADGE_STYLES[badgeName]?.icon ?? BADGE_STYLES.Umum.icon;
}

function badgeTagSeverity(badgeName) {
  return BADGE_STYLES[badgeName]?.tag ?? BADGE_STYLES.Umum.tag;
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
      <div class="rounded-2xl border border-surface-200 bg-white p-6 sm:p-8 text-center">
        <span class="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-surface-100 text-[var(--color-primary)] text-xl">
          <i class="pi pi-shield" />
        </span>
        <h1 class="text-xl font-semibold text-[var(--color-text-h)] mt-4">Verifikasi Data Warga</h1>
        <p class="text-sm mt-1 text-[var(--color-text-muted)]">
          Masukkan Nomor Induk Kependudukan (NIK) Anda untuk memastikan Anda
          sudah terdaftar sebagai warga kelurahan ini sebelum mengajukan surat.
        </p>

        <div class="mt-6 text-left flex flex-col gap-1">
          <label for="verify-nik" class="text-sm text-[var(--color-text-h)]">NIK</label>
          <InputText
            id="verify-nik"
            v-model="nikInput"
            maxlength="16"
            placeholder="16 Digit NIK"
            :invalid="!!nikError"
            @keyup.enter="checkNik"
          />
          <small v-if="nikError" class="text-red-500">{{ nikError }}</small>
        </div>

        <Message v-if="residentNotFound" severity="warn" :closable="false" class="mt-4 text-left">
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
          class="w-full mt-4"
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
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-[var(--color-text-h)]">Layanan Surat</h1>
          <p class="text-sm mt-1 max-w-xl text-[var(--color-text-muted)]">
            Akses cepat dan mudah untuk pengajuan berbagai dokumen kependudukan dan
            surat keterangan resmi.
          </p>
        </div>

        <div class="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 shrink-0">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-surface-100 text-[var(--color-text-muted)]">
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

      <!-- Search box -->
      <div class="mt-6 rounded-2xl border border-surface-200 bg-surface-50 p-6">
        <label class="text-sm font-medium text-[var(--color-text-h)]" for="service-search">
          Cari Layanan Surat
        </label>
        <IconField class="mt-2 block">
          <InputIcon class="pi pi-search" />
          <InputText
            id="service-search"
            v-model="searchQuery"
            class="w-full"
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
          :severity="activeCategory === category.value ? 'contrast' : 'secondary'"
          :outlined="activeCategory !== category.value"
          @click="selectCategory(category.value)"
        />
      </div>

      <!-- Grid card layanan -->
      <div
        v-if="filteredServices.length"
        class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <button
          v-for="service in filteredServices"
          :key="service.slug"
          type="button"
          class="text-left rounded-2xl border border-surface-200 bg-white p-5 flex flex-col gap-3 transition-shadow hover:shadow-md hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          @click="openApplication(service)"
        >
          <div class="flex items-start justify-between">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
              :class="badgeIconClass(service.badge)"
            >
              <i :class="service.icon" />
            </span>
            <Tag :value="service.badge" :severity="badgeTagSeverity(service.badge)" rounded />
          </div>

          <div>
            <h3 class="font-semibold text-[var(--color-text-h)]">{{ service.title }}</h3>
            <p class="text-sm mt-1 text-[var(--color-text-muted)]">{{ service.description }}</p>
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