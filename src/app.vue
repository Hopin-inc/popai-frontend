<template lang="pug">
v-app
  NuxtLayout
    Loading(v-model="loading")
    NuxtPage
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const { loading } = useLoading();
</script>
