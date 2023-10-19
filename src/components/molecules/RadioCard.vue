<template lang="pug">
v-card(
  :class="{'selected': data.selected}"
  flat
  @click.stop="onClick"
).px-8.py-6.mb-4
  .d-flex.align-center
    v-icon(
      v-if="props.data.selected"
      size="x-large"
      color="primary"
    ).mr-6 mdi-radiobox-marked
    v-icon(
      v-else
size="x-large"
    ).mr-6 mdi-radiobox-blank
    div
      p.text-subtitle-2 {{ props.data.captionBeforeTitle }}
      div.d-flex.align-center.mb-2
        h2 {{ props.data.title }}
        template(
          v-for="day in days"
          v-if="props.data.title==='○日前に聞く'"
:key="day.day"
        ).d-flex.align-center
          v-chip(
              v-if="day.selected"
              variant="elevated"
              color="primary"
          ).ml-2 {{ day.day }}
      p.text-subtitle-2(v-html="props.data.description")
</template>

<script setup lang="ts">
import type { RadioCardData, DayToConfirmProgress } from "~/types/settings";

type Props = {
  data: RadioCardData;
  days?: DayToConfirmProgress[];
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as RadioCardData),
  days: () => ([] as DayToConfirmProgress[]),
});

type Emits = {
  (e: "click-card", frequencyType: number): void
};
const emits = defineEmits<Emits>();

const onClick = () => {
  emits("click-card", props.data.frequencyType);
};
</script>

<style scoped lang="sass">
.selected
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) inset
</style>
