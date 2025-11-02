<script setup lang="ts">
  import type { ToasterProps } from '@nuxt/ui'

  const toasterConfig: ToasterProps = {
    position: 'top-right',
  }
</script>
<template>
  <UApp :toaster="toasterConfig">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
