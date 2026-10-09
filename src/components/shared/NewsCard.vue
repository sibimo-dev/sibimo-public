<script setup>
import { RouterLink } from "vue-router";
import { getCategoryClasses } from "@/services/news.js";

defineProps({
  item: { type: Object, required: true },
});

function handleImgError(event) {
  event.target.style.display = "none";
}
</script>

<template>
  <RouterLink
    :to="{ name: 'news-detail', params: { slug: item.slug } }"
    class="group rounded-2xl border border-border-default bg-surface overflow-hidden hover:shadow-md hover:border-primary-300 hover:-translate-y-0.5 transition-all flex flex-col"
  >
    <div class="relative aspect-[16/10] bg-primary-50 flex items-center justify-center overflow-hidden">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        @error="handleImgError"
      />
      <i v-else class="pi pi-image text-2xl text-primary-200" />
    </div>

    <div class="p-4 flex flex-col flex-1">
      <span
        :class="getCategoryClasses(item.category)"
        class="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide"
      >
        {{ item.category }}
      </span>

      <h3 class="text-[14px] font-bold text-heading mt-2.5 leading-snug line-clamp-2">
        {{ item.title }}
      </h3>
      <p class="text-[12px] text-muted mt-1.5 leading-relaxed line-clamp-2 flex-1">
        {{ item.excerpt }}
      </p>

      <div class="flex items-center justify-between mt-3 pt-3 border-t border-border-default">
        <span class="flex items-center gap-1.5 text-[11px] text-muted">
          <i class="pi pi-calendar text-[10px]" />
          {{ item.date }}
        </span>
        <span
          class="flex items-center gap-1 text-[12px] font-bold text-primary-700 group-hover:text-primary-800"
        >
          <i class="pi pi-arrow-right text-[11px] group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  </RouterLink>
</template>