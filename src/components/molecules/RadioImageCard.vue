<template lang="pug">
v-card(
  :class="{'selected': data.selected}"
  flat
  @click.stop="onClick"
).px-8.py-6
  .d-flex.align-center.justify-space-between
    div
      p.text-subtitle-1 {{ props.data.captionBeforeTitle }}
      h3.mb-2 {{ props.data.title }}
    v-icon(
      v-if="props.data.selected"
        size="x-large"
        color="primary"
    ).pl-2.pb-8 mdi-radiobox-marked
    v-icon(
      v-else size="x-large"
    ).pl-2.pb-8 mdi-radiobox-blank
  p.text-subtitle-2.mb-4 {{ props.data.description }}
  img(:src="props.data.imgSrc")
</template>

<script setup lang="ts">
import type { RadioImageCardData } from "~/types/settings";

type Props = {
  data: RadioImageCardData;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as RadioImageCardData),
});

type Emits = {
  (e: "click-card", title: string): void
};
const emits = defineEmits<Emits>();

const onClick = () => {
  emits("click-card", props.data.title);
};
</script>

<style scoped lang="sass">
.selected
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) inset
</style>
