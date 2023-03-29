<template lang="pug">
SettingCard(
  v-model:switch="enabled"
  title="タスク更新通知設定"
  subtitle="タスクが作成・更新・完了・保留されるたびに、通知します。"
  append-type="switch"
)
  template(#content)
    CardSection(title="通知先 (Slack)")
      SelectBox(v-model="channel" :items="chatToolChannels" label="チャンネル").mt-4
</template>

<script setup lang="ts">
import { getNotifyConfig, updateNotifyConfig } from "~/apis/config";

type SelectItem = {
  id: string;
  name: string;
};
type ConfigNotify = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
};

const { implementedChatToolId, chatToolChannels } = useInfo();
const { startLoading, finishLoading } = useLoading();

const isInit = ref<boolean>(true);
const enabled = ref<boolean>(false);
const channel = ref<string | null>(null);

watch(enabled, async (next) => {
  await update({ enabled: next });
});
watch(channel, async (next) => {
  if (next) {
    await update({ chatToolId: implementedChatToolId.value ?? undefined, channel: next });
  }
});
const update = async (config: Partial<ConfigNotify>) => {
  if (!isInit.value) {
    startLoading();
    await updateNotifyConfig(config);
    finishLoading();
  }
};

onMounted(async () => {
  await init();
});
watch(chatToolChannels, async () => {
  await init();
}, { deep: true });
const init = async () => {
  if (chatToolChannels.value.length) {
    startLoading();
    await fetchConfig();
    isInit.value = false;
    finishLoading();
  }
};
const fetchConfig = async () => {
  const config = await getNotifyConfig();
  if (config) {
    enabled.value = config.enabled;
    channel.value = config.channel;
  }
};
</script>
