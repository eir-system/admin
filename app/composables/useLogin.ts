import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import {parseTtl} from "#shared/utils/parseTtl"

export const useLogin = () => {
  const config = useRuntimeConfig()
  const toast = useToast();
  const api = useApi();
  const schema = z.object({
    username: z
      .string("Username majburiy")
      .min(6, "Username kamida 6 ta belgidan iborat bo'lishi kerak")
      .max(100, "Username juda uzun"),
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

      const response = await api.post<LoginBaseResponse>(
        "/auth/sign-in",
        {
          username: validatedData.username,
          password: validatedData.password,
        },
        { useToken: false }
      );
      if (response.success) {
        const atCookie = useCookie('at', {
          httpOnly: false,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          path: '/',
          maxAge: parseTtl(config.public.accessTtl),
        });
        atCookie.value = response.data?.access_token;
        
        const rtCookie = useCookie('rt', {
          httpOnly: false,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          path: '/',
          maxAge: parseTtl(config.public.refreshTtl),
        });
        rtCookie.value = response.data?.refresh_token;

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

      toast.add({
        title: "Xatolik",
        description: errorMessage.value,
        color: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

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
