<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui'

  const open = ref(false)
  const route = useRoute()

  const activeLinkLabel = computed(() => {
    const link = links.flat().find((item) => item.to === route.path)
    return link?.label.toUpperCase()
  })

  const links = [
    [
      {
        label: 'Home',
        icon: 'i-lucide-house',
        to: '/',
        onSelect: () => {
          open.value = false
        },
      },
    ],
  ] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="px-4 py-3 w-full flex items-center justify-center">
          <NuxtLink to="/" class="text-2xl text-primary font-bold">
            {{ collapsed ? 'ES' : 'EIR SYSTEM' }}
          </NuxtLink>
        </div>
      </template>
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>
    </UDashboardSidebar>
    <UDashboardPanel id="home">
      <template #header>
        <UDashboardNavbar :title="activeLinkLabel" :ui="{ right: 'gap-3' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
