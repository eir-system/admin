<script setup lang="ts">
  const vModel = defineModel<string>()
  const show = ref(false)

  withDefaults(
    defineProps<{
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      loading?: boolean
      disabled?: boolean
      placeholder?: string
      color?: string
      variant?: 'outline' | 'none'
      ui?: Record<string, unknown>
    }>(),
    {
      size: 'md',
      iconSize: 'sm',
      loading: false,
      disabled: false,
      placeholder: 'Parolingizni kiriting',
      color: 'primary',
      variant: 'outline',
      ui: () => ({ trailing: 'pe-0' }),
    }
  )

  const togglePassword = () => {
    show.value = !show.value
  }
</script>

<template>
  <UInput
    v-model="vModel"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :placeholder="placeholder"
    :type="show ? 'text' : 'password'"
    :variant="variant"
    :ui="ui"
    class="pointer w-full"
    autocomplete="on"
  >
    <template #trailing>
      <UButton
        :size="size"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Parolni yashirish' : 'Parolni ko\'rsatish'"
        :aria-pressed="show"
        :disabled="disabled"
        variant="ghost"
        class="cursor-pointer"
        @click="togglePassword"
      />
    </template>
  </UInput>
</template>
