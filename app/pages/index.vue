<script setup lang="ts">
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Xayrli tong'
  if (hour < 18) return 'Xayrli kun'
  return 'Xayrli kech'
})
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ greeting }}, {{ authStore.user?.username }}! 👋
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Tizimga muvaffaqiyatli kirdingiz. Quyidagi bo'limlardan birini tanlang.
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/dashboard"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Statistikani ko'rish
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/profile"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Profil
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ma'lumotlarni tahrirlash
            </p>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/settings"
        class="group bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:scale-110 transition-transform">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Sozlamalar
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Tizim sozlamalari
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-blue-500 to-blue-600',
          ring: 'ring-0',
          shadow: 'shadow-lg'
        }"
      >
        <div class="text-white">
          <p class="text-sm opacity-90 mb-1">Jami foydalanuvchilar</p>
          <p class="text-3xl font-bold">1,234</p>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-green-500 to-green-600',
          ring: 'ring-0',
          shadow: 'shadow-lg'
        }"
      >
        <div class="text-white">
          <p class="text-sm opacity-90 mb-1">Aktiv sessiyalar</p>
          <p class="text-3xl font-bold">856</p>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-purple-500 to-purple-600',
          ring: 'ring-0',
          shadow: 'shadow-lg'
        }"
      >
        <div class="text-white">
          <p class="text-sm opacity-90 mb-1">Yangi xabarlar</p>
          <p class="text-3xl font-bold">42</p>
        </div>
      </UCard>

      <UCard
        :ui="{
          background: 'bg-gradient-to-br from-orange-500 to-orange-600',
          ring: 'ring-0',
          shadow: 'shadow-lg'
        }"
      >
        <div class="text-white">
          <p class="text-sm opacity-90 mb-1">Tugallangan vazifalar</p>
          <p class="text-3xl font-bold">95%</p>
        </div>
      </UCard>
    </div>
  </div>
</template>