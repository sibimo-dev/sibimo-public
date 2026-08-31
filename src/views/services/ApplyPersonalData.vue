<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import Button from "primevue/button";
import { useLetterApplicationStore } from "@/stores/letterApplication";
import { useResidentVerificationStore } from "@/stores/residentVerification";

const router = useRouter();
const letterApplicationStore = useLetterApplicationStore();
const residentStore = useResidentVerificationStore();

const currentService = computed(() => letterApplicationStore.currentService);
const letterType = computed(() => letterApplicationStore.letterType);

const genderOptions = ["Laki-laki", "Perempuan"];
const educationOptions = ["Belum Sekolah", "Tidak Sekolah", "SD", "SMP", "SMA/SMK", "D3", "D4", "S1", "S2", "S3"];
const maritalStatusOptions = ["Belum Kawin", "Kawin", "Kawin Tercatat", "Kawin Belum Tercatat", "Cerai Hidup", "Cerai Mati"];
const religionOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Khonghucu"];
const occupationOptions = [
  "Belum/Tidak Bekerja",
  "Pelajar/Mahasiswa",
  "Ibu Rumah Tangga",
  "Petani",
  "Nelayan",
  "Buruh",
  "Wiraswasta",
  "Karyawan Swasta",
  "PNS/ASN",
  "TNI/Polri",
  "Pensiunan",
];

const form = reactive({ ...letterApplicationStore.personalData });
const economicForm = reactive({ ...letterApplicationStore.economicData });

onMounted(() => {
  const resident = residentStore.resident;
  if (!resident) return;

  if (!form.fullName) form.fullName = resident.fullName ?? "";
  if (!form.nationalId) form.nationalId = residentStore.nik ?? "";
  if (!form.familyCardNumber) form.familyCardNumber = resident.familyCardNumber ?? "";
  form.gender = resident.gender ?? form.gender;
  if (!form.birthPlace) form.birthPlace = resident.birthPlace ?? "";
  if (!form.birthDate && resident.birthDate) form.birthDate = new Date(resident.birthDate);
  if (!form.phoneNumber) form.phoneNumber = resident.phoneNumber ?? "";
  if (!form.occupation) form.occupation = resident.occupation ?? "";
  form.education = resident.education ?? form.education;
  form.maritalStatus = resident.maritalStatus ?? form.maritalStatus;
  form.religion = resident.religion ?? form.religion;
  if (!form.address) form.address = resident.address ?? "";
  if (!form.ktpAddress) form.ktpAddress = resident.ktpAddress ?? resident.address ?? "";
});

const errors = ref({});

function validate() {
  const nextErrors = {};

  if (!form.fullName.trim()) nextErrors.fullName = "Nama lengkap wajib diisi.";
  if (!/^\d{16}$/.test(form.nationalId.trim())) nextErrors.nationalId = "NIK harus 16 digit angka.";
  if (!form.familyCardNumber.trim()) nextErrors.familyCardNumber = "Nomor KK wajib diisi.";
  if (!form.gender) nextErrors.gender = "Jenis kelamin wajib dipilih.";
  if (!form.birthPlace.trim()) nextErrors.birthPlace = "Tempat lahir wajib diisi.";
  if (!form.birthDate) nextErrors.birthDate = "Tanggal lahir wajib diisi.";
  if (form.phoneNumber.trim().length < 9) nextErrors.phoneNumber = "Nomor WhatsApp tidak valid.";
  if (!form.occupation.trim()) nextErrors.occupation = "Pekerjaan wajib diisi.";
  if (!form.address.trim()) nextErrors.address = "Alamat saat ini wajib diisi.";
  if (!form.ktpAddress.trim()) nextErrors.ktpAddress = "Alamat sesuai KTP wajib diisi.";
  if (!form.applicationPurpose.trim()) nextErrors.applicationPurpose = "Tujuan pengajuan wajib diisi.";

  if (currentService.value?.requiresEconomicData) {
    if (economicForm.monthlyIncome === null || economicForm.monthlyIncome === "") {
      nextErrors.monthlyIncome = "Penghasilan rata-rata wajib diisi.";
    }
    if (economicForm.dependentsCount === null || economicForm.dependentsCount === "") {
      nextErrors.dependentsCount = "Jumlah tanggungan wajib diisi.";
    }
    if (!economicForm.economicNotes.trim()) {
      nextErrors.economicNotes = "Keterangan kondisi ekonomi wajib diisi.";
    }
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

function goNext() {
  if (!validate()) return;
  letterApplicationStore.updatePersonalData(form);
  if (currentService.value?.requiresEconomicData) {
    letterApplicationStore.updateEconomicData(economicForm);
  }
  router.push(`/services/apply/${letterType.value}/documents`);
}

function goBack() {
  router.push("/services");
}
</script>

<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text-h)]">Masukkan Data Diri</h2>
    <p class="text-sm mt-1 text-[var(--color-text-muted)]">
      Lengkapi data pribadi dan detail keperluan untuk {{ currentService?.title ?? "surat ini" }}.
      Sebagian data sudah terisi otomatis dari hasil verifikasi NIK Anda.
    </p>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Form -->
      <div class="lg:col-span-2 rounded-2xl border border-surface-200 p-5 sm:p-6 space-y-6">
        <div>
          <p class="text-sm font-semibold text-[var(--color-text-h)]">Data Pribadi</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div class="flex flex-col gap-1">
              <label for="full-name" class="text-sm text-[var(--color-text-h)]">Nama Lengkap</label>
              <InputText id="full-name" v-model="form.fullName" placeholder="Sesuai KTP" :invalid="!!errors.fullName" />
              <small v-if="errors.fullName" class="text-red-500">{{ errors.fullName }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="national-id" class="text-sm text-[var(--color-text-h)]">NIK</label>
              <InputText id="national-id" v-model="form.nationalId" maxlength="16" placeholder="16 Digit NIK" :invalid="!!errors.nationalId" />
              <small v-if="errors.nationalId" class="text-red-500">{{ errors.nationalId }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="family-card-number" class="text-sm text-[var(--color-text-h)]">Nomor KK</label>
              <InputText id="family-card-number" v-model="form.familyCardNumber" maxlength="16" placeholder="16 Digit Nomor KK" :invalid="!!errors.familyCardNumber" />
              <small v-if="errors.familyCardNumber" class="text-red-500">{{ errors.familyCardNumber }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="gender" class="text-sm text-[var(--color-text-h)]">Jenis Kelamin</label>
              <Select
                id="gender"
                v-model="form.gender"
                :options="genderOptions"
                placeholder="Pilih jenis kelamin"
                :invalid="!!errors.gender"
                class="w-full"
              />
              <small v-if="errors.gender" class="text-red-500">{{ errors.gender }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm text-[var(--color-text-h)]">Tempat, Tanggal Lahir</label>
              <div class="flex gap-2">
                <InputText v-model="form.birthPlace" placeholder="Kota/Kabupaten" class="flex-1" :invalid="!!errors.birthPlace" />
                <DatePicker
                  v-model="form.birthDate"
                  showIcon
                  iconDisplay="input"
                  dateFormat="dd/mm/yy"
                  placeholder="Tanggal"
                  class="w-36"
                  :invalid="!!errors.birthDate"
                />
              </div>
              <small v-if="errors.birthPlace || errors.birthDate" class="text-red-500">
                {{ errors.birthPlace || errors.birthDate }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="whatsapp-number" class="text-sm text-[var(--color-text-h)]">Nomor WhatsApp</label>
              <InputText id="whatsapp-number" v-model="form.phoneNumber" placeholder="+62 8xx-xxxx-xxxx" :invalid="!!errors.phoneNumber" />
              <small v-if="errors.phoneNumber" class="text-red-500">{{ errors.phoneNumber }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="occupation" class="text-sm text-[var(--color-text-h)]">Pekerjaan</label>
              <Select
                id="occupation"
                v-model="form.occupation"
                :options="occupationOptions"
                editable
                placeholder="Pilih atau ketik pekerjaan"
                :invalid="!!errors.occupation"
                class="w-full"
              />
              <small v-if="errors.occupation" class="text-red-500">{{ errors.occupation }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="education" class="text-sm text-[var(--color-text-h)]">Pendidikan</label>
              <Select id="education" v-model="form.education" :options="educationOptions" class="w-full" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="marital-status" class="text-sm text-[var(--color-text-h)]">Status Pernikahan</label>
              <Select id="marital-status" v-model="form.maritalStatus" :options="maritalStatusOptions" class="w-full" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="religion" class="text-sm text-[var(--color-text-h)]">Agama</label>
              <Select id="religion" v-model="form.religion" :options="religionOptions" class="w-full" />
            </div>

            <div class="flex flex-col gap-1">
              <label for="current-address" class="text-sm text-[var(--color-text-h)]">Alamat Saat Ini</label>
              <InputText id="current-address" v-model="form.address" placeholder="Alamat domisili saat ini (Jalan, RT/RW)" :invalid="!!errors.address" />
              <small v-if="errors.address" class="text-red-500">{{ errors.address }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="ktp-address" class="text-sm text-[var(--color-text-h)]">Alamat Sesuai KTP</label>
              <InputText id="ktp-address" v-model="form.ktpAddress" placeholder="Sesuai KTP (Jalan, RT/RW)" :invalid="!!errors.ktpAddress" />
              <small v-if="errors.ktpAddress" class="text-red-500">{{ errors.ktpAddress }}</small>
            </div>
          </div>
        </div>

        <!-- Data ekonomi, hanya tampil untuk surat yang membutuhkan (mis. SKTM) -->
        <div v-if="currentService?.requiresEconomicData" class="pt-2 border-t border-surface-200">
          <p class="text-sm font-semibold text-[var(--color-text-h)] pt-4">Data Ekonomi &amp; Tanggungan</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div class="flex flex-col gap-1">
              <label for="monthly-income" class="text-sm text-[var(--color-text-h)]">
                Penghasilan Rata-rata per Bulan (Rp)
              </label>
              <InputNumber
                id="monthly-income"
                v-model="economicForm.monthlyIncome"
                mode="currency"
                currency="IDR"
                locale="id-ID"
                :invalid="!!errors.monthlyIncome"
              />
              <small v-if="errors.monthlyIncome" class="text-red-500">{{ errors.monthlyIncome }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="dependents" class="text-sm text-[var(--color-text-h)]">Jumlah Tanggungan Keluarga</label>
              <InputNumber
                id="dependents"
                v-model="economicForm.dependentsCount"
                suffix=" Orang"
                :min="0"
                :invalid="!!errors.dependentsCount"
              />
              <small v-if="errors.dependentsCount" class="text-red-500">{{ errors.dependentsCount }}</small>
            </div>

            <div class="flex flex-col gap-1 sm:col-span-2">
              <label for="economic-notes" class="text-sm text-[var(--color-text-h)]">Keterangan Kondisi Ekonomi</label>
              <Textarea
                id="economic-notes"
                v-model="economicForm.economicNotes"
                rows="3"
                autoResize
                placeholder="Contoh: Penghasilan tidak menentu dari pekerjaan buruh harian lepas"
                :invalid="!!errors.economicNotes"
              />
              <small v-if="errors.economicNotes" class="text-red-500">{{ errors.economicNotes }}</small>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-surface-200">
          <p class="text-sm font-semibold text-[var(--color-text-h)] pt-4">Detail Keperluan</p>
          <div class="flex flex-col gap-1 mt-3">
            <label for="purpose" class="text-sm text-[var(--color-text-h)]">
              {{ currentService?.purposeLabel ?? "Tujuan Pengajuan" }}
            </label>
            <Textarea
              id="purpose"
              v-model="form.applicationPurpose"
              rows="3"
              autoResize
              :placeholder="currentService?.purposePlaceholder ?? 'Jelaskan secara singkat tujuan pengajuan surat'"
              :invalid="!!errors.applicationPurpose"
            />
            <small v-if="errors.applicationPurpose" class="text-red-500">{{ errors.applicationPurpose }}</small>
          </div>
        </div>
      </div>

      <!-- Info panel -->
      <aside class="rounded-2xl bg-slate-800 text-white p-5 h-fit space-y-4">
        <div class="flex items-center gap-2">
          <i class="pi pi-info-circle" />
          <p class="text-sm font-semibold">Informasi Penting</p>
        </div>
        <p class="text-xs leading-relaxed text-slate-200">
          Pastikan data diri yang Anda masukkan sesuai dengan Kartu Tanda Penduduk
          (KTP) dan Kartu Keluarga (KK). Ketidaksesuaian data dapat menyebabkan
          proses verifikasi tertunda.
        </p>

        <div class="rounded-xl bg-slate-700/60 p-4">
          <p class="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
            Syarat Dokumen (Tahap 2)
          </p>
          <ul class="mt-2 space-y-1 text-xs text-slate-100 list-disc list-inside">
            <li v-for="doc in letterApplicationStore.requiredDocuments" :key="doc.key">
              {{ doc.label }}
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <Button label="Batal" severity="secondary" outlined @click="goBack" />
      <Button label="Selanjutnya" icon="pi pi-arrow-right" iconPos="right" @click="goNext" />
    </div>
  </div>
</template>