<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchQuery = typeof route.query.q === 'string' ? route.query.q : ''
const delay = searchQuery ? 4000 : 2000

let timer = null

onMounted(() => {
  timer = setTimeout(() => router.replace({ name: 'home' }), delay)
})

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">404</h1>

    <p v-if="searchQuery" class="text-sm mt-1" style="color: var(--color-text-muted)">
      Tidak ada hasil untuk "{{ searchQuery }}". Anda akan diarahkan ke halaman beranda.
    </p>
    <p v-else class="text-sm mt-1" style="color: var(--color-text-muted)">
      Halaman tidak ditemukan, anda akan diarahkan ke halaman beranda.
    </p>

    <RouterLink :to="{ name: 'home' }" class="inline-block mt-4 text-sm font-semibold underline">
      Kembali ke beranda sekarang
    </RouterLink>
  </div>
</template>