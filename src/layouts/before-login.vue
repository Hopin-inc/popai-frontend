<template lang="pug">
v-main
  v-container.fill-height.card-container.pa-8
    slot
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - sakura3` : "sakura3"
});
</script>

<style scoped lang="sass">
.card-container
  max-width: 480px
  margin: auto
</style>
