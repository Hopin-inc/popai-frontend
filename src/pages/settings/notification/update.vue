<template lang="pug">
SettingCard(
  v-model:switch="enabled"
  title="タスク更新通知設定"
  subtitle="タスクが作成・更新・完了・保留されるたびに、通知します。"
  append-type="switch"
)
  template(#content)
    CardSection(title="通知先 (Slack)")
      SelectBox(v-model="channel" :items="channels" label="チャンネル").mt-4
</template>

<script setup lang="ts">
type SelectItem<IdType = number> = {
  id: IdType;
  name: string;
  [key: string]: any;
}

const enabled = ref<boolean>(false);
const channel = ref<string>("hogehoge");

const channels: SelectItem<string>[] = [
  { id: "hogehoge", name: "hogehoge" },
  { id: "fugafuga", name: "fugafuga" },
];
</script>
