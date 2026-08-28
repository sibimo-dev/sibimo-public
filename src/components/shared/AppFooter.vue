<script setup>
import villageLogo from "@/assets/logo-kalurahan-placeholder.svg";

const socialLinks = [
  { icon: "pi-facebook", href: "#", label: "Facebook" },
  { icon: "pi-instagram", href: "#", label: "Instagram" },
  { icon: "pi-youtube", href: "#", label: "YouTube" },
  { icon: "pi-whatsapp", href: "#", label: "WhatsApp" },
];

const footerLinks = [
  { label: "Profil Desa", to: { name: "profile" } },
  { label: "Layanan Surat", to: { name: "services" } },
  { label: "Aduan Masyarakat", to: { name: "complaints" } },
  { label: "Potensi Desa", to: { name: "potential" } },
  { label: "Gallery Desa", to: { name: "gallery" } },
  { label: "Agenda Desa", to: { name: "events" } },
];

const mapEmbedSrc =
  "https://www.google.com/maps?q=Kalurahan+Bimomartani,+Ngemplak,+Sleman,+DIY&output=embed";
</script>

<template>
  <footer class="mt-14 lg:mt-16 bg-gradient-to-br from-primary-900 to-primary-800 text-white pt-12 pb-8 lg:pb-10">
    <div class="max-w-page mx-auto px-4 md:px-12 lg:px-14 xl:px-16">
      <div class="grid gap-50 md:grid-cols-3">
        <!-- Kolom 1: logo, deskripsi, sosmed -->
        <div>
          <div class="flex items-center gap-2.5 mb-3.5">
            <img
              :src="villageLogo"
              alt="Logo Kalurahan Bimomartani"
              class="w-9 h-9 object-contain shrink-0"
            />
            <b class="font-heading font-bold tracking-tight text-lg uppercase text-white">Kalurahan Bimomartani</b>
          </div>

          <p class="text-[15px] text-white leading-relaxed mb-4 max-w-[340px]">
            Website resmi Pemerintah Kalurahan Bimomartani, Kapanewon Ngemplak,
            Kabupaten Sleman, Provinsi Daerah Istimewa Yogyakarta.
          </p>

          <div class="flex gap-2.5">
            <a
              v-for="social in socialLinks"
              :key="social.icon"
              :href="social.href"
              :aria-label="social.label"
              class="w-[38px] h-[38px] rounded-full border border-white/25 text-white flex items-center justify-center hover:bg-secondary-400 hover:border-secondary-400 hover:text-primary-900 hover:-translate-y-0.5 transition-all duration-200"
            >
              <i class="pi text-base" :class="social.icon" />
            </a>
          </div>
        </div>

        <!-- Kolom 2: Kontak + peta kecil -->
        <div>
          <p class="text-[15px] font-bold text-secondary-300 uppercase tracking-wide mb-3.5">
            Hubungi Kami
          </p>

          <div class="flex gap-2.5 text-[15px] text-white leading-relaxed mb-3">
            <i class="pi pi-map-marker text-secondary-300 mt-0.5 shrink-0" />
            Dusun Krajan, Bimomartani, Ngemplak, Sleman, D.I. Yogyakarta, 55584.
          </div>

          <div class="flex gap-2.5 text-[15px] text-white leading-relaxed mb-3">
            <i class="pi pi-phone text-secondary-300 mt-0.5 shrink-0" />
            0812-3456-7890
          </div>

          <div class="flex gap-2.5 text-[15px] text-white leading-relaxed mb-4">
            <i class="pi pi-envelope text-secondary-300 mt-0.5 shrink-0" />
            desa.bimomartani@slemankab.go.id
          </div>

          <div class="rounded-xl overflow-hidden border border-white/15 h-[130px]">
            <iframe
              :src="mapEmbedSrc"
              class="w-full h-full grayscale-[35%] contrast-[1.05]"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Peta lokasi Kalurahan Bimomartani"
            />
          </div>
        </div>

        <!-- Kolom 3: Tautan cepat -->
        <div>
          <p class="text-[15px] font-bold text-secondary-300 uppercase tracking-wide mb-3.5">
            Tautan Cepat
          </p>

          <div class="grid grid-cols-2 gap-x-4 gap-y-4 text-[15px] text-white">
            <RouterLink
              v-for="link in footerLinks"
              :key="link.label"
              :to="link.to"
              class="flex items-center gap-2 text-white hover:text-secondary-300 hover:translate-x-0.5 transition-all"
            >
              <i class="pi pi-angle-right text-[10px] text-secondary-300" />
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
      </div>

      <div
        class="mt-9 pt-5 border-t border-dashed border-white/20 flex flex-col md:flex-row flex-wrap items-center justify-center md:justify-between gap-x-4 gap-y-2 text-center text-[14px] text-white"
      >
        <span class="min-w-0">Hak cipta © 2026 — Pemerintah Kalurahan Bimomartani</span>
        <span class="min-w-0 shrink-0">Dibangun dengan SIBIMO</span>
      </div>
    </div>
  </footer>
</template>