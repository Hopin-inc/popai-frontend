<template lang="pug">
SettingCard(
  title="タスク管理ツール連携"
  subtitle="タスク管理ツール (Notion, Trello) とsakura3を接続するための設定です。"
)
  template(#content)
    CardSection(title="Notion")
      v-btn(
        nuxt
        href="https://www.notion.so/"
        target="_blank"
        append-icon="mdi-launch"
        color="primary"
      ) 連携する
</template>

<script setup lang="ts">
useHead({
  title: "タスク管理ツール連携"
});
</script>
