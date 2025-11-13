import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

export const useLogin = () => {
  const toast = useToast();
  const api = useApi();
  const schema = z.object({
    username: z.string("Username majburiy").min(6, "Username kamida 6 ta belgidan iborat bo'lishi kerak").max(100, "Username juda uzun"),
    password: z
      .string("Parol majburiy")
      .min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, "Parol juda uzun"),
  });

  type Schema = z.output<typeof schema>;

  const state = reactive<Partial<Schema>>({
    username: undefined,
    password: undefined,
  });

  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      isLoading.value = true;
      errorMessage.value = null;

      const validatedData = schema.parse(event.data);

      const response = await api.post(
        "/auth/sign-in",
        {
          username: validatedData.username,
          password: validatedData.password,
        },
        { useToken: false }
      );
      if (response.success) {
        const atCookie = useCookie('at', {
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 15, // 15 minutes
        });
        atCookie.value = response.data.token.access_token;
        
        const rtCookie = useCookie('rt', {
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60, // 1 hour
        });
        rtCookie.value = response.data.token.refresh_token;

        const userCookie = useCookie('user', {
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        userCookie.value = response.data.user;

        await navigateTo("/");
        toast.add({
          title: response.message,
          color: "success",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Kutilmagan xatolik yuz berdi";
      }

      // Error notification
      toast.add({
        title: "Xatolik",
        description: errorMessage.value,
        color: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  // Clear error when user starts typing
  watch(
    () => [state.username, state.password],
    () => {
      if (errorMessage.value) {
        errorMessage.value = null;
      }
    }
  );

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  return {
    schema,
    state,
    onSubmit,
    isLoading: readonly(isLoading),
    errorMessage: readonly(errorMessage),
    currentYear,
  };
};
