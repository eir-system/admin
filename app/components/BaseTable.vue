<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";

import {
  useDebounceFn,
  breakpointsTailwind,
  useBreakpoints,
} from "@vueuse/core";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const props = withDefaults(
  defineProps<{
    data?: any[];
    columns: TableColumn<any>[];
    searchKeys?: string[];
    showSearch?: boolean;
    showCreate?: boolean;
    showActions?: boolean;
    loading?: boolean;
    pagination?: {
      pageIndex: number;
      pageSize: number;
      total: number;
    };
  }>(),
  {
    data: () => [],
    searchKeys: () => [],
    showSearch: false,
    showCreate: false,
    showActions: false,
    loading: false,
    pagination: () => ({ pageIndex: 0, pageSize: 10, total: 0 }),
  }
);

const emit = defineEmits<{
  (e: "edit", row: any): void;
  (e: "delete", row: any): void;
  (e: "page-change", payload: { pageIndex: number; pageSize: number }): void;
  (e: "search", value: string): void;
  (e: "create", value: boolean): void;
}>();

const activeBreakpoint = useBreakpoints(breakpointsTailwind).active();

const pagination = reactive({ ...props.pagination });
const searchValue = ref("");

watch(
  () => props.pagination,
  (val) => Object.assign(pagination, val),
  { deep: true }
);

/* --------------------------
      PAGE CHANGE
--------------------------- */
function updatePage(page: number) {
  pagination.pageIndex = page - 1;
  emit("page-change", {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });
}

function updatePageSize(size: number) {
  pagination.pageSize = size;
  emit("page-change", {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  });
}

/* --------------------------
        CREATE
--------------------------- */
function createBtn() {
  emit("create", true);
}

/* --------------------------
        SEARCH
--------------------------- */
const debouncedSearch = useDebounceFn(() => {
  emit("search", searchValue.value);
}, 400);

watch(searchValue, () => {
  debouncedSearch();
});

/* --------------------------
        ACTIONS COLUMN
--------------------------- */
function getRowItems(row: Row<any>) {
  return [
    { label: "Actions", type: "label" },
    {
      label: "Edit",
      icon: "i-lucide-pencil",
      onSelect: () => emit("edit", row.original),
    },
    {
      label: "Delete",
      icon: "i-lucide-trash-2",
      onSelect: () => emit("delete", row.original),
    },
  ];
}

const finalColumns = computed(() => {
  if (!props.showActions) return props.columns;

  return [
    ...props.columns,
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: Row<any> }) =>
        h(
          UDropdownMenu,
          { content: { align: "end" }, items: getRowItems(row) },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              variant: "ghost",
            })
        ),
    },
  ];
});

const showPaginationEdges = computed(() => {
  return activeBreakpoint.value !== "" && activeBreakpoint.value !== "sm";
});
</script>

<template>
  <div class="flex flex-col w-full flex-1">
    <!-- TOP BAR -->
    <div
      v-if="showSearch || showCreate"
      class="sticky top-0 flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md z-10"
    >
      <UInput
        v-if="showSearch"
        class="w-xs mr-4 md:mr-0"
        placeholder="Search..."
        v-model="searchValue"
      />

      <UButton v-if="showCreate" icon="i-lucide-plus" @click="createBtn">
        Create
      </UButton>
    </div>

    <!-- TABLE -->
    <UTable
      :data="data"
      :columns="finalColumns"
      :loading="loading"
      :pagination="pagination"
      class="flex-1"
    />

    <!-- PAGINATION -->
    <div
      v-if="data.length > 0"
      class="sticky bottom-0 flex justify-end bg-white/60 backdrop-blur-md px-4 py-3 z-10"
    >
      <USelect
        v-model="pagination.pageSize"
        :items="[10, 20, 50, 100]"
        @update:model-value="updatePageSize"
      />
      <UPagination
        :model-value="pagination.pageIndex + 1"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        :show-edges="showPaginationEdges"
        @update:page="updatePage"
        class="ml-3"
      />
    </div>
  </div>
</template>
