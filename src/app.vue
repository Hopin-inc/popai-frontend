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
const route = useRoute();

onMounted(async () => {
  startLoading();
  const { layout } = route.meta;
  if (layout === "default" || layout === undefined) {
    await fetchAuthState();
    await fetchAll();
  }
  finishLoading();
});
</script>

<style lang="sass">
$font-family: "Lato", "Noto Sans JP", sans-serif

body
  font-family: $font-family !important
  [class*='text-']
    font-family: $font-family !important
  .v-checkbox-btn, .v-radio, .v-selection-control
    > .v-label
      opacity: var(--v-high-emphasis-opacity)
</style>
