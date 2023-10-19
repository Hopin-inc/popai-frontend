<template lang="pug">
v-card(
  :class="{'checked': props.data.checked}"
  flat
  rounded="s"
  width="428"
  @click.stop="onClick"
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
import type { ISetupFeatureId, FeatureCheckBoxData } from "~/types/setup";

type Props = {
  data: FeatureCheckBoxData;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as FeatureCheckBoxData),
});

type Emits = {
  (e: "click-card", feature: ISetupFeatureId): void
};
const emits = defineEmits<Emits>();

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
