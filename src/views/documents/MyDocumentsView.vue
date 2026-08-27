<script setup>

import { ref, computed } from 'vue'

const searchQuery = ref ('')
const hasSearched = ref(false)

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
  const query = searchQuery.value.trim()
  if (!query) return []
  return documents.value.filter(document => document.nik === query)
})

function searchDocuments() {
  hasSearched.value = true
}

function statusBadgeClass(status) {
  if (status === 'Terverifikasi') return 'bg-green-100 text-green-700'
  if (status === 'Menunggu') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

function downloadDocument(document) {
  if (!document.fileUrl) return
  window.open(document.fileUrl, '_blank')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">Dokumen Saya</h1>
    <p class="mt-1 text-sm" style="color: var(--color-text-muted)">
      Masukkan NIK yang digunakan saat pengajuan surat untuk melihat dan mengunduh dokumen yang sudah terverifikasi.
    </p>

    <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Masukkan NIK"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:w-80"
        @keyup.enter="searchDocuments"
      />

      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-medium text-white transition"
        style="background-color: #1483C7"
        onmouseover="this.style.backgroundColor='#0F6A9F'"
        onmouseout="this.style.backgroundColor='#1483C7'"
        @click="searchDocuments"
      >
        Cari Dokumen
      </button>
    </div>

    <div class="mt-6">
      <div
        v-if="!hasSearched"
        class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm"
        style="color: var(--color-text-muted)"
      >
        Masukkan NIK di atas untuk mencari dokumen surat kamu.
      </div>

      <div
        v-else-if="filteredDocuments.length === 0"
        class="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm"
        style="color: var(--color-text-muted)"
      >
        Tidak ditemukan dokumen untuk NIK tersebut.
      </div>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="document in filteredDocuments"
          :key="document.id"
          class="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm font-semibold text-gray-800">
              {{ document.name }}
            </p>
            <p class="mt-0.5 text-xs" style="color: var(--color-text-muted)">
              Kode Pengajuan: {{ document.submissionCode }} · Diajukan {{ document.submittedDate }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="statusBadgeClass(document.status)"
            >
              {{ document.status }}
            </span>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:bg-gray-300"
              :style="document.status === 'Terverifikasi' ? 'background-color: #1483C7' : ''"
              :disabled="document.status !== 'Terverifikasi'"
              @mouseover="document.status === 'Terverifikasi' && ($event.target.style.backgroundColor = '#0F6A9F')"
              @mouseout="document.status === 'Terverifikasi' && ($event.target.style.backgroundColor = '#1483C7')"
              @click="downloadDocument(document)"
            >
              <i class="pi pi-download text-xs" />
              Unduh PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>