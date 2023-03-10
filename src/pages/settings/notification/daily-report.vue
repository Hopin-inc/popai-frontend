<template lang="pug">
SettingCard(
  v-model:switch="enabled"
  title="日報設定"
  subtitle="指定した時刻に、昨日完了したタスクと、今日取り組む予定のタスクが自動で共有されます。"
  append-type="switch"
)
  template(#content)
    CardSection(title="オプション")
      Switch(v-model="enablePending" label="5日以上更新されていないタスクをランダムに抽出して、対応を促す")
    CardSection(title="通知先 (Slack)")
      SelectBox(v-model="channel" :items="channels" label="チャンネル").mt-4
    CardSection(title="通知する時刻")
      SelectBox(v-model="channel" :items="channels" label="通知する時刻").mt-4
</template>

<script setup lang="ts">
type SelectItem<IdType = number> = {
  id: IdType;
  name: string;
  [key: string]: any;
}

const enabled = ref<boolean>(false);
const enablePending = ref<boolean>(false);
const channel = ref<string>("hogehoge");

const channels: SelectItem<string>[] = [
  { id: "hogehoge", name: "hogehoge" },
  { id: "fugafuga", name: "fugafuga" },
];
</script>
