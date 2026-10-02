<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Message from "primevue/message";
import Tag from "primevue/tag";
import SubmissionCheckForm from "@/components/shared/SubmissionCheckForm.vue";
import {
  fetchSubmissionPdf,
  getSubmissionErrorMessage,
  lookupSubmissions,
} from "@/services/submissionCheck.service";
import { useSubmissionCheckStore } from "@/stores/submissionCheck";


const letterStatuses = {
  submitted: {
    label: "Menunggu Verifikasi",
    severity: "warn",
    icon: "pi pi-clock",
    hint: "Pengajuan sudah diterima dan menunggu diperiksa petugas kalurahan.",
  },
  verified: {
    label: "Terverifikasi",
    severity: "info",
    icon: "pi pi-check-circle",
    hint: "Data sudah diverifikasi. Surat menunggu persetujuan dan tanda tangan.",
  },
  authorized: {
    label: "Siap Diunduh",
    severity: "success",
    icon: "pi pi-file-pdf",
    hint: "Surat sudah disetujui dan siap dilihat serta diunduh.",
  },
  completed: {
    label: "Selesai",
    severity: "success",
    icon: "pi pi-check",
    hint: "Pengajuan sudah selesai diproses.",
  },
  rejected: {
    label: "Ditolak",
    severity: "danger",
    icon: "pi pi-times-circle",
    hint: "Pengajuan tidak dapat dilanjutkan.",
  },
};

function getLetterStatus(status) {
  return (
    letterStatuses[status] ?? {
      label: status || "Tidak diketahui",
      severity: "secondary",
      icon: "pi pi-info-circle",
      hint: "",
    }
  );
}

// Urutan tahap normal, dipakai untuk menandai langkah mana yang sudah dilewati.
const letterStatusOrder = ["submitted", "verified", "authorized", "completed"];

const store = useSubmissionCheckStore();

const isRefreshing = ref(false);
const refreshError = ref("");
const pdfError = ref("");
const busyKey = ref(""); // "<request_code>:preview" atau "<request_code>:download"
const previewVisible = ref(false);
const previewUrl = ref("");
const previewTitle = ref("");

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

function isReleased(item) {
  return item.status === "authorized" || item.status === "completed";
}

// Tahapan yang ditampilkan. Pengajuan yang ditolak berhenti di tahap "Ditolak".
function timelineOf(item) {
  const steps = [{ key: "submitted", label: "Diajukan", at: item.submitted_at, rank: 0 }];

  if (item.status === "rejected") {
    steps.push({ key: "rejected", label: "Ditolak", at: item.verified_at, rejected: true });
    return steps.map((step) => ({ ...step, tone: step.rejected ? "rejected" : "done" }));
  }

  steps.push({ key: "verified", label: "Diverifikasi", at: item.verified_at, rank: 1 });
  steps.push({ key: "authorized", label: "Disetujui, surat siap diunduh", at: item.authorized_at, rank: 2 });
  if (item.status === "completed") {
    steps.push({ key: "completed", label: "Selesai", at: item.completed_at, rank: 3 });
  }

  const currentRank = letterStatusOrder.indexOf(item.status);
  return steps.map((step) => ({ ...step, tone: step.rank <= currentRank ? "done" : "pending" }));
}

const dotClass = {
  done: "bg-emerald-100 text-emerald-600",
  pending: "bg-slate-100 text-slate-400",
  rejected: "bg-red-100 text-red-600",
};
const dotIcon = {
  done: "pi pi-check",
  pending: "pi pi-clock",
  rejected: "pi pi-times",
};

function downloadHint(item) {
  if (item.status === "rejected") return "Surat tidak tersedia karena pengajuan ditolak.";
  if (isReleased(item)) return "Berkas PDF surat ini belum tersedia. Silakan hubungi kantor kalurahan.";
  return "Surat bisa dilihat dan diunduh setelah pengajuan disetujui.";
}

async function refresh() {
  if (!store.nik || !store.requestCode) return;
  isRefreshing.value = true;
  refreshError.value = "";
  try {
    store.updateItems(await lookupSubmissions({ nik: store.nik, requestCode: store.requestCode }));
  } catch (error) {
    refreshError.value = await getSubmissionErrorMessage(error, "Status terbaru tidak dapat dimuat saat ini.");
  } finally {
    isRefreshing.value = false;
  }
}

function releasePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = "";
}

async function openPdf(item, { download }) {
  pdfError.value = "";
  busyKey.value = `${item.request_code}:${download ? "download" : "preview"}`;
  try {
    const blob = await fetchSubmissionPdf({ requestCode: item.request_code, nik: store.nik, download });
    const url = URL.createObjectURL(blob);

    if (download) {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.request_code}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
      releasePreview();
      previewUrl.value = url;
      previewTitle.value = item.letter_type?.name ?? "Surat";
      previewVisible.value = true;
    }
  } catch (error) {
    pdfError.value = await getSubmissionErrorMessage(error, "Surat tidak dapat dimuat saat ini. Coba lagi nanti.");
  } finally {
    busyKey.value = "";
  }
}

onMounted(() => {
  // Hasil dari beranda baru saja diambil; segarkan hanya kalau datanya sudah agak lama.
  if (store.hasResult && Date.now() - store.checkedAt > 60000) refresh();
});

onBeforeUnmount(releasePreview);
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
    <!-- Belum ada hasil (mis. halaman dibuka langsung): tampilkan form -->
    <div v-if="!store.hasResult" class="py-4 sm:py-8">
      <SubmissionCheckForm />
    </div>

    <template v-else>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="font-heading font-extrabold text-2xl sm:text-3xl text-heading m-0">Cek Pengajuan</h1>
          <p class="text-sm text-muted mt-1 mb-0">
            Status pengajuan <span class="font-mono font-semibold text-heading">{{ store.requestCode }}</span>
            untuk NIK {{ store.maskedNik }}.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button
            label="Segarkan"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            size="small"
            :loading="isRefreshing"
            @click="refresh"
          />
          <Button label="Cek Pengajuan Lain" icon="pi pi-search" size="small" @click="store.clear()" />
        </div>
      </div>

      <Message v-if="refreshError" severity="warn" :closable="false" class="mt-4">{{ refreshError }}</Message>
      <Message v-if="pdfError" severity="error" :closable="false" class="mt-4">{{ pdfError }}</Message>

      <ul class="mt-6 flex flex-col gap-4 m-0 p-0 list-none">
        <li
          v-for="item in store.items"
          :key="item.request_code"
          class="rounded-2xl border border-border-default bg-surface p-4 sm:p-5 shadow-sm"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <h2 class="font-heading font-bold text-base sm:text-lg text-heading m-0">
                {{ item.letter_type?.name || "Surat" }}
              </h2>
              <p class="text-xs text-muted mt-1 mb-0">
                ID Pengajuan: <span class="font-mono font-semibold text-heading">{{ item.request_code }}</span>
                <template v-if="item.letter_type?.category"> · {{ item.letter_type.category }}</template>
              </p>
            </div>
            <Tag
              :value="getLetterStatus(item.status).label"
              :severity="getLetterStatus(item.status).severity"
              :icon="getLetterStatus(item.status).icon"
              class="shrink-0"
            />
          </div>

          <p class="text-sm text-muted mt-3 mb-0">{{ getLetterStatus(item.status).hint }}</p>
          <p v-if="item.letter_number" class="text-sm text-muted mt-1 mb-0">
            Nomor surat: <span class="font-semibold text-heading">{{ item.letter_number }}</span>
          </p>
          <p
            v-else-if="(item.status === 'submitted' || item.status === 'verified') && item.letter_type?.processing_time"
            class="text-sm text-muted mt-1 mb-0"
          >
            Perkiraan waktu proses: {{ item.letter_type.processing_time }}
          </p>

          <div
            v-if="item.status === 'rejected' && item.rejection_reason"
            class="mt-3 rounded-xl border border-red-100 bg-red-50 px-3.5 py-3"
          >
            <p class="text-xs font-bold text-red-700 m-0">Alasan penolakan</p>
            <p class="text-sm text-red-700/90 mt-1 mb-0">{{ item.rejection_reason }}</p>
          </div>

          <ol class="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-2 m-0 p-0 list-none">
            <li v-for="step in timelineOf(item)" :key="step.key" class="flex items-start gap-2.5 sm:flex-1">
              <span
                class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.625rem]"
                :class="dotClass[step.tone]"
              >
                <i :class="dotIcon[step.tone]" />
              </span>
              <div class="min-w-0">
                <p class="text-xs font-semibold m-0" :class="step.tone === 'pending' ? 'text-muted' : 'text-heading'">
                  {{ step.label }}
                </p>
                <p v-if="step.at" class="text-[0.6875rem] text-muted m-0 mt-0.5">{{ formatDate(step.at) }}</p>
              </div>
            </li>
          </ol>

          <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-border-default pt-4">
            <template v-if="item.can_download">
              <Button
                label="Pratinjau"
                icon="pi pi-eye"
                severity="secondary"
                outlined
                size="small"
                :loading="busyKey === `${item.request_code}:preview`"
                :disabled="!!busyKey"
                @click="openPdf(item, { download: false })"
              />
              <Button
                label="Unduh PDF"
                icon="pi pi-download"
                size="small"
                :loading="busyKey === `${item.request_code}:download`"
                :disabled="!!busyKey"
                @click="openPdf(item, { download: true })"
              />
            </template>
            <p v-else class="text-xs text-muted m-0">{{ downloadHint(item) }}</p>
          </div>
        </li>
      </ul>
    </template>

    <Dialog
      v-model:visible="previewVisible"
      modal
      :header="previewTitle"
      class="w-[95vw] max-w-4xl"
      @hide="releasePreview"
    >
      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        title="Pratinjau surat"
        class="h-[75vh] w-full rounded-lg border border-border-default"
      />
    </Dialog>
  </div>
</template>