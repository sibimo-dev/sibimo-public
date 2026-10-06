<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";
import { REGISTRATION_DOCS } from "@/data/registrationDocs";

const router = useRouter();
const draft = useRegistrationDraftStore();
if (!draft.selectedDocs.length) router.replace({ name: "general-register-select-letters" });

const form = draft.form;
const errors = ref({});

const genderOptions = ["Laki-laki", "Perempuan"];
const educationOptions = ["Belum Sekolah", "Tidak Sekolah", "SD", "SMP", "SMA/SMK", "D3", "D4", "S1", "S2", "S3"];
const maritalStatusOptions = ["Belum Kawin", "Kawin", "Kawin Tercatat", "Kawin Belum Tercatat", "Cerai Hidup", "Cerai Mati"];
const religionOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Khonghucu"];
const occupationOptions = ["Belum/Tidak Bekerja", "Pelajar/Mahasiswa", "Ibu Rumah Tangga", "Petani", "Nelayan", "Buruh", "Wiraswasta", "Karyawan Swasta", "PNS/ASN", "TNI/Polri", "Pensiunan"];

/* Isian tambahan sesuai surat yang dipilih */
const extraGroups = computed(() =>
  REGISTRATION_DOCS.filter((d) => draft.selectedDocs.includes(d.value) && d.fields.length),
);

function validate() {
  const e = {};
  if (!form.fullName.trim()) e.fullName = "Nama lengkap wajib diisi.";
  if (!form.familyCardNumber.trim()) e.familyCardNumber = "Nomor KK wajib diisi.";
  if (!form.gender) e.gender = "Jenis kelamin wajib dipilih.";
  if (!form.birthPlace.trim()) e.birthPlace = "Tempat lahir wajib diisi.";
  if (!form.birthDate) e.birthDate = "Tanggal lahir wajib diisi.";
  if (!form.address.trim()) e.address = "Alamat saat ini wajib diisi.";
  if (!form.ktpAddress.trim()) e.ktpAddress = "Alamat sesuai KTP wajib diisi.";
  if (form.phoneNumber.trim().length < 9) e.phoneNumber = "Nomor WhatsApp tidak valid.";
  if (!form.occupation.trim()) e.occupation = "Pekerjaan wajib diisi.";
  for (const group of extraGroups.value) {
    for (const f of group.fields) {
      if (!draft.extra[f.key]) e[f.key] = `${f.label} wajib diisi.`;
    }
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

function next() {
  if (validate()) router.push({ name: "general-register-documents" });
}
</script>

<template>
  <div>
    <h1 class="text-xl font-semibold text-[var(--color-text-h)]">Data Diri</h1>
    <p class="text-sm mt-1 text-[var(--color-text-muted)]">Lengkapi data berikut sesuai dokumen asli Anda.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <div class="flex flex-col gap-1">
        <label for="reg-full-name" class="text-sm text-[var(--color-text-h)]">Nama Lengkap</label>
        <InputText id="reg-full-name" v-model="form.fullName" placeholder="Sesuai KTP" :invalid="!!errors.fullName" />
        <small v-if="errors.fullName" class="text-red-500">{{ errors.fullName }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-kk" class="text-sm text-[var(--color-text-h)]">Nomor KK</label>
        <InputText id="reg-kk" v-model="form.familyCardNumber" maxlength="16" placeholder="16 Digit Nomor KK" :invalid="!!errors.familyCardNumber" />
        <small v-if="errors.familyCardNumber" class="text-red-500">{{ errors.familyCardNumber }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-gender" class="text-sm text-[var(--color-text-h)]">Jenis Kelamin</label>
        <Select id="reg-gender" v-model="form.gender" :options="genderOptions" placeholder="Pilih jenis kelamin" :invalid="!!errors.gender" class="w-full" />
        <small v-if="errors.gender" class="text-red-500">{{ errors.gender }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm text-[var(--color-text-h)]">Tempat, Tanggal Lahir</label>
        <div class="flex gap-2">
          <InputText v-model="form.birthPlace" placeholder="Kota/Kabupaten" class="flex-1" :invalid="!!errors.birthPlace" />
          <DatePicker v-model="form.birthDate" showIcon iconDisplay="input" dateFormat="dd/mm/yy" placeholder="Tanggal" class="w-36" :invalid="!!errors.birthDate" />
        </div>
        <small v-if="errors.birthPlace || errors.birthDate" class="text-red-500">{{ errors.birthPlace || errors.birthDate }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-wa" class="text-sm text-[var(--color-text-h)]">Nomor WhatsApp</label>
        <InputText id="reg-wa" v-model="form.phoneNumber" placeholder="+62 8xx-xxxx-xxxx" :invalid="!!errors.phoneNumber" />
        <small v-if="errors.phoneNumber" class="text-red-500">{{ errors.phoneNumber }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="reg-occupation" class="text-sm text-[var(--color-text-h)]">Pekerjaan</label>
        <Select id="reg-occupation" v-model="form.occupation" :options="occupationOptions" editable placeholder="Pilih atau ketik pekerjaan" :invalid="!!errors.occupation" class="w-full" />
        <small v-if="errors.occupation" class="text-red-500">{{ errors.occupation }}</small>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm text-[var(--color-text-h)]">Pendidikan</label>
        <Select v-model="form.education" :options="educationOptions" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-[var(--color-text-h)]">Status Pernikahan</label>
        <Select v-model="form.maritalStatus" :options="maritalStatusOptions" class="w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-[var(--color-text-h)]">Agama</label>
        <Select v-model="form.religion" :options="religionOptions" class="w-full" />
      </div>

      <div class="flex flex-col gap-1 sm:col-span-2">
        <label for="reg-address" class="text-sm text-[var(--color-text-h)]">Alamat Saat Ini</label>
        <Textarea id="reg-address" v-model="form.address" rows="3" autoResize placeholder="Sesuai domisili saat ini (Jalan, RT/RW, Dusun)" :invalid="!!errors.address" />
        <small v-if="errors.address" class="text-red-500">{{ errors.address }}</small>
      </div>

      <div class="flex flex-col gap-1 sm:col-span-2">
        <label for="reg-ktp-address" class="text-sm text-[var(--color-text-h)]">Alamat Sesuai KTP</label>
        <Textarea id="reg-ktp-address" v-model="form.ktpAddress" rows="3" autoResize placeholder="Sesuai KTP (Jalan, RT/RW, Dusun)" :invalid="!!errors.ktpAddress" />
        <small v-if="errors.ktpAddress" class="text-red-500">{{ errors.ktpAddress }}</small>
      </div>
    </div>

    <!-- Isian tambahan per surat yang dipilih -->
    <div v-for="group in extraGroups" :key="group.value" class="mt-6 rounded-xl border border-violet-200 bg-violet-50/70 p-4">
      <p class="text-sm font-semibold text-[var(--color-text-h)] flex items-center gap-2">
        <i :class="group.icon" class="text-violet-600" /> Data untuk {{ group.label }}
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        <div v-for="f in group.fields" :key="f.key" class="flex flex-col gap-1" :class="f.type === 'textarea' ? 'sm:col-span-2' : ''">
          <label :for="`extra-${f.key}`" class="text-sm text-[var(--color-text-h)]">{{ f.label }}</label>
          <Select v-if="f.type === 'select'" :id="`extra-${f.key}`" v-model="draft.extra[f.key]" :options="f.options" placeholder="Pilih" :invalid="!!errors[f.key]" class="w-full" />
          <DatePicker v-else-if="f.type === 'date'" :id="`extra-${f.key}`" v-model="draft.extra[f.key]" showIcon iconDisplay="input" dateFormat="dd/mm/yy" :invalid="!!errors[f.key]" />
          <Textarea v-else-if="f.type === 'textarea'" :id="`extra-${f.key}`" v-model="draft.extra[f.key]" rows="3" autoResize :invalid="!!errors[f.key]" />
          <InputText v-else :id="`extra-${f.key}`" v-model="draft.extra[f.key]" :invalid="!!errors[f.key]" />
          <small v-if="errors[f.key]" class="text-red-500">{{ errors[f.key] }}</small>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6 pt-6 border-t border-surface-200">
      <Button label="Kembali" icon="pi pi-arrow-left" severity="secondary" outlined @click="router.push({ name: 'general-register-select-letters' })" />
      <Button label="Lanjut" icon="pi pi-arrow-right" iconPos="right" class="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700" @click="next" />
    </div>
  </div>
</template>
