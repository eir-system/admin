<script setup lang="ts">
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

// Form data
const form = reactive({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  role: authStore.user?.role || '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  errors: {} as Record<string, string>
})

const loading = ref(false)
const successMessage = ref('')

// Update profile
const handleUpdateProfile = async () => {
  form.errors = {}
  successMessage.value = ''
  
  if (!form.username.trim()) {
    form.errors.username = 'Foydalanuvchi nomi majburiy'
    return
  }

  loading.value = true

  try {
    // API call to update profile
    // await useApiPut('/api/profile', { ... })
    
    // Mock success
    await new Promise(resolve => setTimeout(resolve, 1000))
    successMessage.value = 'Profil muvaffaqiyatli yangilandi'
  } catch (error) {
    form.errors.general = 'Xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}

// Change password
const handleChangePassword = async () => {
  form.errors = {}
  successMessage.value = ''
  
  if (!form.currentPassword) {
    form.errors.currentPassword = 'Joriy parol majburiy'
    return
  }

  if (!form.newPassword || form.newPassword.length < 6) {
    form.errors.newPassword = 'Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak'
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    form.errors.confirmPassword = 'Parollar mos kelmaydi'
    return
  }

  loading.value = true

  try {
    // API call to change password
    // await useApiPost('/api/profile/change-password', { ... })
    
    // Mock success
    await new Promise(resolve => setTimeout(resolve, 1000))
    successMessage.value = 'Parol muvaffaqiyatli o\'zgartirildi'
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error) {
    form.errors.general = 'Xatolik yuz berdi'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Profil
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        Shaxsiy ma'lumotlaringizni boshqaring
      </p>
    </div>

    <!-- Success Message -->
    <UAlert
      v-if="successMessage"
      color="green"
      variant="soft"
      :title="successMessage"
      icon="i-heroicons-check-circle"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'green',
        variant: 'link'
      }"
      @close="successMessage = ''"
    />

    <!-- Profile Information -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Profil ma'lumotlari
        </h2>
      </template>

      <form @submit.prevent="handleUpdateProfile" class="space-y-6">
        <div class="flex items-center gap-6">
          <!-- Avatar -->
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {{ authStore.user?.username?.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ authStore.user?.username }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ authStore.user?.role }}
            </p>
            <UButton
              label="Rasmni o'zgartirish"
              variant="ghost"
              size="sm"
              class="mt-2"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="form.username"
            label="Foydalanuvchi nomi"
            placeholder="username"
            :error="form.errors.username"
            icon="i-heroicons-user"
          />

          <BaseInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            :error="form.errors.email"
            icon="i-heroicons-envelope"
          />
        </div>

        <BaseInput
          v-model="form.role"
          label="Rol"
          :disabled="true"
          icon="i-heroicons-shield-check"
        />

        <div class="flex justify-end">
          <BaseButton
            type="submit"
            :loading="loading"
            label="Saqlash"
            icon="i-heroicons-check"
          />
        </div>
      </form>
    </UCard>

    <!-- Change Password -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Parolni o'zgartirish
        </h2>
      </template>

      <form @submit.prevent="handleChangePassword" class="space-y-6">
        <BaseInput
          v-model="form.currentPassword"
          type="password"
          label="Joriy parol"
          placeholder="••••••••"
          :error="form.errors.currentPassword"
          icon="i-heroicons-lock-closed"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            v-model="form.newPassword"
            type="password"
            label="Yangi parol"
            placeholder="••••••••"
            :error="form.errors.newPassword"
            icon="i-heroicons-key"
          />

          <BaseInput
            v-model="form.confirmPassword"
            type="password"
            label="Parolni tasdiqlang"
            placeholder="••••••••"
            :error="form.errors.confirmPassword"
            icon="i-heroicons-key"
          />
        </div>

        <div class="flex justify-end">
          <BaseButton
            type="submit"
            :loading="loading"
            label="Parolni o'zgartirish"
            icon="i-heroicons-arrow-path"
          />
        </div>
      </form>
    </UCard>

    <!-- Danger Zone -->
    <UCard
      :ui="{
        ring: 'ring-red-500 dark:ring-red-400'
      }"
    >
      <template #header>
        <h2 class="text-xl font-semibold text-red-600 dark:text-red-400">
          Xavfli zona
        </h2>
      </template>

      <div class="space-y-4">
        <p class="text-gray-600 dark:text-gray-400">
          Hisobingizni o'chirish qaytarilmas jarayon. Barcha ma'lumotlaringiz doimiy ravishda o'chiriladi.
        </p>
        <BaseButton
          label="Hisobni o'chirish"
          color="red"
          variant="outline"
          icon="i-heroicons-trash"
        />
      </div>
    </UCard>
  </div>
</template>