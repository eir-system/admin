<script setup lang="ts">
import BaseTable from '@/components/BaseTable.vue'
import type { TableColumn } from '@nuxt/ui'

type User = { id: string; name: string; email: string; role: string }

const users = reactive<User[]>([
  { id: '1', name: 'Alice', email: 'alice@mail.com', role: 'admin' },
  { id: '2', name: 'Bob', email: 'bob@mail.com', role: 'user' },
  { id: '3', name: 'Charlie', email: 'charlie@mail.com', role: 'user' },
  { id: '4', name: 'Diana', email: 'diana@mail.com', role: 'moderator' },
  { id: '5', name: 'Eve', email: 'eve@mail.com', role: 'user' },
  { id: '6', name: 'Frank', email: 'frank@mail.com', role: 'admin' },
  ...Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 7),
    name: `User ${i + 7}`,
    email: `user${i + 7}@mail.com`,
    role: i % 2 ? 'user' : 'admin',
  })),
])

const senders = ref<User[]>([])
senders.value.push(...users.slice(0, 10))

const columns: TableColumn<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
]

const pagination = reactive({
  pageIndex: 0,
  pageSize: 10,
  total: users.length,
})

const tableLoading = ref(false)

function onEdit(row: User) {
  console.log('Edit:', row)
}

function onDelete(row: User) {
  console.log('Delete:', row)
}

function onPageChange(newPagination: { pageIndex: number; pageSize: number; total: number }) {
  console.log('Page Change:', newPagination)
  tableLoading.value = true
  pagination.pageIndex = newPagination.pageIndex
  pagination.pageSize = newPagination.pageSize
  pagination.total = users.length

  senders.value = users.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  )

  setTimeout(() => {
    tableLoading.value = false
  }, 1000)
  console.log('New senders:', senders.value)
}
</script>

<template>
  <BaseTable :data="senders" :columns="columns" :search-keys="['name', 'email']" :pagination="pagination"
    :loading="tableLoading" show-search show-actions @edit="onEdit" @delete="onDelete" @page-change="onPageChange" />
</template>
