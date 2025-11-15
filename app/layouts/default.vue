<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(false);
const route = useRoute();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + "/");
};

const rawLinks = [
  [
    {
      label: "Home",
      icon: "i-lucide-house",
      to: "/",
      onSelect: () => (open.value = false),
    },
    {
      label: "Companies",
      icon: "i-lucide-building-2",
      to: "/companies",
      onSelect: () => (open.value = false),
    },
  ],
] satisfies NavigationMenuItem[][];

const links = computed(() =>
  rawLinks.map((group) =>
    group.map((item) => ({
      ...item,
      active: isActive(item.to),
    }))
  )
);

const activeLinkLabel = computed(() => {
  const link = links.value.flat().find((item) => item.active);
  return link?.label?.toUpperCase();
});
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
      <!-- SIDEBAR HEADER -->
      <template #header="{ collapsed }">
        <div class="px-4 py-3 w-full flex items-center justify-center">
          <NuxtLink to="/" class="text-2xl text-primary font-bold">
            {{ collapsed ? "ES" : "EIR SYSTEM" }}
          </NuxtLink>
        </div>
      </template>

      <!-- SIDEBAR MENU -->
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

    <!-- MAIN PANEL -->
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
