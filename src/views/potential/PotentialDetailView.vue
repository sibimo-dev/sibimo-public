<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import DOMPurify from 'dompurify'
import {
  fetchPotentialBySlug,
  getRelatedPotentials,
  categoryLabel,
  categoryIcon,
} from '@/services/potential.service'

// `slug` arrives as a prop because the route is defined with `props: true`
// (see src/router/index.js).
const props = defineProps({
  slug: { type: String, required: true },
})

// Tampilan HTML hasil rich editor (Quill 2), hanya dengan Tailwind.
const RICH_CONTENT_CLASSES = [
  '[&_*]:break-words',
  '[&_p]:min-h-[1.5em] [&_p]:my-0',
  '[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold',
  '[&_a]:text-blue-600 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic',
  '[&_.ql-align-left]:text-left [&_.ql-align-center]:text-center [&_.ql-align-right]:text-right [&_.ql-align-justify]:text-justify',
  '[&_.ql-font-serif]:font-serif [&_.ql-font-monospace]:font-mono',
  '[&_.ql-size-small]:text-xs [&_.ql-size-large]:text-2xl [&_.ql-size-huge]:text-[2.5rem]',
  '[&_.ql-code-block-container]:my-2 [&_.ql-code-block-container]:rounded-md [&_.ql-code-block-container]:bg-[#23241f] [&_.ql-code-block-container]:px-3 [&_.ql-code-block-container]:py-2 [&_.ql-code-block-container]:font-mono [&_.ql-code-block-container]:text-[13px] [&_.ql-code-block-container]:text-[#f8f8f2] [&_.ql-code-block]:whitespace-pre-wrap',
  '// Daftar (Quill 2: semua item ada di <ol> dengan data-list)',
  '[&_ol]:m-0 [&_ol]:p-0 [&_ol]:[counter-reset:list-0_list-1_list-2_list-3_list-4_list-5_list-6_list-7_list-8]',
  '[&_li]:relative [&_li[data-list]]:list-none [&_li>.ql-ui]:hidden',
  '[&_li[data-list]]:pl-[1.75em]',
  '[&_li[data-list]]:before:-ml-[1.75em] [&_li[data-list]]:before:mr-[0.25em] [&_li[data-list]]:before:inline-block [&_li[data-list]]:before:w-[1.5em] [&_li[data-list]]:before:text-right [&_li[data-list]]:before:whitespace-nowrap',
  "[&_li[data-list]:not([class*=ql-indent])[data-list=ordered]]:[counter-increment:list-0] [&_li[data-list]:not([class*=ql-indent])[data-list=ordered]]:before:content-[counter(list-0,decimal)'._'] [&_li[data-list]:not([class*=ql-indent])[data-list=bullet]]:before:content-['•'] [&_li[data-list]:not([class*=ql-indent])]:[counter-set:list-1_list-2_list-3_list-4_list-5_list-6_list-7_list-8_0]",
  "[&_li[data-list].ql-indent-1[data-list=ordered]]:[counter-increment:list-1] [&_li[data-list].ql-indent-1[data-list=ordered]]:before:content-[counter(list-1,lower-alpha)'._'] [&_li[data-list].ql-indent-1[data-list=bullet]]:before:content-['◦'] [&_li[data-list].ql-indent-1]:pl-[calc(3em+1.75em)] [&_li[data-list].ql-indent-1]:[counter-set:list-2_list-3_list-4_list-5_list-6_list-7_list-8_0]",
  "[&_li[data-list].ql-indent-2[data-list=ordered]]:[counter-increment:list-2] [&_li[data-list].ql-indent-2[data-list=ordered]]:before:content-[counter(list-2,lower-roman)'._'] [&_li[data-list].ql-indent-2[data-list=bullet]]:before:content-['▪'] [&_li[data-list].ql-indent-2]:pl-[calc(6em+1.75em)] [&_li[data-list].ql-indent-2]:[counter-set:list-3_list-4_list-5_list-6_list-7_list-8_0]",
  "[&_li[data-list].ql-indent-3[data-list=ordered]]:[counter-increment:list-3] [&_li[data-list].ql-indent-3[data-list=ordered]]:before:content-[counter(list-3,decimal)'._'] [&_li[data-list].ql-indent-3[data-list=bullet]]:before:content-['•'] [&_li[data-list].ql-indent-3]:pl-[calc(9em+1.75em)] [&_li[data-list].ql-indent-3]:[counter-set:list-4_list-5_list-6_list-7_list-8_0]",
  "[&_li[data-list].ql-indent-4[data-list=ordered]]:[counter-increment:list-4] [&_li[data-list].ql-indent-4[data-list=ordered]]:before:content-[counter(list-4,lower-alpha)'._'] [&_li[data-list].ql-indent-4[data-list=bullet]]:before:content-['◦'] [&_li[data-list].ql-indent-4]:pl-[calc(12em+1.75em)] [&_li[data-list].ql-indent-4]:[counter-set:list-5_list-6_list-7_list-8_0]",
  "[&_li[data-list].ql-indent-5[data-list=ordered]]:[counter-increment:list-5] [&_li[data-list].ql-indent-5[data-list=ordered]]:before:content-[counter(list-5,lower-roman)'._'] [&_li[data-list].ql-indent-5[data-list=bullet]]:before:content-['▪'] [&_li[data-list].ql-indent-5]:pl-[calc(15em+1.75em)] [&_li[data-list].ql-indent-5]:[counter-set:list-6_list-7_list-8_0]",
  "[&_li[data-list].ql-indent-6[data-list=ordered]]:[counter-increment:list-6] [&_li[data-list].ql-indent-6[data-list=ordered]]:before:content-[counter(list-6,decimal)'._'] [&_li[data-list].ql-indent-6[data-list=bullet]]:before:content-['•'] [&_li[data-list].ql-indent-6]:pl-[calc(18em+1.75em)] [&_li[data-list].ql-indent-6]:[counter-set:list-7_list-8_0]",
  "[&_li[data-list].ql-indent-7[data-list=ordered]]:[counter-increment:list-7] [&_li[data-list].ql-indent-7[data-list=ordered]]:before:content-[counter(list-7,lower-alpha)'._'] [&_li[data-list].ql-indent-7[data-list=bullet]]:before:content-['◦'] [&_li[data-list].ql-indent-7]:pl-[calc(21em+1.75em)] [&_li[data-list].ql-indent-7]:[counter-set:list-8_0]",
  "[&_li[data-list].ql-indent-8[data-list=ordered]]:[counter-increment:list-8] [&_li[data-list].ql-indent-8[data-list=ordered]]:before:content-[counter(list-8,lower-roman)'._'] [&_li[data-list].ql-indent-8[data-list=bullet]]:before:content-['▪'] [&_li[data-list].ql-indent-8]:pl-[calc(24em+1.75em)]",
  '// Indentasi paragraf / heading / kutipan',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-1]:pl-[3em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-2]:pl-[6em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-3]:pl-[9em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-4]:pl-[12em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-5]:pl-[15em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-6]:pl-[18em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-7]:pl-[21em]',
  '[&_:is(p,h1,h2,h3,blockquote).ql-indent-8]:pl-[24em]',
].filter((line) => !line.startsWith('//')).join(' ')

// Bersihkan HTML dari editor dengan DOMPurify, ubah &nbsp; jadi spasi biasa supaya teks bisa turun baris,
// lalu beri gaya pada list "semantik" (<ul>/<ol> biasa) yang dihasilkan editor.
function styleSemanticLists(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.body.querySelectorAll('ul, ol').forEach((list) => {
    // Markup bergaya editor (li[data-list]) sudah ditangani class Tailwind di wadah.
    if (Array.from(list.children).some((li) => li.hasAttribute('data-list'))) return
    let depth = 0
    for (let p = list.parentElement?.closest('ul, ol'); p; p = p.parentElement?.closest('ul, ol')) depth += 1
    const level = Math.min(depth, 2)
    const styles = list.tagName === 'OL'
      ? ['!list-decimal', '!list-[lower-alpha]', '!list-[lower-roman]']
      : ['!list-disc', '!list-[circle]', '!list-[square]']
    list.classList.add(styles[level], '!pl-6', '!my-1')
  })
  return doc.body.innerHTML
}

function renderRich(html) {
  const source = String(html ?? '').replace(/&nbsp;|\u00a0/g, ' ')
  return styleSemanticLists(DOMPurify.sanitize(source))
}

const item = ref(null)
const loading = ref(true)
const related = ref([])

// HTML dari rich editor admin: dibersihkan, &nbsp; tunggal jadi spasi biasa.
const contentHtml = computed(() => renderRich(item.value?.longHtml))

async function loadData(slug) {
  loading.value = true
  try {
    item.value = await fetchPotentialBySlug(slug)
    if (item.value) {
      related.value = await getRelatedPotentials(item.value.category, item.value.slug)
    } else {
      related.value = []
    }
  } catch (error) {
    console.error('Gagal memuat detail potensi:', error)
    item.value = null
    related.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => loadData(props.slug))
watch(() => props.slug, (newSlug) => loadData(newSlug))
</script>

<template>
  <div class="overflow-x-hidden py-8">
    <!-- ===== LOADING ===== -->
    <div v-if="loading" class="fade-in-up py-20 text-center">
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
      <p class="mt-3 text-sm text-muted">Memuat informasi potensi...</p>
    </div>

    <!-- ===== NOT FOUND ===== -->
    <div v-else-if="!item" class="fade-in-up py-16 text-center">
      <p class="text-lg font-semibold text-heading">Potensi tidak ditemukan</p>
      <p class="mt-1 text-sm text-muted">
        Data yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <RouterLink
        :to="{ name: 'potential' }"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
      >
        <i class="pi pi-arrow-left text-xs" />
        Kembali ke Potensi Bimomartani
      </RouterLink>
    </div>

    <!-- ===== DETAIL ===== -->
    <template v-else>
      <!-- breadcrumb -->
      <RouterLink
        :to="{ name: 'potential' }"
        class="fade-in-up inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-primary-500"
      >
        <i class="pi pi-arrow-left text-xs" />
        Kembali ke Potensi Bimomartani
      </RouterLink>

      <!-- hero image -->
      <div
        class="fade-in-up relative mt-4 flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface-hover to-border-default md:h-80"
        style="animation-delay: 60ms"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="h-full w-full object-cover"
          style="object-position: center 30%"
        />
        <i v-else class="pi pi-image text-5xl text-muted/40" />
      </div>

      <!-- minmax(0,1fr) + min-w-0: kolom tidak melebar mengikuti isi -->
      <div class="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <!-- main content -->
        <div class="fade-in-up min-w-0 max-w-full" style="animation-delay: 120ms">
          <h1 class="break-words text-2xl md:text-3xl font-bold text-heading">{{ item.name }}</h1>
          <div class="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted">
            <i class="pi pi-map-marker text-primary-500" />
            {{ item.location }}
          </div>

          <div
            class="mt-6 min-w-0 max-w-full overflow-hidden whitespace-pre-wrap break-words text-sm md:text-[15px] leading-relaxed text-default"
            :class="RICH_CONTENT_CLASSES"
            v-html="contentHtml"
          />
        </div>

        <!-- info sidebar -->
        <aside
          class="fade-in-up h-fit min-w-0 rounded-2xl border border-border-default bg-surface p-6"
          style="animation-delay: 180ms"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">Informasi</p>

          <dl class="mt-4 space-y-4">
            <div v-for="(value, label) in item.extra" :key="label">
              <dt class="text-xs font-medium text-muted">{{ label }}</dt>
              <dd class="mt-0.5 break-words text-sm font-semibold text-heading">{{ value }}</dd>
            </div>
          </dl>

          <div class="mt-6 border-t border-border-default pt-4">
            <p class="text-xs font-medium text-muted">Kontak</p>
            <p class="mt-0.5 break-words text-sm font-semibold text-heading">{{ item.contact }}</p>
          </div>

          <button
            class="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <i class="pi pi-phone text-xs" />
            Hubungi Kontak
          </button>
        </aside>
      </div>

      <!-- related potentials -->
      <div v-if="related.length" class="mt-14">
        <h2 class="fade-in-up text-lg font-bold text-heading">Potensi Lainnya</h2>

        <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="(r, i) in related"
            :key="r.slug"
            :to="{ name: 'potential-detail', params: { slug: r.slug } }"
            class="related-card group overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
          <div
            class="flex h-32 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface-hover to-border-default transition-transform duration-500 group-hover:scale-105"
          >
            <img
              v-if="r.image"
              :src="r.image"
              :alt="r.name"
              class="h-full w-full object-cover"
            />
            <i v-else class="pi pi-image text-2xl text-muted/50" />
          </div>
            <div class="p-4">
              <p class="text-sm font-bold text-heading">{{ r.name }}</p>
              <p class="mt-1 text-xs text-muted line-clamp-2">{{ r.shortDesc }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fadeInUp 0.5s ease both;
}
.related-card {
  animation: fadeInUp 0.5s ease both;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .related-card {
    animation: none !important;
  }
}
</style>