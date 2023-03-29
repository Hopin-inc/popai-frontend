<template lang="pug">
v-app
  NuxtLayout
    NuxtPage
  Loading(v-model="loading")
</template>

<script setup lang="ts">
const { loading, startLoading, finishLoading } = useLoading();
const { fetchAll } = useInfo();
const { fetchAuthState } = useAuth();

onMounted(async () => {
  startLoading();
  await Promise.all([
    fetchAll(),
    fetchAuthState(),
  ]);
  finishLoading();
});
</script>
