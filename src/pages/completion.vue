<template lang="pug">
v-row
  v-col(cols="12").d-flex.justify-center.mt-10
    h2 POPAIの初期設定が完了しました！
  v-col(cols="12").d-flex.justify-center.mt-4
    img(:src="Icons.CRACKER" width="128")
</template>

<script setup lang="ts">
import { Icons } from "~/consts/images";

definePageMeta({
  layout: "setup",
});

useHead({
  title: "利用を開始",
});

const { startLoading, finishLoading } = useLoading();
const {
  setCurrentStep,
} = useSetup();

onBeforeMount(async () => {
  startLoading();
  await setCurrentStep(4);
  finishLoading();
});

</script>
