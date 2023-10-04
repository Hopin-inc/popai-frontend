<template lang="pug">
div.d-flex.align-center
  img(v-if="props.iconSrc" :src="props.iconSrc" width="48").mr-2
  div
    h2.font-weight-bold.mb-1 {{ title }}
    span {{ description }}
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
