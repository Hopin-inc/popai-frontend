<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (2/2)
v-row
  v-col(cols="12").d-flex.justify-space-between
    SetupInfo(
      :todoAppIconSrc="todoAppIconSrc"
      :chatToolIconSrc="chatToolIconSrc"
      :features="setupFeatures"
    )
    v-btn(
      color="primary"
      variant="outlined"
    ) 再設定

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 1)"
)
  RadioCard(
    v-for="(radioCard, index) in radioCardData"
    :key="radioCard.title"
    :data="radioCard"
    @click-card="selectRadioCard"
  )

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

v-row.my-1.ml-9
  v-col(cols="12")
    v-btn(
      color="primary"
      @click="nextStep"
    ) 利用を開始する
</template>

<script setup lang="ts">
import { ExternalServiceLogos } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName, AskType, AskMode } from "~/consts/enum";
import type { SettingExpansionPanelData, RadioCardData, ConfigProspect, ConfigProspectTiming } from "~/types/settings";
import { DAYS_BEFORE, DAYS_OF_WEEK, TIME_LIST } from "~/consts";
import type { SelectItem } from "~/types/common";

useHead({
  title: "機能を設定する (2/2)",
});

const { startLoading, finishLoading, loading } = useLoading();
const {
  setCurrentStep,
  setupFeatures,
} = useSetup();

// TODO 前の画面から持ってくるようにする(composables?)
const todoAppName = TodoAppName[TodoAppId.SPREADSHEET];
const chatToolName = ChatToolName[ChatToolId.LINEWORKS];
const todoAppIconSrc = ExternalServiceLogos.SPREADSHEET;
const chatToolIconSrc = ExternalServiceLogos.LINEWORKS;

const times: SelectItem<string>[] = TIME_LIST;
const timings: Ref<ConfigProspectTiming[]> = ref<ConfigProspectTiming[]>([]);

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: "1. 進捗をヒアリングする条件を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: chatToolIconSrc,
    hasNextButton: true,
    hasBackButton: false,
  },
  {
    step: 2,
    title: "2. 進捗をヒアリングする時刻を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: chatToolIconSrc,
    hasNextButton: true,
    hasBackButton: true,
  },
  {
    step: 3,
    title: "3. 遅延しそうなタスクを共有するグループを選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: chatToolIconSrc,
    hasNextButton: false,
    hasBackButton: false,
  },
]);

const radioCardData: Ref<RadioCardData[]> = ref<RadioCardData[]>([
  {
    captionBeforeTitle: "着手日から期日まで",
    title: "毎日聞く",
    description: "違う場所や違う時間で働くチームの連携を円滑にできます。<br><b>朝会や日報の代わり、報連相の習慣化</b>にお使いいただけます。",
    selected: false,
  },
  {
    captionBeforeTitle: "着手日と期日の",
    title: "中間日に聞く",
    description: "期日まで2週間以上の余裕があるタスクを分担する安定したチームにおすすめ。<br><b>念のために中間報告することでリスクを可視化。</b>",
    selected: false,
  },
  {
    captionBeforeTitle: "期日の",
    title: "○日前に聞く",
    description: "期日直前に遅延が発覚することを防ぎます。<br><b>こまめな進捗共有も難しいほど、多忙なチームにおすすめ</b>です。",
    selected: false,
  },
]);

onBeforeMount(() => {
  setCurrentStep(3);
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

const selectRadioCard = (title: string) => {
  radioCardData.value.forEach((radioCard) => {
    radioCard.selected = radioCard.title === title;
  });
};

const nextStep = async () => {
  await navigateTo("/completion");
};

</script>
