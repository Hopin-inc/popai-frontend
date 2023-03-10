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
          v-radio-group(v-model="from" inline color="primary")
            v-radio(:value="1")
              template(#label)
                span タスクの着手日から
            v-radio(:value="2")
              template(#label)
                .d-flex.align-center
                  span 期日の
                  InlineSelectBox(v-model="fromDaysBefore" :items="daysBefore").w-80px
                  span から
            v-radio(:value="3")
              template(#label)
                .d-flex.align-center
                  span 期日が属する週の初め（
                  InlineSelectBox(v-model="beginOfWeek" :items="days").w-40px
                  span 曜日）
            v-radio(:value="4")
              template(#label)
                span タスクの作成日から
        FormPart(title="終了日")
          v-radio-group(v-model="to" inline color="primary")
            v-radio(:value="1" disabled)
              template(#label)
                span タスクの期日まで
        FormPart(title="頻度")
          v-radio-group(v-model="frequency" inline color="primary")
            v-radio(:value="1")
              template(#label)
                span 毎日
            v-radio(:value="2")
              template(#label)
                span 中間日のみ
            v-radio(:value="3").fill-label.flex-fill
              template(#label)
                span.mr-2 指定日:
                MultipleSelectBox(
                  v-model="frequencyDaysBefore"
                  label="期日の…"
                  :items="daysBefore"
                  density="compact"
                ).flex-fill
</template>

<script setup lang="ts">
import { DAYS_BEFORE, DAYS_OF_WEEK } from "~/consts";

type SelectItem = {
  id: number;
  name: string;
  [key: string]: any;
};

const enabled = ref<boolean>(false);
const channel = ref<string>("hogehoge");
const from = ref<number>(1);
const to = ref<number>(1);
const fromDaysBefore = ref<number>(1);
const beginOfWeek = ref<number>(1);
const frequency = ref<number>(1);
const frequencyDaysBefore = ref<number[]>([]);

const channels: SelectItem[] = [
  { id: 1, name: "hogehoge" },
  { id: 2, name: "fugafuga" },
];
const days: SelectItem[] = DAYS_OF_WEEK;
const daysBefore: SelectItem[] = DAYS_BEFORE;
</script>

<style scoped lang="sass">
$widths: 40, 80, 240
@each $width in $widths
  .w-#{$width}px
    min-width: #{$width}px

.fill-label
  :deep(label)
    flex-grow: 1
</style>
