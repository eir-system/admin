<script setup lang="ts">
const authStore = useAuthStore()
const colorMode = useColorMode()

// Logout handler
const handleLogout = async () => {
  await authStore.logout()
}

// Toggle dark mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="text-2xl font-bold text-gray-900 dark:text-white">
              Logo
            </NuxtLink>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Bosh sahifa
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/profile"
              class="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              Profil
            </NuxtLink>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center gap-3">
            <!-- Dark Mode Toggle -->
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              color="gray"
              variant="ghost"
              size="sm"
              @click="toggleColorMode"
            />

            <!-- User Menu -->
            <UDropdown
              :items="[
                [{
                  label: authStore.user?.username || 'Foydalanuvchi',
                  slot: 'account',
                  disabled: true
                }],
                [{
                  label: 'Profil',
                  icon: 'i-heroicons-user-circle',
                  click: () => navigateTo('/profile')
                }, {
                  label: 'Sozlamalar',
                  icon: 'i-heroicons-cog-6-tooth',
                  click: () => navigateTo('/settings')
                }],
                [{
                  label: 'Chiqish',
                  icon: 'i-heroicons-arrow-right-on-rectangle',
                  click: handleLogout
                }]
              ]"
              :popper="{ placement: 'bottom-end' }"
            >
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-user-circle"
                size="sm"
              >
                {{ authStore.user?.username }}
              </UButton>
            </UDropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Barcha huquqlar himoyalangan
          </p>
          <div class="flex items-center gap-6">
            <NuxtLink
              to="/privacy"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Maxfiylik
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Shartlar
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>