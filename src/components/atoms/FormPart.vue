<template lang="pug">
.d-flex.flex-column.set-gap
  .d-flex.justify-start.align-center
    p.text-subtitle-2.mr-2 {{ props.title }}
    v-chip(
      v-if="props.required"
      color="red"
      size="x-small"
      variant="outlined"
    ) 必須
  slot
</template>

<script setup lang="ts">
type Props = {
  title: string;
  required?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
  required: false,
});
</script>

<style scoped lang="sass">
.set-gap
  gap: 4px
</style>
