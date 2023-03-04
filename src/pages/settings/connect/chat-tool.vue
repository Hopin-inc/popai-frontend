<template lang="pug">
SettingCard(
  title="チャットツール連携"
  subtitle="チャットツール (Slack, LINE) とsakura3を接続するための設定です。"
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