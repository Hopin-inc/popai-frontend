<template lang="pug">
v-card(flat rounded="xl").pa-8.fill-width
  v-row
    v-col(cols="12")
      .d-flex.align-center.mb-2
        img(v-if="props.iconSrc" :src="props.iconSrc" width="32").mr-2
        h2.font-weight-bold {{ props.title }}
      p.caption {{ props.description }}
  v-row
    v-col(cols="12")
      slot
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
.fill-width
  width: 100%
  max-width: 100%
</style>
