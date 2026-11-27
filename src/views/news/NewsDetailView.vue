<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { RouterLink } from "vue-router";
import Tag from "primevue/tag";
import Button from "primevue/button";
import DOMPurify from "dompurify";
import { getNewsBySlug, getRelatedNews } from "@/services/news.js";

const props = defineProps({
  slug: { type: String, required: true },
});

const article = ref(null);
const relatedNews = ref([]);
const loading = ref(true);
let detailPollTimer = null;

async function load() {
  loading.value = true;
  article.value = null;
  relatedNews.value = [];

  try {
    article.value = await getNewsBySlug(props.slug, true);
  } catch {
    article.value = null;
  } finally {
    // Jangan menunggu daftar berita terkait untuk menampilkan isi utama.
    loading.value = false;
  }

  if (article.value) {
    try {
      relatedNews.value = await getRelatedNews(article.value, 3);
    } catch {
      relatedNews.value = [];
    }
  }
}

async function refreshDetail() {
  try {
    const updated = await getNewsBySlug(props.slug, true);
    if (updated) {
      article.value = updated;
    }
  } catch {
    // silent
  }
}

onMounted(() => {
  void load();
  detailPollTimer = setInterval(refreshDetail, 5000);
});

onBeforeUnmount(() => {
  if (detailPollTimer) clearInterval(detailPollTimer);
});

watch(() => props.slug, load);

const shareLinks = computed(() => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = article.value?.title || "";
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " - " + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };
});

function handleImageError(event) {
  event.target.style.display = "none";
}

/**
 * Ubah spasi "keras" (&nbsp;, &#160;, U+00A0, dan karakter lebar nol) menjadi spasi biasa.
 * Spasi keras berasal dari paste (WhatsApp/Word) dan membuat paragraf tidak bisa
 * pindah baris di antara kata, sehingga teks terpotong di tengah kata.
 */
function normalizeSpaces(html) {
  return String(html || "")
    .replace(/&nbsp;|&#160;|&#xa0;/gi, " ")
    .replace(/[\u00A0\u202F\u2007]/g, " ")
    .replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, "");
}

/**
 * Bersihkan HTML berita sebelum dirender. Konten berasal dari editor/admin,
 * jadi v-html tidak boleh menerima HTML mentah tanpa sanitasi.
 */
const sanitizeContent = (html) =>
  DOMPurify.sanitize(normalizeSpaces(html), {
    ADD_ATTR: ["target", "rel"],
  });

// Properti inline style yang mengganggu tata letak dan harus dibuang dari konten editor.
// "text-align" sengaja TIDAK ada di daftar ini, supaya perataan dari editor tetap dipakai.
const BLOCKED_STYLE_PROPS = [
  "white-space",
  "word-break",
  "overflow-wrap",
  "word-wrap",
  "hyphens",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "float",
  "position",
  "margin-left",
  "margin-right",
  "text-indent",
];

/**
 * Pastikan semua link (baik tag <a> dari editor maupun URL mentah)
 * bisa diklik dan terbuka di tab baru dengan aman. Sekaligus menormalkan
 * gambar (selalu selebar kolom) dan membuang style inline yang merusak layout.
 */
function enhanceContentLinks(html) {
  const safeHtml = sanitizeContent(html);
  if (!safeHtml || typeof DOMParser === "undefined") return safeHtml;
  try {
    const doc = new DOMParser().parseFromString(safeHtml, "text/html");

    // 0. Buang style inline yang membuat teks/gambar tidak sesuai wadah
    doc.body.querySelectorAll("[style]").forEach((el) => {
      BLOCKED_STYLE_PROPS.forEach((prop) => el.style.removeProperty(prop));
      if (!el.getAttribute("style")?.trim()) el.removeAttribute("style");
    });

    // 1. Gambar: buang ukuran/posisi bawaan editor, selalu fit selebar kolom
    doc.querySelectorAll("img").forEach((img) => {
      img.removeAttribute("width");
      img.removeAttribute("height");
      img.removeAttribute("style");
      img.removeAttribute("data-layout");
      img.removeAttribute("data-align");
      img.removeAttribute("data-x");
      img.removeAttribute("data-y");
      img.setAttribute("loading", "lazy");
    });

    // 2. Tag <a> yang sudah ada: pastikan target="_blank" & styling aktif
    doc.querySelectorAll("a").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
      a.classList.add("cursor-pointer", "underline", "text-primary-700", "hover:text-primary-800", "break-all");
    });

    // 3. URL mentah (http/https) dalam teks biasa yang belum di-link
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.parentElement?.tagName !== "A") {
        textNodes.push(walker.currentNode);
      }
    }

    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    for (const node of textNodes) {
      const value = node.nodeValue || "";
      urlRegex.lastIndex = 0;
      if (!urlRegex.test(value)) continue;

      urlRegex.lastIndex = 0;
      const fragment = doc.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = urlRegex.exec(value)) !== null) {
        fragment.appendChild(doc.createTextNode(value.slice(lastIndex, match.index)));

        const link = doc.createElement("a");
        link.setAttribute("href", match[0]);
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
        link.className = "cursor-pointer underline text-primary-700 hover:text-primary-800 break-all";
        link.textContent = match[0];
        fragment.appendChild(link);
        lastIndex = match.index + match[0].length;
      }

      fragment.appendChild(doc.createTextNode(value.slice(lastIndex)));
      node.replaceWith(fragment);
    }

    return sanitizeContent(doc.body.innerHTML);
  } catch {
    return safeHtml;
  }
}

const renderedContent = computed(() => {
  return enhanceContentLinks(article.value?.rawContent || "");
});

/* ============ Styling isi berita (HTML dari editor Quill) ============
   Semua pakai Tailwind lewat arbitrary variant, tanpa blok <style>.

   Perataan teks:
   - Default paragraf/daftar/kutipan = rata kanan-kiri (text-justify).
   - Setelan dari editor tetap menang: inline `style="text-align:..."` selalu mengalahkan
     class Tailwind, sedangkan class lama `ql-align-*` diberi varian dengan spesifisitas lebih tinggi.
   - Heading tidak ikut justify (tetap rata kiri). */
const CONTENT_CLASS = [
  // wadah
  "w-full min-w-0 max-w-full overflow-hidden break-words text-[14.5px] leading-relaxed text-default sm:text-[15px]",
  "[word-break:normal] [hyphens:none] [&_*]:max-w-full",
  // paragraf: default rata kanan-kiri; teks hanya pindah baris di spasi
  "[&_p]:mb-3 [&_p]:text-justify [&_p]:leading-[1.75] [&_p]:indent-0 [&_p]:break-words [&_p]:!whitespace-normal [&_p]:![word-break:normal]",
  "[&_span]:!whitespace-normal",
  // perataan lama dari Quill (class ql-align-*)
  "[&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify [&_.ql-align-left]:text-left",
  // daftar
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:mb-1 [&_li]:text-justify [&_li]:break-words [&_li]:!whitespace-normal",
  // heading
  "[&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-snug [&_h1]:break-words",
  "[&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:break-words",
  "[&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:break-words",
  // gambar: selalu selebar kolom, tinggi mengikuti rasio asli
  "[&_img]:my-3 [&_img]:block [&_img]:!float-none [&_img]:!static [&_img]:!transform-none [&_img]:!h-auto [&_img]:!w-full [&_img]:!max-w-full [&_img]:rounded-xl",
  // blok kode
  "[&_pre]:my-3 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:rounded-xl [&_pre]:bg-slate-50 [&_pre]:px-4 [&_pre]:py-3",
  "[&_code]:max-w-full [&_code]:whitespace-pre-wrap [&_code]:break-words",
  // tabel
  "[&_table]:my-3 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse",
  "[&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:px-2.5 [&_th]:py-2 [&_th]:text-left [&_th]:align-top [&_th]:font-bold [&_th]:whitespace-normal",
  "[&_td]:border [&_td]:border-slate-200 [&_td]:px-2.5 [&_td]:py-2 [&_td]:text-left [&_td]:align-top [&_td]:whitespace-normal",
  // kutipan
  "[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-4 [&_blockquote]:text-slate-500 [&_blockquote]:text-justify",
].join(" ");

/* ============ Warna per kategori (konsisten dgn halaman Berita & Gallery) ============
   Dihitung otomatis dari nama kategori (hash) supaya tidak perlu daftar hardcode. */
const CATEGORY_PALETTE = [
  {
    dot: "bg-sky-500",
    topBar: "bg-gradient-to-r from-sky-400 to-cyan-500",
    imageGradient: "from-sky-100 via-cyan-100 to-sky-200",
    activeBadge: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-transparent shadow-lg shadow-sky-500/30",
    softBadge: "bg-sky-50 text-sky-700 border border-sky-200",
    hoverRing: "hover:border-sky-300 hover:bg-sky-50/40",
    glow: "from-sky-400/20 via-cyan-400/10 to-transparent",
  },
  {
    dot: "bg-rose-500",
    topBar: "bg-gradient-to-r from-rose-400 to-pink-500",
    imageGradient: "from-rose-100 via-pink-100 to-rose-200",
    activeBadge: "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30",
    softBadge: "bg-rose-50 text-rose-700 border border-rose-200",
    hoverRing: "hover:border-rose-300 hover:bg-rose-50/40",
    glow: "from-rose-400/20 via-pink-400/10 to-transparent",
  },
  {
    dot: "bg-amber-500",
    topBar: "bg-gradient-to-r from-amber-400 to-orange-500",
    imageGradient: "from-amber-100 via-orange-100 to-amber-200",
    activeBadge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/30",
    softBadge: "bg-amber-50 text-amber-700 border border-amber-200",
    hoverRing: "hover:border-amber-300 hover:bg-amber-50/40",
    glow: "from-amber-400/20 via-orange-400/10 to-transparent",
  },
  {
    dot: "bg-violet-500",
    topBar: "bg-gradient-to-r from-violet-400 to-purple-500",
    imageGradient: "from-violet-100 via-purple-100 to-violet-200",
    activeBadge: "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-transparent shadow-lg shadow-violet-500/30",
    softBadge: "bg-violet-50 text-violet-700 border border-violet-200",
    hoverRing: "hover:border-violet-300 hover:bg-violet-50/40",
    glow: "from-violet-400/20 via-purple-400/10 to-transparent",
  },
  {
    dot: "bg-emerald-500",
    topBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    imageGradient: "from-emerald-100 via-teal-100 to-emerald-200",
    activeBadge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-500/30",
    softBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    hoverRing: "hover:border-emerald-300 hover:bg-emerald-50/40",
    glow: "from-emerald-400/20 via-teal-400/10 to-transparent",
  },
];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getCategoryStyle(category) {
  if (!category) return CATEGORY_PALETTE[0];
  return CATEGORY_PALETTE[hashString(category) % CATEGORY_PALETTE.length];
}
</script>

<template>
  <div class="relative overflow-hidden py-6 lg:py-8">
    <!-- Jangan tampilkan pesan tidak ditemukan selama request detail masih berjalan. -->
    <div
      v-if="loading"
      class="mx-auto max-w-6xl animate-pulse space-y-5"
      aria-label="Memuat berita"
    >
      <div class="h-4 w-56 rounded bg-slate-200" />
      <div class="grid gap-8 lg:grid-cols-3">
        <div class="space-y-4 lg:col-span-2">
          <div class="h-6 w-28 rounded-full bg-slate-200" />
          <div class="h-10 w-3/4 rounded bg-slate-200" />
          <div class="h-4 w-52 rounded bg-slate-200" />
          <div class="aspect-video rounded-2xl bg-slate-200" />
        </div>
        <div class="h-56 rounded-2xl bg-slate-200" />
      </div>
    </div>

    <!-- ============ NOT FOUND ============ -->
    <Transition
      appear
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
    >
      <div
        v-if="!loading && !article"
        class="mx-auto max-w-xl rounded-2xl border border-dashed border-border-default bg-gradient-to-br from-primary-50 via-surface to-rose-50 p-12 text-center"
      >
        <i class="pi pi-exclamation-circle text-3xl text-primary-300" />
        <p class="mt-3 text-[15px] font-bold text-heading">Berita tidak ditemukan</p>
        <p class="mt-1 text-[13px] text-muted">
          Berita yang kamu cari mungkin sudah dihapus atau tautannya salah.
        </p>
        <RouterLink :to="{ name: 'news' }">
          <Button
            unstyled
            class="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-800 to-primary-900 px-5 py-2.5 text-[13px] font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <i class="pi pi-arrow-left text-[11px]" />
            Kembali ke Berita Desa
          </Button>
        </RouterLink>
      </div>
    </Transition>

    <template v-if="!loading && article">
      <!-- Ambient glow warna sesuai kategori artikel -->
      <div
        class="pointer-events-none absolute -top-10 left-0 -z-10 h-72 w-full animate-pulse bg-gradient-to-b blur-3xl"
        :class="getCategoryStyle(article.category).glow"
      />

      <!-- ============ BREADCRUMB ============ -->
      <Transition
        appear
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <nav class="mb-5 flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
          <RouterLink :to="{ name: 'home' }" class="transition-colors hover:text-primary-700">
            Beranda
          </RouterLink>
          <i class="pi pi-angle-right text-[9px]" />
          <RouterLink :to="{ name: 'news' }" class="transition-colors hover:text-primary-700">
            Berita Desa
          </RouterLink>
          <i class="pi pi-angle-right text-[9px]" />
          <span class="max-w-[220px] truncate font-medium text-default sm:max-w-none">
            {{ article.title }}
          </span>
        </nav>
      </Transition>

      <div class="grid items-start gap-8 lg:grid-cols-3">
        <!-- ============ KONTEN UTAMA ============ -->
        <Transition
          appear
          enter-active-class="transition-all delay-100 duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
        >
          <article class="min-w-0 lg:col-span-2">
            <Tag
              :value="article.category"
              unstyled
              class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
              :class="getCategoryStyle(article.category).activeBadge"
            />

            <h1 class="mt-3 text-2xl font-extrabold leading-tight text-heading sm:text-3xl lg:text-[32px]">
              {{ article.title }}
            </h1>

            <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted">
              <span class="flex items-center gap-1.5">
                <i class="pi pi-calendar text-[11px]" />
                {{ article.date }}
              </span>
              <span class="flex items-center gap-1.5">
                <i class="pi pi-user text-[11px]" />
                {{ article.author }}
              </span>
            </div>

            <div
              class="relative mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br shadow-lg shadow-primary-900/5"
              :class="article.image ? 'bg-primary-50' : getCategoryStyle(article.category).imageGradient"
            >
              <span class="absolute inset-x-0 top-0 h-1.5" :class="getCategoryStyle(article.category).topBar" />
              <img
                v-if="article.image"
                :src="article.image"
                :alt="article.title"
                class="h-full w-full object-cover"
                @error="handleImageError"
              />
              <i v-else class="pi pi-image text-4xl text-white/50" />
            </div>

            <!-- Konten berita dirender sebagai HTML; styling lewat CONTENT_CLASS (Tailwind) -->
            <div
              class="mt-6"
              :class="CONTENT_CLASS"
              v-html="renderedContent"
            />

            <!-- ============ SHARE ============ -->
            <div class="mt-8 flex flex-wrap items-center gap-3 border-t border-border-default pt-6">
              <span class="text-[12.5px] font-bold text-heading">Bagikan:</span>
              <a
                :href="shareLinks.whatsapp"
                target="_blank"
                rel="noopener"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-white hover:shadow-lg hover:shadow-emerald-500/30"
              >
                <i class="pi pi-whatsapp text-[14px]" />
              </a>
              <a
                :href="shareLinks.facebook"
                target="_blank"
                rel="noopener"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-600 hover:text-white hover:shadow-lg hover:shadow-sky-500/30"
              >
                <i class="pi pi-facebook text-[14px]" />
              </a>
              <a
                :href="shareLinks.twitter"
                target="_blank"
                rel="noopener"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:shadow-slate-500/30"
              >
                <i class="pi pi-twitter text-[14px]" />
              </a>
            </div>

            <RouterLink
              :to="{ name: 'news' }"
              class="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-primary-700 transition-all hover:gap-3 hover:text-primary-800"
            >
              <i class="pi pi-arrow-left text-[11px]" />
              Kembali ke Berita Desa
            </RouterLink>
          </article>
        </Transition>

        <!-- ============ SIDEBAR: BERITA TERKAIT ============ -->
        <Transition
          appear
          enter-active-class="transition-all delay-200 duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
        >
          <aside
            class="rounded-2xl border border-border-default bg-gradient-to-br from-surface to-primary-50/40 p-5 lg:sticky lg:top-[calc(var(--navbar-h)+24px)]"
          >
            <h2 class="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-heading">
              <i class="pi pi-book text-primary-700" />
              Berita Terkait
            </h2>
            <div class="flex flex-col gap-3">
              <RouterLink
                v-for="item in relatedNews"
                :key="item.slug"
                :to="{ name: 'news-detail', params: { slug: item.slug } }"
                class="group flex items-center gap-3.5 rounded-xl border border-border-default p-2.5 transition-all duration-300 hover:-translate-x-0.5 hover:shadow-md"
                :class="getCategoryStyle(item.category).hoverRing"
              >
                <div
                  class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br"
                  :class="item.image ? 'bg-primary-50' : getCategoryStyle(item.category).imageGradient"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <i v-else class="pi pi-image text-lg text-white/60" />
                </div>
                <div class="flex min-w-0 flex-col gap-1.5">
                  <p
                    class="line-clamp-2 text-[13px] font-extrabold leading-snug text-heading transition-colors group-hover:text-primary-700"
                  >
                    {{ item.title }}
                  </p>
                  <span
                    class="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
                    :class="getCategoryStyle(item.category).softBadge"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="getCategoryStyle(item.category).dot" />
                    {{ item.date }}
                  </span>
                </div>
              </RouterLink>
            </div>
          </aside>
        </Transition>
      </div>
    </template>
  </div>
</template>