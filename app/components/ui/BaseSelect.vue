<script setup lang="ts">
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'none'
  searchable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', value: string | number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'outline',
  disabled: false,
  required: false,
  searchable: false
})

const emit = defineEmits<Emits>()

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

// Find selected option
const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === selectedValue.value)
})

// Select state classes
const hasError = computed(() => !!props.error)
const selectClasses = computed(() => ({
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

    <!-- Select with Nuxt UI -->
    <USelectMenu
      v-model="selectedValue"
      :options="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :size="size"
      :variant="variant"
      :searchable="searchable"
      option-attribute="label"
      value-attribute="value"
      :ui="{
        base: selectClasses,
        rounded: 'rounded-lg'
      }"
    >
      <template #label>
        {{ selectedOption?.label || placeholder }}
      </template>
    </USelectMenu>

    <!-- Error message -->
    <p
      v-if="error"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>