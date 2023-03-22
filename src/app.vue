<template lang="pug">
v-app
  NuxtLayout
    NuxtPage
  Loading(v-model="loading")
</template>

<script setup lang="ts">
const { loading, startLoading, finishLoading } = useLoading();
const { fetchAll } = useInfo();

onMounted(async () => {
  startLoading();
  await fetchAll();
  finishLoading();
});
</script>
