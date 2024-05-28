<!-- layouts/extended.vue -->
<template lang="pug">
BaseLayout
  template(#sidebar)
    SettingStepper(
      :current-step="currentStep"
      :data="stepperItems"
      @click-step="chagePage"
    )
  template(#default)
    slot
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import BaseLayout from '~/layouts/default.vue';
  import type { SettingStepperData } from "~/types/settings";

  const {
    currentStep,
  } = useSetup();

  const stepperItems: Ref<SettingStepperData[]> = ref<SettingStepperData[]>([
  {
    step: 1,
    title: "機能を選ぶ",
  },
  {
    step: 2,
    title: "ツールを連携する",
  },
  {
    step: 3,
    title: "機能を設定する",
  },
  {
    step: 4,
    title: "利用を開始",
  },
]);

const chagePage = (step: number) => {
  switch (step) {
    case 1:
      navigateTo("/setup");
      break;
    case 2:
      navigateTo("/link");
      break;
    case 3:
      navigateTo("/setting/remind");
      break;
    case 4:
      navigateTo("/completion");
      break;
  }
};

  </script>
  
  