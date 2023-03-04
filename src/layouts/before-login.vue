<template lang="pug">
v-main
  NuxtPage
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${ title } - sakura3` : "sakura3",
});
</script>

<style scoped lang="sass">
.page-container
  max-width: 1440px
  margin: auto
</style>
