<script setup lang="ts">
import BaseInput from "@/components/UI/BaseInput.vue";
import BaseBtn from "@/components/UI/BaseBtn.vue";
import PasswordInput from "@/components/UI/PasswordInput.vue";

definePageMeta({
  layout: "auth",
});

const { schema, state, onSubmit, isLoading, errorMessage, currentYear } =
  useLogin();
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">EIR SYSTEM</h1>
      </div>

      <div class="rounded-2xl shadow-xl p-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- Error Message -->
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="soft"
            :title="errorMessage"
            :close-button="{
              icon: 'i-lucide-x',
              color: 'gray',
              variant: 'link',
            }"
            class="mb-4"
          />

          <!-- email -->
          <UFormField label="Email" name="email" required>
            <BaseInput
              v-model="state.email"
              placeholder="example@email.com"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- password -->
          <UFormField label="Parol" name="password" required>
            <PasswordInput
              v-model="state.password"
              placeholder="Parolingizni kiriting"
              size="lg"
              :disabled="isLoading"
            />
          </UFormField>

          <!-- Submit Btn -->
          <BaseBtn
            type="submit"
            size="lg"
            :block="true"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Kirish
          </BaseBtn>
        </UForm>
      </div>

      <!-- Footer -->
      <div class="mt-24 text-center text-sm text-gray-500">
        <p>© {{ currentYear }} EIR SYSTEM.</p>
      </div>
    </div>
  </div>
</template>
