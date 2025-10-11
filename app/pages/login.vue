<script setup lang="ts">
import type { LoginCredentials } from '~/types'

definePageMeta({
  layout: 'auth',
  middleware: [] // Auth middleware'dan ozod qilish
})

// State
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

// Form data
const form = reactive<LoginCredentials & { errors: Record<string, string> }>({
  username: '',
  password: '',
  errors: {}
})

// Form validation
const validateForm = (): boolean => {
  form.errors = {}
  let isValid = true

  if (!form.username.trim()) {
    form.errors.username = 'Foydalanuvchi nomi majburiy'
    isValid = false
  }

  if (!form.password) {
    form.errors.password = 'Parol majburiy'
    isValid = false
  } else if (form.password.length < 6) {
    form.errors.password = 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
    isValid = false
  }

  return isValid
}

// Submit handler
const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    await authStore.login({
      username: form.username,
      password: form.password
    })

    // Muvaffaqiyatli login bo'lsa, asosiy sahifaga yo'naltirish
    navigateTo('/')
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Login xatosi yuz berdi. Iltimos, qaytadan urinib ko\'ring.'
  } finally {
    loading.value = false
  }
}

// Input focus handler
const handleInputFocus = (field: 'username' | 'password') => {
  form.errors[field] = ''
  errorMessage.value = ''
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo / Branding -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tizimga kirish
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Davom etish uchun hisobingizga kiring
        </p>
      </div>

      <!-- Login Form Card -->
      <UCard
        :ui="{
          base: 'overflow-hidden',
          background: 'bg-white dark:bg-gray-800',
          shadow: 'shadow-xl',
          rounded: 'rounded-2xl'
        }"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Global Error Message -->
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="soft"
            :title="errorMessage"
            icon="i-heroicons-exclamation-triangle"
            :close-button="{ 
              icon: 'i-heroicons-x-mark-20-solid',
              color: 'red',
              variant: 'link'
            }"
            @close="errorMessage = ''"
          />

          <!-- Username Input -->
          <BaseInput
            v-model="form.username"
            type="text"
            label="Foydalanuvchi nomi"
            placeholder="username"
            :error="form.errors.username"
            :disabled="loading"
            required
            icon="i-heroicons-user"
            @focus="handleInputFocus('username')"
          />

          <!-- Password Input -->
          <BaseInput
            v-model="form.password"
            type="password"
            label="Parol"
            placeholder="••••••••"
            :error="form.errors.password"
            :disabled="loading"
            required
            icon="i-heroicons-lock-closed"
            @focus="handleInputFocus('password')"
          />

          <!-- Forgot Password Link -->
          <div class="flex items-center justify-end">
            <NuxtLink
              to="/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Parolni unutdingizmi?
            </NuxtLink>
          </div>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            :loading="loading"
            :disabled="loading"
            block
            size="lg"
            label="Kirish"
            icon="i-heroicons-arrow-right-on-rectangle"
          />
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              yoki
            </span>
          </div>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Hisobingiz yo'qmi?
            <NuxtLink
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Ro'yxatdan o'tish
            </NuxtLink>
          </p>
        </div>
      </UCard>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          © 2025 Barcha huquqlar himoyalangan
        </p>
      </div>
    </div>
  </div>
</template>