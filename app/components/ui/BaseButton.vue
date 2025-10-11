<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'solid' | 'outline' | 'soft' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  iconRight?: string
  label?: string
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'solid',
  color: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

// Button classes
const buttonClasses = computed(() => ({
  'w-full': props.block,
  'cursor-not-allowed opacity-50': props.disabled,
  'cursor-wait': props.loading
}))
</script>

<template>
  <UButton
    :type="type"
    :variant="variant"
    :color="color"
    :size="size"
    :disabled="disabled || loading"
    :loading="loading"
    :icon="icon"
    :trailing-icon="iconRight"
    :label="label"
    :ui="{
      base: buttonClasses,
      rounded: 'rounded-lg',
      font: 'font-medium'
    }"
    @click="handleClick"
  >
    <slot />
  </UButton>
</template>