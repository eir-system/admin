<script setup lang="ts">
  import { computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      leftIcon?: string
      rightIcon?: string
      loading?: boolean
      disabled?: boolean
      type?: 'button' | 'submit' | 'reset'
      variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
      block?: boolean
      ui?: Record<string, unknown>
    }>(),
    {
      size: 'md',
      iconSize: 'md',
      leftIcon: '',
      rightIcon: '',
      loading: false,
      disabled: false,
      type: 'button',
      variant: 'solid',
      block: false,
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
  <UButton
    :loading="loading"
    :disabled="disabled || loading"
    :size="size"
    :variant="variant"
    :type="type"
    :block="block"
    :ui="ui"
    class="cursor-pointer"
  >
    <template v-if="leftIcon" #leading>
      <UIcon :name="leftIcon" :class="iconClass" />
    </template>

    <template v-if="rightIcon" #trailing>
      <UIcon :name="rightIcon" :class="iconClass" />
    </template>

    <div class="inline-flex items-center justify-center text-center">
      <slot />
    </div>
  </UButton>
</template>
