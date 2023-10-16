<template lang="pug">
.d-flex.align-center
  span.mr-2 連携ツール：
  img(:src="props.todoAppIconSrc" width="32").mr-2
  img(:src="props.chatToolIconSrc" width="32").mr-10
  span.mr-2 利用機能：
  template(v-for="feature in props.features" :key="feature")
    v-chip(
      variant="outlined"
      color="primary"
    ).mr-2 {{ feature }}
</template>

<script setup lang="ts">
import type { Feature } from "~/types/settings";

type Props = {
  todoAppIconSrc: string;
  chatToolIconSrc: string;
  features: Feature[];
};
const props = withDefaults(defineProps<Props>(), {
  todoAppIconSrc: "",
  chatToolIconSrc: "",
  features: () => [],
});
</script>
