<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (2/2)
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
  v-card(flat).px-8.py-6

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 2)"
)
  v-card(flat).px-8.py-6

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
)
  v-card(flat).px-8.py-6

v-row.my-1.ml-10
  v-col(cols="12")
    v-btn(
      color="primary"
      @click="nextStep"
    ) 利用を開始する
</template>

<script setup lang="ts">
import { ExternalServiceLogos } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName } from "~/consts/enum";
import type { SettingExpansionPanelData } from "~/types/settings";

useHead({
  title: "機能を設定する (2/2)",
});

const { startLoading, finishLoading, loading } = useLoading();

// TODO 前の画面から持ってくるようにする(composables?)
const todoAppName = TodoAppName[TodoAppId.SPREADSHEET];
const chatToolName = ChatToolName[ChatToolId.LINEWORKS];
const todoAppIconSrc = ExternalServiceLogos.SPREADSHEET;
const chatToolIconSrc = ExternalServiceLogos.LINEWORKS;
const features = ["遅延のリマインド", "進捗のシェア"];

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

onMounted(async () => {
});

const nextStep = async () => {
  await navigateTo("/completion");
};

</script>
