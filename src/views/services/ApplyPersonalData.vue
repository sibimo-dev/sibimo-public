<script setup>

import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import { useLetterApplicationStore } from "@/stores/letterApplication";
import { useResidentVerificationStore } from "@/stores/residentVerification";

const router = useRouter();
const letterApplicationStore = useLetterApplicationStore();
const residentStore = useResidentVerificationStore();

const currentService = computed(() => letterApplicationStore.currentService);
const letterType = computed(() => letterApplicationStore.letterType);

const form = reactive({ ...letterApplicationStore.personalData });
const economicForm = reactive({ ...letterApplicationStore.economicData });

onMounted(() => {
  const resident = residentStore.resident;
  if (!resident) return;

  if (!form.fullName) form.fullName = resident.fullName ?? "";
  if (!form.nationalId) form.nationalId = residentStore.nik ?? "";
  if (!form.placeOfBirth) form.placeOfBirth = resident.placeOfBirth ?? "";
  if (!form.dateOfBirth && resident.dateOfBirth) form.dateOfBirth = new Date(resident.dateOfBirth);
  if (!form.whatsappNumber) form.whatsappNumber = resident.whatsappNumber ?? "";
  if (!form.occupation) form.occupation = resident.occupation ?? "";
  if (!form.fullAddress) form.fullAddress = resident.fullAddress ?? "";
});

const errors = ref({});

function validate() {
  const nextErrors = {};

  if (!form.fullName.trim()) nextErrors.fullName = "Nama lengkap wajib diisi.";
  if (!/^\d{16}$/.test(form.nationalId.trim())) nextErrors.nationalId = "NIK harus 16 digit angka.";
  if (!form.placeOfBirth.trim()) nextErrors.placeOfBirth = "Tempat lahir wajib diisi.";
  if (!form.dateOfBirth) nextErrors.dateOfBirth = "Tanggal lahir wajib diisi.";
  if (form.whatsappNumber.trim().length < 9) nextErrors.whatsappNumber = "Nomor WhatsApp tidak valid.";
  if (!form.occupation.trim()) nextErrors.occupation = "Pekerjaan wajib diisi.";
  if (!form.fullAddress.trim()) nextErrors.fullAddress = "Alamat lengkap wajib diisi.";
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
              <label class="text-sm text-[var(--color-text-h)]">Tempat, Tanggal Lahir</label>
              <div class="flex gap-2">
                <InputText v-model="form.placeOfBirth" placeholder="Kota/Kabupaten" class="flex-1" :invalid="!!errors.placeOfBirth" />
                <DatePicker
                  v-model="form.dateOfBirth"
                  showIcon
                  iconDisplay="input"
                  dateFormat="dd/mm/yy"
                  placeholder="Tanggal"
                  class="w-36"
                  :invalid="!!errors.dateOfBirth"
                />
              </div>
              <small v-if="errors.placeOfBirth || errors.dateOfBirth" class="text-red-500">
                {{ errors.placeOfBirth || errors.dateOfBirth }}
              </small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="whatsapp-number" class="text-sm text-[var(--color-text-h)]">Nomor WhatsApp</label>
              <InputText id="whatsapp-number" v-model="form.whatsappNumber" placeholder="+62 8xx-xxxx-xxxx" :invalid="!!errors.whatsappNumber" />
              <small v-if="errors.whatsappNumber" class="text-red-500">{{ errors.whatsappNumber }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="occupation" class="text-sm text-[var(--color-text-h)]">Pekerjaan</label>
              <InputText id="occupation" v-model="form.occupation" placeholder="Buruh" :invalid="!!errors.occupation" />
              <small v-if="errors.occupation" class="text-red-500">{{ errors.occupation }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label for="full-address" class="text-sm text-[var(--color-text-h)]">Alamat Lengkap</label>
              <InputText id="full-address" v-model="form.fullAddress" placeholder="Sesuai KTP (Jalan, RT/RW)" :invalid="!!errors.fullAddress" />
              <small v-if="errors.fullAddress" class="text-red-500">{{ errors.fullAddress }}</small>
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