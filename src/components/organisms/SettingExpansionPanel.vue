<template lang="pug">
v-row.mb-3.mt-8
  v-col(cols="12").d-flex.justify-space-between
    IconicTitle(
      :title="props.data.title"
      :description="props.data.description"
      :icon-src="props.data.iconSrc"
    )
    .d-flex.align-center
      v-icon(
        color="green"
        size="large"
        :icon="isDone ? 'mdi-check-circle' : ''"
      ).mx-2
      v-btn(
        size="large"
        variant="text"
        @click.stop="emits('click-toggle-panel', props.data.step)"
      )
        v-icon(
          size="large"
          :icon="panelIcon"
        )
v-row(:class="{'panel-hidden': !isOpen}")
  v-col(cols="12").d-flex.align-center
    v-divider(
      v-if="props.data.hasNextButton"
      vertical
      :thickness="2"
    ).mx-6
    //- v-dividerがない時の幅を調整するためのdiv
    div(v-else).mx-6
    .w-100
      slot
      .d-flex.align-center
        v-btn(
          v-if="props.data.hasNextButton"
          color="primary"
          :disabled="!isDone"
          @click.stop="emits('click-next', props.data.step)"
        ).mt-4 次へ進む
        v-btn(
          v-if="props.data.hasBackButton"
          color="primary"
          variant="text"
          @click.stop="emits('click-prev', props.data.step)"
        ).mt-4 前に戻る
</template>

<script setup lang="ts">
import type { SettingExpansionPanelData } from "~/types/settings";
type Props = {
  data: SettingExpansionPanelData;
};
const props = withDefaults(defineProps<Props>(), {
  data: () => ({} as SettingExpansionPanelData),
});

type Emits = {
  (e: "click-next", step: number): void
  (e: "click-prev", step: number): void
  (e: "click-toggle-panel", id: number): void
};
const emits = defineEmits<Emits>();

const isOpen = computed(() => (props.data.isOpen));
const panelIcon = computed(() => (isOpen.value ? "mdi-chevron-up" : "mdi-chevron-down"));
const isDone = computed(() => (props.data.isDone));

</script>

<style scoped lang="sass">
.panel-hidden
  display: none
</style>
