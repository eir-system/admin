<script setup lang="ts">
const authStore = useAuthStore()

definePageMeta({
  middleware: 'auth'
})

// Sample data
const stats = ref([
  { label: 'Jami foydalanuvchilar', value: '1,234', change: '+12%', icon: 'i-heroicons-users', color: 'blue' },
  { label: 'Aktiv sessiyalar', value: '856', change: '+5%', icon: 'i-heroicons-signal', color: 'green' },
  { label: 'Yangi xabarlar', value: '42', change: '+18%', icon: 'i-heroicons-chat-bubble-left-right', color: 'purple' },
  { label: 'Tugallangan', value: '95%', change: '+3%', icon: 'i-heroicons-check-circle', color: 'orange' }
])

const recentActivities = ref([
  { id: 1, user: 'Ali Valiyev', action: 'Yangi post yaratdi', time: '5 daqiqa oldin' },
  { id: 2, user: 'Sardor Rahimov', action: 'Profilni yangiladi', time: '15 daqiqa oldin' },
  { id: 3, user: 'Dilnoza Karimova', action: 'Izoh qoldirdi', time: '30 daqiqa oldin' },
  { id: 4, user: 'Jasur Ergashev', action: 'Fayl yukladi', time: '1 soat oldin' }
])
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Tizim statistikasi va faoliyat
        </p>
      </div>
      <BaseButton
        label="Yangi"
        icon="i-heroicons-plus"
        color="primary"
      />
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        :ui="{
          base: 'transition-all duration-200 hover:shadow-lg',
          body: { padding: 'p-6' }
        }"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {{ stat.label }}
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
            <p class="text-sm text-green-600 dark:text-green-400 mt-1">
              {{ stat.change }}
            </p>
          </div>
          <div
            class="p-3 rounded-lg"
            :class="{
              'bg-blue-100 dark:bg-blue-900/20': stat.color === 'blue',
              'bg-green-100 dark:bg-green-900/20': stat.color === 'green',
              'bg-purple-100 dark:bg-purple-900/20': stat.color === 'purple',
              'bg-orange-100 dark:bg-orange-900/20': stat.color === 'orange'
            }"
          >
            <UIcon
              :name="stat.icon"
              class="w-8 h-8"
              :class="{
                'text-blue-600 dark:text-blue-400': stat.color === 'blue',
                'text-green-600 dark:text-green-400': stat.color === 'green',
                'text-purple-600 dark:text-purple-400': stat.color === 'purple',
                'text-orange-600 dark:text-orange-400': stat.color === 'orange'
              }"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activities -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            So'nggi faoliyatlar
          </h2>
          <UButton
            label="Barchasini ko'rish"
            variant="ghost"
            size="sm"
            trailing-icon="i-heroicons-arrow-right"
          />
        </div>
      </template>

      <div class="space-y-4">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {{ activity.user.charAt(0) }}
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ activity.user }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ activity.action }}
              </p>
            </div>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ activity.time }}
          </span>
        </div>
      </div>
    </UCard>
  </div>
</template>