<template lang="pug">
SettingCard(
  title="チャットツール連携"
  subtitle="チャットツール (Slack, LINE) とsakura3を接続するための設定です。"
)
  template(#content)
    CardSection(title="Slack")
      v-btn(
        nuxt
        :href="slackUrl"
        target="_blank"
        append-icon="mdi-launch"
        color="primary"
        :disabled="!slackUrl"
      ) 連携する
</template>

<script setup lang="ts">
import { getAddSlackUrl } from "~/apis/connect";
import CardSection from "~/components/molecules/CardSection.vue";

useHead({
  title: "チャットツール連携"
});

const { startLoading, finishLoading } = useLoading();

const slackUrl = ref<string | null>(null);
onMounted(async () => {
  startLoading();
  slackUrl.value = await getAddSlackUrl() ?? null;
  finishLoading();
});
</script>
