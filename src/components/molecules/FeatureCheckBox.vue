<template lang="pug">
v-card(
  :class="{'checked': props.data.checked}"
  flat
  rounded="s"
  @click.stop="onClick"
  width="428"
).pa-8
  .d-flex.align-center.mb-2
    v-icon(
      v-if="props.data.checked"
      size="large"
      color="primary"
    ).mr-1 mdi-checkbox-marked
    v-icon(v-else size="large").mr-1 mdi-checkbox-blank-outline
    h3 {{ props.data.title }}
  p.line-break.mb-4 {{ props.data.description }}
  img(:src="props.data.imgSrc")
</template>

<script setup lang="ts">
import type { Feature, FeatureCheckBoxData } from "~/types/settings";

type Props = {
  data: FeatureCheckBoxData;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as FeatureCheckBoxData),
});

type Emits = {
  (e: "click-card", feature: Feature): void
};
const emits = defineEmits<Emits>();

// const checked = computed(() => (props.data.checked)); TODO なくても動く？

const onClick = () => {
  emits("click-card", props.data.feature);
};
</script>

<style scoped lang="sass">
.line-break
  white-space: pre-wrap

.checked
  box-shadow: 0 0 0 2px rgb(var(--v-theme-primary)) inset
</style>
