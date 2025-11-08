<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui'

const toasterConfig: ToasterProps = {
  position: 'top-right',
}
</script>
<template>
  <UApp :toaster="toasterConfig">
    <UContainer>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UContainer>
  </UApp>
</template>
