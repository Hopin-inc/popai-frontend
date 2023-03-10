<template lang="pug">
v-app
  NuxtLayout
    NuxtPage
  Loading(v-model="loading")
</template>

<script setup lang="ts">
const { loading } = useLoading();
</script>
