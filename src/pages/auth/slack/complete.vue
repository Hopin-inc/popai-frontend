<template lang="pug">
PageTitle Slack
p {{ text }}
</template>

<script setup lang="ts">
import { redirectToSlack } from "~/apis/connect";

const { query } = useRoute();
const result = ref<unknown>(null);

onMounted(async () => {
  result.value = await redirectToSlack(query);
});

const text = computed(() => JSON.stringify(result.value));
</script>
