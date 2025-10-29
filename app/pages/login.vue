<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { data } = await useFetch("/api/login");
</script>

<template>
  <h1>LOGIN PAGE -- {{ data?.id }}</h1>
</template>
