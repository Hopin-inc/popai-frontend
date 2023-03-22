<template lang="pug">
SettingCard(
  v-model:switch="enabled"
  title="見立て共有設定"
  subtitle="指定した時刻に、タスクの見立てや相談事項を尋ねるメッセージを個別に送信します。"
  append-type="switch"
)
  template(#content)
    CardSection(title="通知先 (Slack)")
      SelectBox(v-model="channel" :items="channels" label="チャンネル").mt-4
    CardSection(title="見立てを尋ねるタイミング")
      .d-flex.flex-column
        FormPart(title="開始日")
          v-radio-group(v-model="from" color="primary")
            v-radio(:value="1")
              template(#label)
                span タスクの着手日から
            v-radio(:value="2")
              template(#label)
                .d-flex.align-center
                  span 期日の
                  InlineSelectBox(v-model="fromDaysBefore" :items="daysBefore" :readonly="from !== 2").w-80px
                  span から
            v-radio(:value="3")
              template(#label)
                .d-flex.align-center
                  span 期日が属する週の初め（
                  InlineSelectBox(v-model="beginOfWeek" :items="days" :readonly="from !== 3").w-40px
                  span 曜日）
            v-radio(:value="4")
              template(#label)
                span タスクの作成日から
        FormPart(title="終了日")
          v-radio-group(v-model="to" color="primary")
            v-radio(:value="1" disabled)
              template(#label)
                span タスクの期日まで
        FormPart(title="頻度")
          v-radio-group(v-model="frequency" color="primary")
            v-radio(:value="1")
              template(#label)
                span 毎日
            v-radio(:value="2")
              template(#label)
                span 中間日のみ
            v-radio(:value="3").fill-label.allow-overflow.flex-fill
              template(#label)
                span.mr-2 指定日:
                MultipleSelectBox(
                  v-model="frequencyDaysBefore"
                  label="期日の…"
                  :items="daysBefore"
                  :readonly="frequency !== 3"
                  density="compact"
                ).flex-fill
    CardSection(title="通知時刻")
      v-table(v-if="timings.length").overflow-x-auto
        thead
          tr
            th.w-160px 時刻
            th.w-fit-content 指定時刻までに着手するタスクを選択
            th.w-80px 操作
        tbody
          tr(v-for="(timing, index) in timings" :key="timing")
            td: SettingTableSelectBox(v-model="timing.time" :items="times")
            td.w-fit-content: Switch(v-model="timing.askPlan").w-fit-content
              .d-flex.align-center(v-if="timing.askPlan")
                InlineSelectBox(v-model="timing.askPlanMilestone" :items="times").w-80px
                span までに着手するタスクを選択
            td: v-btn(@click.stop="deleteRow(index)" prepend-icon="mdi-delete" variant="outlined" color="error") 削除
      p(v-else) 通知時刻が設定されていません。
      v-btn.mt-2(@click.stop="addRow" prepend-icon="mdi-plus" variant="text" color="primary") 通知時刻を追加
</template>

<script setup lang="ts">
import { DAYS_BEFORE, DAYS_OF_WEEK, TIME_LIST } from "~/consts";
import { getChatToolChannels } from "~/apis/chat-tool";
import { ChatToolId } from "~/consts/enum";
import { getProspectConfig, updateProspectConfig } from "~/apis/config";

type SelectItem = {
  id: number | string;
  name: string;
};
type Timing = {
  time: string;
  askPlan: boolean;
  askPlanMilestone?: string;
};
type ConfigProspect = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
  from: number;
  to: number;
  fromDaysBefore: number;
  beginOfWeek: number;
  frequency: number;
  frequencyDaysBefore: number[];
  timings: ConfigProspectTiming[];
};
type ConfigProspectTiming = {
  time: string;
  askPlan: boolean;
  askPlanMilestone?: string;
};

const { startLoading, finishLoading } = useLoading();
const { implementedChatToolId } = useInfo();

const isInit = ref<boolean>(true);
const enabled = ref<boolean>(false);
const channel = ref<string | null>(null);
const from = ref<number | null>(null);
const to = ref<number | null>(null);
const fromDaysBefore = ref<number | null>(0);
const beginOfWeek = ref<number | null>(1);
const frequency = ref<number | null>(null);
const frequencyDaysBefore = ref<number[]>([]);
const timings = ref<Timing[]>([]);
const channels = ref<SelectItem[]>([]);

const days: SelectItem[] = DAYS_OF_WEEK;
const daysBefore: SelectItem[] = DAYS_BEFORE;

watch(enabled, async (next) => {
  await update({ enabled: next });
});
watch(channel, async (next) => {
  if (next) {
    await update({ chatToolId: implementedChatToolId.value ?? undefined, channel: next });
  }
});
watch(() => [from, fromDaysBefore, beginOfWeek], async () => {
  if (from.value) {
    await update({
      from: from.value,
      fromDaysBefore: fromDaysBefore.value ?? 0,
      beginOfWeek: beginOfWeek.value ?? 1,
    });
  }
}, { deep: true });
watch(() => [frequency, ...frequencyDaysBefore.value], async () => {
  if (frequency.value) {
    await update({
      frequency: frequency.value,
      frequencyDaysBefore: frequencyDaysBefore.value
    });
  }
}, { deep: true });
watch(() => [...timings.value], async (next) => {
  await update({ timings: next });
}, { deep: true });
const update = async (config: Partial<ConfigProspect>) => {
  if (!isInit.value) {
    startLoading();
    await updateProspectConfig(config);
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
  const config = await getProspectConfig();
  if (config) {
    enabled.value = config.enabled;
    channel.value = config.channel;
    from.value = config.from;
    to.value = config.to;
    fromDaysBefore.value = config.fromDaysBefore ?? 0;
    beginOfWeek.value = config.beginOfWeek ?? 1;
    frequency.value = config.frequency;
    frequencyDaysBefore.value = config.frequencyDaysBefore ?? [];
    timings.value = config.timings?.map(timing => reactive(timing)) ?? [];
  }
};
const getChannels = async () => {
  channels.value = await getChatToolChannels(ChatToolId.SLACK);
};

const addRow = () => {
  timings.value.push({
    time: "09:00:00",
    askPlan: false,
    askPlanMilestone: "13:00:00"
  });
};
const deleteRow = (index: number) => {
  timings.value.splice(index, 1);
};
const times: SelectItem[] = TIME_LIST;
</script>

<style scoped lang="sass">
$widths: 40, 80, 160, 240
@each $width in $widths
  .w-#{$width}px
    width: #{$width}px
    min-width: #{$width}px

.w-fit-content
  width: fit-content
  :deep(.v-input__control)
    width: fit-content

.fill-label
  :deep(label)
    flex-grow: 1

.allow-overflow
  :deep(.v-label)
    overflow: visible
</style>
