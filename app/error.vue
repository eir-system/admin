<script setup lang="ts">
  defineProps({
    error: {
      type: Object,
      required: true,
    },
  })

  const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-8">
    <h1 class="text-4xl font-bold text-red-500 mb-4">
      {{ error.statusCode === 404 ? '404 — Sahifa topilmadi' : 'Xatolik yuz berdi' }}
    </h1>
    <p class="text-gray-600 mb-6">
      {{ error.message || 'Iltimos, keyinroq urinib ko‘ring.' }}
    </p>
    <UButton color="primary" @click="handleError"> Bosh sahifaga qaytish </UButton>
  </div>
</template>
