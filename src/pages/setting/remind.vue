<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (1/2)
v-row
  v-col(cols="12").d-flex.justify-space-between
    SetupInfo(
      :todoAppIconSrc="todoAppIconSrc"
      :chatToolIconSrc="chatToolIconSrc"
      :features="features"
    )
    v-btn(
      color="primary"
      variant="outlined"
    ) 再設定

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 1)"
)
  v-row
    v-col(cols="12" sm="6")
      v-card(flat).px-8.py-6
        p.text-subtitle-1 タスク管理ツールでの
        h3.mb-2 期日の再設定を促す
        p.text-subtitle-2.mb-4 遅延したタスクだけでなく、他タスクの状況も踏まえた丁寧な検討を経て、期日を再設定できます。
        img(:src="CaptureImages.REMIND_PURPOSE_RECONFIGURE")
    v-col(cols="12" sm="6")
      v-card(flat).px-8.py-6
        p.text-subtitle-1 チャットツールで
        h3.mb-2 データの更新を促す
        p.text-subtitle-2.mb-4 タスク管理ツールにアクせずせずとも、かんたんで素早く遅延のネクストアクションを実行できます。
        img(:src="CaptureImages.REMIND_PURPOSE_UPDATE")

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 2)"
)
  v-card(flat).px-8.py-6
    v-row(v-for="(timing, index) in timings" :key="timing").d-flex.align-center
      v-col(cols="4")
        SettingTableSelectBox(
          v-model="timing.time"
          :items="times"
          :rules="[validationNoDuplicate]"
        )
      v-col(cols="2").px-0
        v-btn(
          flat
          prepend-icon="mdi-close"
        ) 削除
    v-row
      v-col(cols="2").pt-0
        v-btn(
          @click.stop="addRow"
          prepend-icon="mdi-plus"
          variant="text"
          color="primary"
        ) 追加する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
)
  v-card(flat).px-8.py-6
    v-row
      v-col(cols="4")
        SelectBox(
        )

v-row.my-1.ml-10
  v-col(cols="12")
    v-btn(
      color="primary"
      @click="nextStep"
    ) 次の機能設定に進む
</template>

<script setup lang="ts">
import { ExternalServiceLogos, CaptureImages } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName, AskType, AskMode } from "~/consts/enum";
import type { SettingExpansionPanelData, ConfigProspect, ConfigProspectTiming } from "~/types/settings";
import { DAYS_BEFORE, DAYS_OF_WEEK, TIME_LIST } from "~/consts";
import type { SelectItem } from "~/types/common";

useHead({
  title: "機能を設定する (1/2)",
});

const { startLoading, finishLoading, loading } = useLoading();

// TODO 前の画面から持ってくるようにする(composables?)
const todoAppName = TodoAppName[TodoAppId.SPREADSHEET];
const chatToolName = ChatToolName[ChatToolId.LINEWORKS];
const todoAppIconSrc = ExternalServiceLogos.SPREADSHEET;
const chatToolIconSrc = ExternalServiceLogos.LINEWORKS;
const features = ["遅延のリマインド", "進捗のシェア"];

const times: SelectItem<string>[] = TIME_LIST;
const timings: Ref<ConfigProspectTiming[]> = ref<ConfigProspectTiming[]>([]);

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: "1. リマインドする目的を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: chatToolIconSrc,
    hasNextButton: true,
    hasBackButton: false,
  },
  {
    step: 2,
    title: "2. リマインドする時刻を設定する",
    description: "期日を過ぎた翌日の何時にリマインドするかを選んでください。",
    iconSrc: chatToolIconSrc,
    hasNextButton: true,
    hasBackButton: true,
  },
  {
    step: 3,
    title: "3. 遅延タスクを共有するグループを選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: chatToolIconSrc,
    hasNextButton: false,
    hasBackButton: false,
  },
]);

onBeforeMount(() => {
  addRow();
});

const addRow = () => {
  timings.value.push({
    time: "09:00:00",
    type: AskType.PROJECTS,
    mode: AskMode.UNDEFINED,
  });
};

const validationNoDuplicate = (value: string) => {
  return timings.value.filter(t => t.time === value).length > 1 ? "同じ時刻を複数設定することはできません。" : false;
};

const nextStep = async () => {
  await navigateTo("/setting/prospect");
};

</script>
