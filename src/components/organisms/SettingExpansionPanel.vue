<template lang="pug">
v-row.mb-3.mt-8
  v-col(cols="12").d-flex.justify-space-between
    IconicTitle(
      :title="props.data.title"
      :description="props.data.description"
      :iconSrc="props.data.iconSrc"
    )
    .d-flex.align-center
      v-icon(color="green" size="large").mx-2 mdi-check-circle
      v-btn(
        size="large"
        variant="text"
        @click.stop="togglePanel"
      )
        v-icon(
          size="large"
          :icon="panelIcon"
        )
v-row(:class="{'panel-hidden': panelHidden}")
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
        ).mt-4 次へ進む
        v-btn(
          v-if="props.data.hasBackButton"
          color="primary"
          variant="text"
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

const panelHidden = ref<boolean>(false);
const panelIcon = computed(() => (panelHidden.value ? "mdi-chevron-down" : "mdi-chevron-up"));

const togglePanel = () => {
  panelHidden.value = !panelHidden.value;
};
</script>

<style scoped lang="sass">
.panel-hidden
  display: none
</style>
