<template lang="pug">
v-main
  v-container.fill-height.card-container.pa-8
    slot
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - Popai` : "Popai"
});
</script>

<style scoped lang="sass">
.card-container
  max-width: 480px
  margin: auto
</style>
