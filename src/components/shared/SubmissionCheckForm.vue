<script setup>
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Message from "primevue/message";
import { getSubmissionErrorMessage, lookupSubmissions } from "@/services/submissionCheck.service";
import { useSubmissionCheckStore } from "@/stores/submissionCheck";

const router = useRouter();
const store = useSubmissionCheckStore();

const nik = ref("");
const requestCode = ref("");
const errors = reactive({ nik: "", requestCode: "" });
const serverError = ref("");
const isLoading = ref(false);

// NIK hanya angka, maksimal 16 digit.
watch(nik, (value) => {
  const cleaned = value.replace(/\D/g, "").slice(0, 16);
  if (cleaned !== value) nik.value = cleaned;
});

function validate() {
  errors.nik = /^\d{16}$/.test(nik.value) ? "" : "NIK harus 16 digit angka.";
  errors.requestCode = requestCode.value.trim() ? "" : "ID pengajuan wajib diisi.";
  return !errors.nik && !errors.requestCode;
}

async function submit() {
  serverError.value = "";
  if (isLoading.value || !validate()) return;

  const payload = { nik: nik.value, requestCode: requestCode.value.trim().toUpperCase() };

  isLoading.value = true;
  try {
    const items = await lookupSubmissions(payload);
    store.setResult({ ...payload, items });
    nik.value = "";
    requestCode.value = "";
    router.push({ name: "my-documents" });
  } catch (error) {
    serverError.value = await getSubmissionErrorMessage(
      error,
      "Pengajuan tidak dapat diperiksa saat ini. Coba lagi nanti.",
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <div
      class="max-w-md mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-100 shadow-xl p-6 sm:p-8"
    >
      <div class="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-100/80 blur-md"></div>
      <div class="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-slate-200/70 blur-md"></div>

      <div class="relative flex flex-col items-center text-center gap-2">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B3657] shadow-md">
          <i class="pi pi-file-check text-2xl text-white" />
        </div>
        <p class="text-xl font-bold text-gray-900 mt-3">Cek Pengajuan</p>
        <p class="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
          Masukkan NIK dan ID pengajuan untuk melihat status serta mengunduh surat kamu.
        </p>
      </div>

      <div class="relative flex flex-col gap-4 mt-6">
        <div class="flex flex-col gap-1">
          <label for="check-nik" class="text-sm font-semibold text-gray-900">NIK</label>
          <InputText
            id="check-nik"
            v-model="nik"
            inputmode="numeric"
            autocomplete="off"
            maxlength="16"
            placeholder="16 Digit NIK"
            class="w-full rounded-2xl py-3 px-4"
            :invalid="!!errors.nik"
            @keyup.enter="submit"
          />
          <small v-if="errors.nik" class="text-red-500">{{ errors.nik }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label for="check-request-code" class="text-sm font-semibold text-gray-900">ID Pengajuan</label>
          <InputText
            id="check-request-code"
            v-model="requestCode"
            autocomplete="off"
            placeholder="Contoh: REQ-20260930-001"
            class="w-full rounded-2xl py-3 px-4"
            :invalid="!!errors.requestCode"
            @keyup.enter="submit"
          />
          <small v-if="errors.requestCode" class="text-red-500">{{ errors.requestCode }}</small>
        </div>
      </div>

      <Message v-if="serverError" severity="error" :closable="false" class="relative mt-4">
        {{ serverError }}
      </Message>

      <Button
        label="Cek Pengajuan"
        icon="pi pi-search"
        :loading="isLoading"
        class="relative w-full mt-6 rounded-2xl py-3 !bg-[#1B3657] !border-[#1B3657] hover:!bg-[#142943] hover:!border-[#142943]"
        @click="submit"
      />
    </div>
  </div>
</template>