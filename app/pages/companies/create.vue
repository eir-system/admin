<script setup lang="ts">
import BaseBtn from "@/components/UI/BaseBtn.vue";
import BaseInput from "@/components/UI/BaseInput.vue";
import PasswordInput from "@/components/UI/PasswordInput.vue";

const router = useRouter();
</script>

<template>
  <div class="w-full h-8 flex items-center justify-start">
    <BaseBtn
      left-icon="i-lucide-arrow-left"
      variant="outline"
      @click="router.back()"
    />
  </div>
  <div>
    <UForm class="space-y-6">
      <!-- Error Message -->
      <UAlert
        v-if="false"
        color="error"
        variant="soft"
        :close-button="{
          icon: 'i-lucide-x',
          color: 'gray',
          variant: 'link',
        }"
        class="mb-4"
      />

      <!-- company data -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
        <!-- company name -->
        <UFormField
          label="Company name"
          name="company_name"
          class="sm:col-span-2"
          required
        >
          <BaseInput placeholder="Company Name" />
        </UFormField>
      </div>

      <USeparator />

      <!-- owner data -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
        <!-- username -->
        <UFormField label="Username" name="username" required>
          <BaseInput placeholder="Username" />
        </UFormField>

        <!-- password -->
        <UFormField label="Password" name="password" required>
          <PasswordInput placeholder="Password" size="lg" />
        </UFormField>

        <!-- first_name -->
        <UFormField label="First Name" name="first_name" required>
          <BaseInput placeholder="First Name" />
        </UFormField>

        <!-- last_name -->
        <UFormField label="Last Name" name="last_name" required>
          <BaseInput placeholder="Last Name" />
        </UFormField>
      </div>

      <!-- Submit Btn -->
      <BaseBtn type="submit" size="lg" :block="true"> Create </BaseBtn>
    </UForm>
  </div>
</template>
