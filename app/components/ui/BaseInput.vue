<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'none'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'outline',
  disabled: false,
  required: false
})

const emit = defineEmits<Emits>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleBlur = () => emit('blur')
const handleFocus = () => emit('focus')

// Input state classes
const hasError = computed(() => !!props.error)
const inputClasses = computed(() => ({
  'border-red-500 focus:ring-red-500': hasError.value
}))
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input with Nuxt UI -->
    <UInput
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :icon="icon"
      :size="size"
      :variant="variant"
      :ui="{ 
        base: inputClasses,
        rounded: 'rounded-lg',
        placeholder: 'placeholder-gray-400 dark:placeholder-gray-500'
      }"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- Error message -->
    <p
      v-if="error"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>