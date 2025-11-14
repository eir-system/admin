<script setup lang="ts">
import type { CompanyListResponse, Company } from "#shared/types/company";

const api = useApi();

const companies = ref<Company[]>([]);
const loading = ref(false);

const pagination = reactive({
  pageIndex: 0,
  pageSize: 10,
  total: 0
});

const search = ref("");

/* --------------------------
        LOAD DATA
--------------------------- */
async function loadData() {
  loading.value = true;

  const res = await api.get<CompanyListResponse>("/companies", {
    params: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search.value
    }
  });

  companies.value = res.data?.items || [];
  pagination.total = res.data?.total || 0;

  loading.value = false;
}

/* --------------------------
        EVENTS
--------------------------- */
function onPageChange(p: { pageIndex: number; pageSize: number }) {
  pagination.pageIndex = p.pageIndex;
  pagination.pageSize = p.pageSize;
  loadData();
}

function onSearch(value: string) {
  search.value = value;
  pagination.pageIndex = 0;
  loadData();
}

function onCreate() {
  console.log("Create clicked");
}

function onEdit(row: any) {
  console.log("Edit", row);
}

function onDelete(row: any) {
  console.log("Delete", row);
}

/* --------------------------
        INITIAL LOAD
--------------------------- */
onMounted(loadData);
</script>

<template>
  <BaseTable
    :data="companies"
    :columns="[
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'is_active', header: 'Active' },
      { accessorKey: 'created_at', header: 'Created At' }
    ]"
    :pagination="pagination"
    :loading="loading"
    :search-keys="['name']"
    show-search
    show-actions
    show-create
    @edit="onEdit"
    @delete="onDelete"
    @create="onCreate"
    @page-change="onPageChange"
    @search="onSearch"
  />
</template>
