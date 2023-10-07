<template lang="pug">
v-card(
  :class="{'selected': data.selected}"
  flat
  @click.stop="onClick"
).px-8.py-6.mb-4
  .d-flex.align-center
    v-icon.mr-4(v-if="props.data.selected" size="large").mr-1 mdi-radiobox-marked
    v-icon.mr-4(v-else size="large").mr-1 mdi-radiobox-blank
    div
      p.text-subtitle-2 {{ props.data.captionBeforeTitle }}
      h2.mb-2 {{ props.data.title }}
      p.text-subtitle-2(v-html="props.data.description")
</template>

<script setup lang="ts">
import type { RadioCardData } from "~/types/settings";

type Props = {
  data: RadioCardData;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as RadioCardData),
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
