<template lang="pug">
.d-flex.flex-column.set-gap
  p {{ props.title }}
  slot
</template>

<script setup lang="ts">
type Props = {
  title: string;
};
const props = withDefaults(defineProps<Props>(), {
  title: ""
});
</script>

<style scoped lang="sass">
.set-gap
  gap: 12px
</style>
