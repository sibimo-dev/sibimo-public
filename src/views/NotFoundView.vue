<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
let timer = null

onMounted(() => {
  timer = setTimeout(() => router.replace({ name: 'home' }), 2000)
})

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold">404</h1>
    <p class="text-sm mt-1" style="color: var(--color-text-muted)">
      Halaman tidak ditemukan, anda akan diarahkan ke halaman beranda.
    </p>
  </div>
</template>