<template lang="pug">
.d-flex.align-center
  img(v-if="props.iconSrc" :src="props.iconSrc" width="48").mr-2
  div
    h2.font-weight-bold.mb-1 {{ title }}
    span.line-break {{ description }}
</template>

<script setup lang="ts">
type Props = {
  title: string;
  description: string;
  iconSrc?: string;
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  iconSrc: undefined,
});
</script>

<style scoped lang="sass">
.line-break
  white-space: pre-wrap
</style>
