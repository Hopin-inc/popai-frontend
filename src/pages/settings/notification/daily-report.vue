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
    CardSection(title="日報データベース (Notion)")
      SelectBox(v-model="database" :items="todoAppBoards" label="データベースを選択").mt-4
    CardSection(title="通知先 (Slack)")
      SelectBox(v-model="channel" :items="chatToolChannels" label="チャンネルを選択").mt-4
    CardSection(title="通知する時刻")
      SelectBox(v-model="time" :items="times" label="通知する時刻").mt-4
</template>

<script setup lang="ts">
import { TIME_LIST } from "~/consts";
import { getDailyReportConfig, updateDailyReportConfig } from "~/apis/config";

type SelectItem = {
  id: string;
  name: string;
};
type ConfigDailyReport = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
  documentToolId: number;
  database: string;
  timings: ConfigDailyReportTiming[];
};
type ConfigDailyReportTiming = {
  time: string;
  enablePending: boolean;
};

const { startLoading, finishLoading } = useLoading();
const { implementedChatToolId, chatToolChannels, todoAppBoards } = useInfo();

const isInit = ref<boolean>(true);
const enabled = ref<boolean>(false);
const enablePending = ref<boolean>(false);
const database = ref<string | null>(null);
const channel = ref<string | null>(null);
const time = ref<string>("09:00");

const times: SelectItem[] = TIME_LIST;

watch(enabled, async (next) => {
  await update({ enabled: next });
});
watch(database, async (next) => {
  if (next) {
    await update({ documentToolId: 1, database: next });
  }
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
  const config = await getDailyReportConfig();
  if (config) {
    const { timings } = config;
    enabled.value = config.enabled;
    channel.value = config.channel;
    database.value = config.database;
    if (timings?.length) {
      enablePending.value = timings[0].enablePending;
      time.value = timings[0].time;
    }
  }
};
</script>
