<template lang="pug">
SettingCard(
  title="チャットツール連携"
  subtitle="チャットツール (Slack, LINE) とPOPAIを接続するための設定です。"
)
  template(#content)
    CardSection(title="Slack")
      .d-flex.align-center
        v-btn(
          nuxt
          :href="`${ config.public.apiBaseUrl }/slack/install`"
          target="_blank"
          prepend-icon="mdi-connection"
          flat
          color="primary"
        ) {{ isSlackConnected ? "再度連携する" : "連携する" }}
        .d-flex.align-center(v-if="isSlackConnected").ml-4
          v-icon(size="sm" color="success").mr-1 mdi-check
          p.text-body-2.text-success.font-weight-bold 連携済み
</template>

<script setup lang="ts">
import { ChatToolId } from "~/consts/enum";

useHead({
  title: "チャットツール連携",
});

const { implementedChatTools } = useInfo();
const config = useRuntimeConfig();
const isSlackConnected = computed(() => implementedChatTools.value.some(c => c.chatToolId === ChatToolId.SLACK));
</script>
