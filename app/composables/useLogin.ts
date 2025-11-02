import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

export const useLogin = () => {
  const toast = useToast()
  const schema = z.object({
    email: z.string('Email majburiy').email("Email manzil noto'g'ri formatda"),
    password: z
      .string('Parol majburiy')
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, 'Parol juda uzun'),
  })

  type Schema = z.output<typeof schema>

  const state = reactive<Partial<Schema>>({
    email: undefined,
    password: undefined,
  })

  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      isLoading.value = true
      errorMessage.value = null

      schema.parse(event.data)

      // TODO: Replace with actual API call
      // Example:
      // const { data, error } = await $fetch('/api/auth/login', {
      //   method: 'POST',
      //   body: validatedData
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock success - redirect to dashboard
      // navigateTo('/dashboard');

      // Mock error for demonstration
      // throw new Error("Email yoki parol noto'g'ri");

      // Success notification
      await navigateTo('/')
      toast.add({ title: 'Muvaffaqiyatli!', description: 'Tizimga kirildi', color: 'success' })
    } catch (error) {
      // Handle validation errors
      // if (error instanceof z.ZodError) {
      //   errorMessage.value = error?.errors[0]?.message || "Validatsiya xatosi";
      //   return;
      // }

      // Handle API errors
      if (error instanceof Error) {
        errorMessage.value = error.message
      } else {
        errorMessage.value = 'Kutilmagan xatolik yuz berdi'
      }

      // Error notification
      toast.add({ title: 'Xatolik', description: errorMessage.value, color: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  // Clear error when user starts typing
  watch(
    () => [state.email, state.password],
    () => {
      if (errorMessage.value) {
        errorMessage.value = null
      }
    }
  )

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  return {
    schema,
    state,
    onSubmit,
    isLoading: readonly(isLoading),
    errorMessage: readonly(errorMessage),
    currentYear,
  }
}
