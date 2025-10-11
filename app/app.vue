<script setup lang="ts">
// Auth store'ni yuklash
const authStore = useAuthStore()

// Component mount bo'lganda localStorage'dan ma'lumotlarni yuklash
onMounted(() => {
  authStore.loadFromLocalStorage()
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>