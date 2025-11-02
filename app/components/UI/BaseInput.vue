<script setup lang="ts">
  import { computed } from 'vue'

  const vModel = defineModel<string | number>()

  const props = withDefaults(
    defineProps<{
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      leftIcon?: string
      rightIcon?: string
      loading?: boolean
      disabled?: boolean
      placeholder?: string
      type?: 'text' | 'number' | 'tel' | 'url'
      variant?: 'outline' | 'none'
      ui?: Record<string, unknown>
    }>(),
    {
      size: 'md',
      iconSize: 'sm',
      leftIcon: '',
      rightIcon: '',
      loading: false,
      disabled: false,
      placeholder: '',
      type: 'text',
      variant: 'outline',
      ui: () => ({}),
    }
  )

  const iconClass = computed(() => {
    const sizes = {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-7',
    }
    return sizes[props.iconSize]
  })
</script>

<template>
  <UInput
    v-model="vModel"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    :type="type"
    :placeholder="placeholder"
    :variant="variant"
    class="w-full"
    :ui="ui"
  >
    <template v-if="leftIcon" #leading>
      <UIcon :name="leftIcon" :class="iconClass" />
    </template>

    <template v-if="rightIcon" #trailing>
      <UIcon :name="rightIcon" :class="iconClass" />
    </template>
  </UInput>
</template>
