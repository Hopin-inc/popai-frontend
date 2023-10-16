<template lang="pug">
.d-flex.align-center
  img(v-if="props.iconSrc" :src="props.iconSrc" width="48").mr-2
  div
    h3.font-weight-bold {{ title }}
    span.text-caption {{ description }}
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
