<script setup>
import { useRouter } from "vue-router";
import { ENTRY_HUES, hue } from "@/views/services/layout/pastel";

const router = useRouter();

const options = [
  {
    key: "general", badge: "Warga", icon: "pi pi-file", title: "Layanan Warga",
    description: "Pengajuan surat untuk warga Bimomartani yang terdaftar dan calon warga baru, mencakup surat kependudukan, nikah, kelahiran, dan kematian. Perlu verifikasi NIK.",
    to: { name: "general-verify" },
    h: hue(ENTRY_HUES.general),
  },
  {
    key: "permit", badge: "Umum", icon: "pi pi-briefcase", title: "Layanan Umum",
    description: "Layanan surat untuk masyarakat umum di luar Bimomartani yang memerlukan surat izin ke Kalurahan Bimomartani, seperti izin usaha, keramaian, dan perjalanan.",
    to: { name: "permit-catalog" },
    h: hue(ENTRY_HUES.permit),
  },
];
</script>

<template>
  <div class="relative">
    <!-- latar pastel lembut, sama seperti katalog -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-violet-50 via-sky-50/60 to-transparent" />

    <div class="relative p-6 max-w-6xl mx-auto">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#2d5580] p-6 sm:p-8 shadow-sm">
        <span class="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span class="pointer-events-none absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-white/10" />
        <div class="relative">
          <h1 class="text-2xl font-semibold !text-white">Layanan Mandiri</h1>
          <p class="text-sm mt-1 max-w-xl !text-white/85">
            Pilih layanan sesuai status Anda: Layanan Warga untuk warga Bimomartani dan calon warga baru, atau Layanan Umum untuk masyarakat di luar Bimomartani.
          </p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          v-for="o in options"
          :key="o.key"
          type="button"
          class="group relative overflow-hidden text-left rounded-3xl border-2 p-7 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          :class="[o.h.card, o.h.cardHover]"
          @click="router.push(o.to)"
        >
          <span class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full transition-transform duration-300 group-hover:scale-125" :class="o.h.blob" />
          <span class="pointer-events-none absolute -right-2 bottom-3 h-10 w-10 rounded-full bg-white/50" />
          <div class="relative flex items-start justify-between gap-2">
            <span class="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3" :class="o.h.icon">
              <i :class="o.icon" />
            </span>
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold" :class="o.h.pill">{{ o.badge }}</span>
          </div>
          <div class="relative">
            <h2 class="text-lg font-semibold text-[var(--color-text-h)]">{{ o.title }}</h2>
            <p class="text-sm mt-1 text-[var(--color-text-muted)]">{{ o.description }}</p>
          </div>
          <div class="relative flex items-center gap-1 text-xs font-medium opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" :class="o.h.text">
            <span>Masuk</span><i class="pi pi-arrow-right text-[10px]" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
