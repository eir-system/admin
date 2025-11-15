<script setup lang="ts">
import type { PropType } from "vue";

const vModel = defineModel<boolean>();

defineProps({
  title: {
    type: String as PropType<string>,
    default: "dsad",
  },
  description: {
    type: String as PropType<string>,
    default: "dsad",
  },
  overlay: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
});
</script>

<template>
  <UModal
    v-model:open="vModel"
    :title="title"
    :description="description"
    :overlay="overlay"
  >
    <template #content>
        <div class="px-4 py-2">
            <slot />
        </div>
    </template>
  </UModal>
</template>
