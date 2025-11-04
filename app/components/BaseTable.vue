<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui'
  import type { Row } from '@tanstack/vue-table'

  const UButton = resolveComponent('UButton')
  const UDropdownMenu = resolveComponent('UDropdownMenu')

  const props = withDefaults(
    defineProps<{
      data?: any[]
      columns: TableColumn<any>[]
      searchKeys?: string[]
      showSearch?: boolean
      showActions?: boolean
      loading?: boolean
      pagination?: {
        pageIndex: number
        pageSize: number
        total: number
      }
    }>(),
    {
      data: () => [],
      searchKeys: () => [],
      showSearch: false,
      showActions: false,
      loading: true,
      pagination: () => ({ pageIndex: 0, pageSize: 10, total: 0 }),
    }
  )

  const emit = defineEmits<{
    (e: 'edit', row: any): void
    (e: 'delete', row: any): void
    (e: 'page-change', pagination: { pageIndex: number; pageSize: number; total: number }): void
  }>()

  const pagination = reactive({ ...props.pagination })
  const columnFilters = ref([])
  const searchValue = ref('')
  const table = ref()

  watch(
    () => props.pagination,
    (val) => Object.assign(pagination, val),
    { deep: true }
  )

  function updatePage(page: number) {
    pagination.pageIndex = page - 1
    emit('page-change', { ...pagination })
  }

  function updatePageSize(size: number) {
    pagination.pageSize = size
    emit('page-change', { ...pagination })
  }

  // search
  watch(searchValue, (val) => {
    if (!props.searchKeys?.length || !table.value) return
    props.searchKeys.forEach((key) => {
      table.value.tableApi?.getColumn(key)?.setFilterValue(val || '')
    })
  })

  function getRowItems(row: Row<any>) {
    return [
      { label: 'Actions', type: 'label' },
      {
        label: 'Edit',
        icon: 'i-lucide-pencil',
        color: 'info',
        onSelect: () => emit('edit', row.original),
      },
      {
        label: 'Delete',
        icon: 'i-lucide-trash-2',
        color: 'error',
        onSelect: () => emit('delete', row.original),
      },
    ]
  }

  const finalColumns = computed(() => {
    if (!props.showActions) return props.columns
    return [
      ...props.columns,
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: Row<any> }) =>
          h(
            'div',
            { class: 'text-right' },
            h(UDropdownMenu, { content: { align: 'end' }, items: getRowItems(row) }, () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                color: 'neutral',
                variant: 'ghost',
              })
            )
          ),
      },
    ]
  })
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div
      v-if="showSearch && searchKeys?.length"
      class="sticky top-0 flex px-4 py-3.5 border-b border-accented bg-white/50 backdrop-blur-sm z-10"
    >
      <UInput class="max-w-sm" placeholder="Search..." v-model="searchValue" />
    </div>

    <UTable
      ref="table"
      :column-filters="columnFilters"
      :data="[...data]"
      :columns="finalColumns"
      :loading="loading"
      :pagination="pagination"
      class="flex-1"
    />

    <div
      class="sticky bottom-0 flex items-center justify-end border-t border-default pt-4 px-4 bg-white/50 backdrop-blur-sm z-10 space-x-2"
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
        :sibling-count="1"
        show-edges
        @update:page="updatePage"
      />
    </div>
  </div>
</template>
