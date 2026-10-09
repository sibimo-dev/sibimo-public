/* Membuka pengajuan dari kartu katalog.
   - Paket surat  → pindah ke route paket (service.to)
   - Surat tunggal → tetap di halaman katalog, tambah ?letter=NamaBerkas; katalog menampilkan LetterOutlet
   Tidak perlu menambah route baru untuk tiap surat. */
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useLetterApplicationStore } from "@/stores/letterApplication";
import { findLetter } from "./letterLookup";

export function useLetterLauncher(scope = "general") {
  const route = useRoute();
  const router = useRouter();
  const store = useLetterApplicationStore();

  const openFile = computed(() => (typeof route.query.letter === "string" ? route.query.letter : ""));
  const notice = ref("");

  function open(service) {
    if (service.bundle) {
      store.reset();
      store.setLetterType(service.slug);
      return router.push(service.to);
    }
    const entry = findLetter(service, scope);
    if (!entry) {
      notice.value = `Formulir "${service.title}" belum terhubung ke berkasnya. Cocokkan slug/judul kartu dengan berkas surat (lihat LETTER_ALIASES di layout/letterLookup.js).`;
      console.warn("[layanan] kartu tanpa berkas surat:", service.slug, service.title);
      return;
    }
    notice.value = "";
    store.reset();
    store.setLetterType(service.slug);
    window.scrollTo({ top: 0 });
    router.push({ query: { ...route.query, letter: entry.file } });
  }

  return { openFile, notice, open };
}
