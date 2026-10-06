<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import { RESIDENT_TYPES, docsForType } from "@/data/registrationDocs";
import { hue, ENTRY_HUES } from "@/views/services/layout/pastel";
import { useResidentVerificationStore } from "@/stores/residentVerification";
import { useRegistrationDraftStore } from "@/stores/registrationDraft";

const h = hue(ENTRY_HUES.general);
const route = useRoute();
const router = useRouter();
const residentStore = useResidentVerificationStore();
const draft = useRegistrationDraftStore();

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

  if (found) router.push(route.query.redirect || { name: "general-catalog" });
  else residentNotFound.value = true;
}

/* Pop-up pilihan jenis pendaftaran (penduduk tetap / penduduk sementara / tinggal sementara). */
const typeDialogOpen = ref(false);
const hueOfType = (t) => hue(t.hue);

function goToRegistration() {
  typeDialogOpen.value = true;
}

function chooseType(type) {
  draft.reset();
  draft.residentType = type.value;
  // jenis yang hanya punya 1 dokumen (mis. SKTS) langsung terpilih
  const docs = docsForType(type.value);
  if (docs.length === 1) draft.selectedDocs = [docs[0].value];
  typeDialogOpen.value = false;
  router.push({ name: "general-register-select-letters" });
}
</script>

<template>
  <div class="relative">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-violet-50 via-sky-50/60 to-transparent" />
    <div class="relative p-6 max-w-6xl mx-auto">
    <div class="max-w-md mx-auto py-10">
      <div class="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-6 sm:p-8 text-center shadow-lg" :class="[h.hero, h.soft]">
        <span class="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full" :class="h.blob" />
        <span class="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full bg-sky-200/50" />

        <span class="relative flex h-14 w-14 mx-auto items-center justify-center rounded-2xl text-2xl shadow-sm" :class="h.icon">
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
            class="!border-2 !border-violet-200 focus:!border-violet-400 !rounded-xl !py-3 !bg-white"
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
          class="relative w-full mt-4 !py-3 !shadow-md" :class="h.btn"
          :loading="isChecking"
          @click="checkNik"
        />
        <Button label="Kembali ke Layanan" icon="pi pi-arrow-left" text size="small" class="relative mt-2" @click="router.push({ name: 'services' })" />
      </div>
    </div>
    </div>

    <!-- ============ POP-UP: JENIS PENDAFTARAN ============ -->
    <Dialog v-model:visible="typeDialogOpen" modal :draggable="false" header="Daftar Sebagai Apa?" :style="{ width: '28rem', maxWidth: '94vw' }">
      <p class="text-sm text-[var(--color-text-muted)]">Pilih jenis pendaftaran sesuai status tinggal Anda di kalurahan ini.</p>
      <div class="mt-4 flex flex-col gap-3">
        <button
          v-for="t in RESIDENT_TYPES"
          :key="t.value"
          type="button"
          class="flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus:outline-none"
          :class="hueOfType(t).idle"
          @click="chooseType(t)"
        >
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg" :class="hueOfType(t).icon"><i :class="t.icon" /></span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-semibold text-[var(--color-text-h)]">{{ t.label }}</span>
            <span class="block text-xs mt-0.5 text-[var(--color-text-muted)]">{{ t.description }}</span>
          </span>
          <i class="pi pi-chevron-right text-xs" :class="hueOfType(t).text" />
        </button>
      </div>
    </Dialog>
  </div>
</template>