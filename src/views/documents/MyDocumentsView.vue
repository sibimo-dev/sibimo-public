<script setup>

import { ref, computed } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'

const nik = ref('')
const submissionCode = ref('')
const hasSearched = ref(false)
const errors = ref({})

const previewVisible = ref(false)
const previewDocument = ref(null)

const documents = ref([
  {
    id: 1,
    nik: '3273123456789012',
    name: 'Surat Keterangan Domisili',
    submissionCode: 'SKD-2026-0217',
    submittedDate: '20/08/2026',
    status: 'Terverifikasi',
    fileUrl: '/documents/skd-0217.pdf',
  },
  {
    id: 2,
    nik: '3273123456789012',
    name: 'Surat Pengantar KTP',
    submissionCode: 'SPK-2026-0842',
    submittedDate: '25/08/2026',
    status: 'Menunggu',
    fileUrl: null,
  },
  {
    id: 3,
    nik: '3273987654321098',
    name: 'Surat Keterangan Usaha',
    submissionCode: 'SKU-2026-0913',
    submittedDate: '24/08/2026',
    status: 'Ditolak',
    fileUrl: null,
  },
  {
    id: 4,
    nik: '3273987654321098',
    name: 'Surat Permohonan Nikah',
    submissionCode: 'SPN-2026-0155',
    submittedDate: '23/08/2026',
    status: 'Terverifikasi',
    fileUrl: '/documents/spn-0155.pdf',
  },
])

const filteredDocuments = computed(() => {
  if (!hasSearched.value) return []
  const nikQuery = nik.value.trim()
  const codeQuery = submissionCode.value.trim().toUpperCase()
  return documents.value.filter(
    (document) =>
      document.nik === nikQuery &&
      document.submissionCode.toUpperCase() === codeQuery
  )
})

function validate() {
  const nextErrors = {}
  if (!/^\d{16}$/.test(nik.value.trim())) {
    nextErrors.nik = 'NIK harus 16 digit angka.'
  }
  if (!submissionCode.value.trim()) {
    nextErrors.submissionCode = 'ID pengajuan wajib diisi.'
  }
  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

function searchDocuments() {
  if (!validate()) {
    hasSearched.value = false
    return
  }
  hasSearched.value = true
}

function resetSearch() {
  nik.value = ''
  submissionCode.value = ''
  hasSearched.value = false
  errors.value = {}
}

function statusSeverity(status) {
  if (status === 'Terverifikasi') return 'success'
  if (status === 'Menunggu') return 'warn'
  return 'danger'
}

function statusIcon(status) {
  if (status === 'Terverifikasi') return 'pi pi-check-circle'
  if (status === 'Menunggu') return 'pi pi-clock'
  return 'pi pi-times-circle'
}

function openPreview(document) {
  if (!document.fileUrl) return
  previewDocument.value = document
  previewVisible.value = true
}

function downloadDocument(document) {
  if (!document?.fileUrl) return
  window.open(document.fileUrl, '_blank')
}
</script>

<template>
  <div class="p-6">
    <!-- Kartu verifikasi, ditampilkan sebelum pencarian dilakukan -->
    <div
      v-if="!hasSearched"
      class="mt-6 max-w-md mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-100 shadow-xl p-6 sm:p-8"
    >
      <div class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-100/80 blur-md"></div>
      <div class="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-slate-200/70 blur-md"></div>

      <div class="relative flex flex-col items-center text-center gap-2">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B3657] shadow-md">
          <i class="pi pi-shield text-2xl text-white" />
        </div>
        <p class="text-xl font-bold text-gray-900 mt-3">
          Dokumen Saya
        </p>
        <p class="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Verifikasi NIK dan ID pengajuan untuk melihat serta mengunduh dokumen surat kamu.
        </p>
      </div>

      <div class="relative flex flex-col gap-4 mt-6">
        <div class="flex flex-col gap-1">
          <label for="nik" class="text-sm font-semibold text-gray-900">NIK</label>
          <InputText
            id="nik"
            v-model="nik"
            maxlength="16"
            placeholder="16 Digit NIK"
            class="w-full rounded-2xl py-3 px-4"
            :invalid="!!errors.nik"
            @keyup.enter="searchDocuments"
          />
          <small v-if="errors.nik" class="text-red-500">{{ errors.nik }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label for="submission-code" class="text-sm font-semibold text-gray-900">ID Pengajuan</label>
          <InputText
            id="submission-code"
            v-model="submissionCode"
            placeholder="Contoh: SKD-2026-0217"
            class="w-full rounded-2xl py-3 px-4"
            :invalid="!!errors.submissionCode"
            @keyup.enter="searchDocuments"
          />
          <small v-if="errors.submissionCode" class="text-red-500">{{ errors.submissionCode }}</small>
        </div>
      </div>

      <Button
        label="Cek Data"
        icon="pi pi-search"
        class="relative w-full mt-6 rounded-2xl py-3 !bg-[#1B3657] !border-[#1B3657] hover:!bg-[#142943] hover:!border-[#142943]"
        @click="searchDocuments"
      />
    </div>

    <!-- Data tidak ditemukan, menggantikan kartu verifikasi -->
    <div
      v-else-if="filteredDocuments.length === 0"
      class="mt-6 max-w-md mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-100 shadow-xl p-6 sm:p-8 text-center"
    >
      <div class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-red-100/70 blur-md"></div>
      <div class="relative flex flex-col items-center gap-2">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <i class="pi pi-exclamation-circle text-2xl text-red-500" />
        </div>
        <p class="text-xl font-bold text-gray-900 mt-3">Dokumen Tidak Ditemukan</p>
        <p class="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Kombinasi NIK dan ID pengajuan yang kamu masukkan tidak cocok dengan data manapun.
        </p>
        <Button
          label="Coba Lagi"
          icon="pi pi-refresh"
          class="w-full mt-6 rounded-2xl py-3 !bg-[#1B3657] !border-[#1B3657] hover:!bg-[#142943] hover:!border-[#142943]"
          @click="resetSearch"
        />
      </div>
    </div>

    <!-- Hasil pencarian, menggantikan kartu verifikasi setelah berhasil -->
    <div v-else class="mt-6 max-w-3xl mx-auto">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-100 shadow-xl p-6 sm:p-8">
        <div class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-100/70 blur-md"></div>

        <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <i class="pi pi-check-circle text-xl text-green-600" />
            </div>
            <div>
              <p class="text-lg font-bold text-gray-900">Verifikasi Berhasil</p>
              <p class="text-sm text-gray-500">
                Ditemukan {{ filteredDocuments.length }} dokumen untuk NIK {{ nik }}.
              </p>
            </div>
          </div>
          <Button label="Cari Lagi" icon="pi pi-refresh" text class="!text-[#1B3657]" @click="resetSearch" />
        </div>

        <div class="relative flex flex-col gap-3 mt-6">
          <div
            v-for="document in filteredDocuments"
            :key="document.id"
            class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between transition hover:shadow-md"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <i class="pi pi-file-pdf text-lg text-[#1B3657]" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ document.name }}
                </p>
                <p class="mt-0.5 text-xs text-gray-500">
                  Kode Pengajuan: {{ document.submissionCode }} · Diajukan {{ document.submittedDate }}
                </p>
                <Tag
                  class="mt-2"
                  :value="document.status"
                  :severity="statusSeverity(document.status)"
                  :icon="statusIcon(document.status)"
                />
              </div>
            </div>

            <div class="flex items-center gap-2 sm:shrink-0">
              <Button
                label="Lihat"
                icon="pi pi-eye"
                size="small"
                outlined
                class="!border-[#1B3657] !text-[#1B3657] hover:!bg-slate-50"
                :disabled="!document.fileUrl"
                @click="openPreview(document)"
              />
              <Button
                label="Unduh PDF"
                icon="pi pi-download"
                size="small"
                class="!bg-[#1B3657] !border-[#1B3657] hover:!bg-[#142943] hover:!border-[#142943]"
                :disabled="!document.fileUrl"
                @click="downloadDocument(document)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog pratinjau dokumen sebelum diunduh -->
    <Dialog
      v-model:visible="previewVisible"
      modal
      dismissableMask
      :header="previewDocument?.name ?? 'Pratinjau Dokumen'"
      class="w-[95vw] max-w-2xl"
    >
      <p class="text-xs text-gray-500 -mt-2 mb-3">
        Kode Pengajuan: {{ previewDocument?.submissionCode }} · Diajukan {{ previewDocument?.submittedDate }}
      </p>

      <div
        v-if="previewDocument?.fileUrl"
        class="aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
      >
        <iframe
          :src="previewDocument.fileUrl"
          title="Pratinjau dokumen"
          class="h-full w-full"
        />
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500"
      >
        <i class="pi pi-file-excel text-2xl text-gray-400" />
        Pratinjau belum tersedia untuk dokumen ini.
      </div>

      <template #footer>
        <Button label="Tutup" text class="!text-[#1B3657]" @click="previewVisible = false" />
        <Button
          label="Unduh PDF"
          icon="pi pi-download"
          class="!bg-[#1B3657] !border-[#1B3657] hover:!bg-[#142943] hover:!border-[#142943]"
          :disabled="!previewDocument?.fileUrl"
          @click="downloadDocument(previewDocument)"
        />
      </template>
    </Dialog>
  </div>
</template>