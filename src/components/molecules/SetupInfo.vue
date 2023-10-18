<template lang="pug">
.d-flex.align-center
  span.mr-2 連携ツール：
  img(:src="setupTodoAppIconSrc" width="32").mr-2
  img(:src="setupChatToolIconSrc" width="32").mr-10
  span.mr-2 利用機能：
  template(v-for="featureId in setupFeatures" :key="featureId")
    v-chip(
      variant="outlined"
      color="primary"
    ).mr-2 {{ SetupFeatureName[featureId] }}
</template>

<script setup lang="ts">
import { SetupFeatureName } from "~/consts/setup";
const {
  setupTodoAppIconSrc,
  setupChatToolIconSrc,
  setupFeatures,
} = useSetup();
</script>
