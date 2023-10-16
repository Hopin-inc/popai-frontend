<template lang="pug">
.base.d-flex.justify-center.align-center.bg-white
  .d-flex.justify-center.align-center.w-1120px
    template(
      v-for="(item, index) in props.data"
      :key="item.step"
    )
      div(
        :class="{'disabled': index + 1 >= props.currentStep}"
        @click="onClick(index + 1)"
      ).d-flex.align-center.btn
        v-btn(
          icon
          flat
          size="x-small"
          :disabled="index + 1 > props.currentStep"
          :color="getButtonColor(index)"
        ).mr-2.text-h6 {{ item.step }}
        p(
          :class="{'current': index + 1 === props.currentStep}"
        ).text-h6 {{ item.title }}
      hr.divider.mx-4(v-if="index + 1 !== props.data.length")
</template>

<script setup lang="ts">
import type { SettingStepperData } from "~/types/settings";

type Props = {
  currentStep?: number;
  data: SettingStepperData[];
};
const props = withDefaults(defineProps<Props>(), {
  currentStep: 1,
  data: () => ({} as SettingStepperData[]),
});

type Emits = {
  (e: "click-step", step: number): void
};
const emits = defineEmits<Emits>();

const getButtonColor = (index: number) => {
  return (index + 1 <= props.currentStep) ? "primary" : "grey";
};

const onClick = (step: number) => {
  if (step >= props.currentStep) { return; }
  emits("click-step", step);
};
</script>

<style scoped lang="sass">
.base
  width: 100%
  height: 164px
.w-1120px
  max-width: 1120px
.divider
  height: 2px
  width: 60px
.btn
  cursor: pointer
.disabled
  cursor: default
.current
  font-weight: bold
</style>
