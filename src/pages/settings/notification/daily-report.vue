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
      SelectBox(v-model="time" :items="times" label="通知する時刻").mt-4
</template>

<script setup lang="ts">
import { TIME_LIST } from "~/consts";
import { getChatToolChannels } from "~/apis/chat-tool";
import { ChatToolId } from "~/consts/enum";
import { getDailyReportConfig, updateDailyReportConfig } from "~/apis/config";

type SelectItem = {
  id: string;
  name: string;
};
type ConfigDailyReport = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
  timings: ConfigDailyReportTiming[];
};
type ConfigDailyReportTiming = {
  time: string;
  enablePending: boolean;
};

const { startLoading, finishLoading } = useLoading();
const { implementedChatToolId } = useInfo();

const isInit = ref<boolean>(true);
const enabled = ref<boolean>(false);
const enablePending = ref<boolean>(false);
const channel = ref<string | null>(null);
const time = ref<string>("09:00");

const channels = ref<SelectItem[]>([]);
const times: SelectItem[] = TIME_LIST;

watch(enabled, async (next) => {
  await update({ enabled: next });
});
watch(channel, async (next) => {
  if (next) {
    await update({ chatToolId: implementedChatToolId.value ?? undefined, channel: next });
  }
});
watch([enablePending, time], async () => {
  await update({
    timings: [{ enablePending: enablePending.value, time: time.value }]
  });
});
const update = async (config: Partial<ConfigDailyReport>) => {
  if (!isInit.value) {
    startLoading();
    await updateDailyReportConfig(config);
    finishLoading();
  }
};

onMounted(async () => {
  await init();
});
const init = async () => {
  startLoading();
  await Promise.all([
    fetchConfig(),
    getChannels()
  ]);
  isInit.value = false;
  finishLoading();
};
const fetchConfig = async () => {
  const config = await getDailyReportConfig();
  if (config) {
    const { timings } = config;
    enabled.value = config.enabled;
    channel.value = config.channel;
    if (timings?.length) {
      enablePending.value = timings[0].enablePending;
      time.value = timings[0].time;
    }
  }
};
const getChannels = async () => {
  channels.value = await getChatToolChannels(ChatToolId.SLACK);
};
</script>
