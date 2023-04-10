<template lang="pug">
SettingCard(
  title="タスク管理ツール連携"
  subtitle="タスク管理ツール (Notion, Trello) とPOPAIを接続するための設定です。"
)
  template(#content)
    CardSection(title="Notion")
      .d-flex.align-center
        v-btn(
          nuxt
          :href="`${ config.public.apiBaseUrl }/notion/install`"
          target="_blank"
          prepend-icon="mdi-connection"
          flat
          color="primary"
        ) {{ isNotionConnected ? "再度連携する" : "連携する" }}
        .d-flex.align-center(v-if="isNotionConnected").ml-4
          v-icon(size="sm" color="success").mr-1 mdi-check
          p.text-body-2.text-success.font-weight-bold 連携済み
</template>

<script setup lang="ts">
import { TodoAppId } from "~/consts/enum";

useHead({
  title: "タスク管理ツール連携",
});

const { implementedTodoApps } = useInfo();
const config = useRuntimeConfig();
const isNotionConnected = computed(() => implementedTodoApps.value.some(t => t.todoAppId === TodoAppId.NOTION));
</script>
