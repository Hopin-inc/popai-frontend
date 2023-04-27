<template lang="pug">
div
  v-row
    v-col(cols="12").d-flex.align-center
      img(v-if="props.iconSrc" :src="props.iconSrc" width="40")
      h1.font-weight-bold {{ props.title }}
  slot
</template>

<script setup lang="ts">
type Props = {
  title: string;
  iconSrc?: string;
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
});
</script>
