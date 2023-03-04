<template lang="pug">
SettingCard(
  title="タスク管理ツール連携"
  subtitle="タスク管理ツール (Notion, Trello) とsakura3を接続するための設定です。"
)
  template(v-slot:content)
    CardSectionName Notion
    v-btn(
      nuxt
      href="https://www.notion.so/"
      target="_blank"
      append-icon="mdi-launch"
      color="primary"
    ) 連携する
</template>