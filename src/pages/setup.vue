<template lang="pug">
v-row
  v-col(cols="12")
    SetupTitle(
      title="1. タスク管理ツールを選ぶ",
      description="タスクの情報を自動で取得します。",
    )
v-row
  template(v-for="todoApp in todoApps" :key="todoApp.toolName")
    LinkToolBtn(
      :toolName="todoApp.toolName"
      :enabled="todoApp.enabled"
      :selected="todoApp.selected"
      :iconSrc="todoApp.iconSrc"
      @click-card="installTool"
    ).mr-4
v-row.mt-10
  v-col(cols="12")
    SetupTitle(
      title="2. チャットツールを選ぶ",
      description="社員や全体へのメッセージを送信します。",
    )
v-row
  template(v-for="chatTool in chatTools" :key="chatTool.toolName")
    LinkToolBtn(
      :toolName="chatTool.toolName"
      :enabled="chatTool.enabled"
      :selected="chatTool.selected"
      :iconSrc="chatTool.iconSrc"
      @click-card="installTool"
    ).mr-4
v-row.mt-10
  v-col(cols="12")
    SetupTitle(
      title="3. POPAIに依頼したいことを選ぶ",
      description="チームの自律性を育むために、、、TODO",
    )
v-row
  template(v-for="feature in features" :key="feature.title")
    FeatureCheckBox(
      :title="feature.title",
      :description="feature.description",
      :checked="feature.checked",
      :imgSrc="feature.imgSrc",
    ).mr-4
v-row.my-10
  v-btn(
    color="primary"
    @click="nextStep"
  ) ツール連携に進む
</template>

<script setup lang="ts">
import { ExternalServiceLogos, CaptureImages } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName } from "~/consts/enum";
import type { LinkToolBtnData, FeatureCheckBoxData } from "~/types/settings";

useHead({
  title: "機能を選ぶ",
});
const { startLoading, finishLoading, loading } = useLoading();

const todoApps: Ref<LinkToolBtnData[]> = ref<LinkToolBtnData[]>([
  {
    toolName: TodoAppName[TodoAppId.SPREADSHEET],
    enabled: true,
    selected: false,
    iconSrc: ExternalServiceLogos.SPREADSHEET,
  },
  {
    toolName: TodoAppName[TodoAppId.NOTION],
    enabled: true,
    selected: false,
    iconSrc: ExternalServiceLogos.NOTION,
  },
  {
    toolName: TodoAppName[TodoAppId.BACKLOG],
    enabled: true,
    selected: false,
    iconSrc: ExternalServiceLogos.BACKLOG,
  },
]);
const chatTools: Ref<LinkToolBtnData[]> = ref<LinkToolBtnData[]>([
  {
    toolName: ChatToolName[ChatToolId.SLACK],
    enabled: true,
    selected: false,
    iconSrc: ExternalServiceLogos.SLACK,
  },
  {
    toolName: ChatToolName[ChatToolId.LINEWORKS],
    enabled: true,
    selected: false,
    iconSrc: ExternalServiceLogos.LINEWORKS,
  },
]);
const features: Ref<FeatureCheckBoxData[]> = ref<FeatureCheckBoxData[]>([
  {
    title: "遅延したタスクにリマインド",
    description: "期日を過ぎても完了していないタスクを\nPOPAIがやさしくリマインド。",
    checked: false,
    imgSrc: CaptureImages.FEATURE_REMIND,
  },
  {
    title: "遅延しそうなタスクをシェア",
    description: "社員は簡単な質問に答えるだけ。\nPOPAIが聞いてきた進捗を紹介します！",
    checked: false,
    imgSrc: CaptureImages.FEATURE_SHARE,
  },
]);

const installTool = (toolName: string) => {
  switch (toolName) {
    case TodoAppName[TodoAppId.SPREADSHEET]:
    case TodoAppName[TodoAppId.NOTION]:
    case TodoAppName[TodoAppId.BACKLOG]:
      updateLinkToolBtnState(todoApps.value, toolName);
      break;
    case ChatToolName[ChatToolId.SLACK]:
    case ChatToolName[ChatToolId.LINEWORKS]:
      updateLinkToolBtnState(chatTools.value, toolName);
      break;
  }
};

const updateLinkToolBtnState = (tools: LinkToolBtnData[], toolName: string) => {
  // 選択したToolをselectedにする
  const selectedTool = tools.find(tool => tool.toolName === toolName);
  if (selectedTool) {
    selectedTool.selected = true;
    selectedTool.enabled = true;
  }
  // 選択したTool以外は、disabledにする
  tools
    .filter(tool => tool.toolName !== toolName)
    .forEach((disabledTool) => {
      disabledTool.selected = false;
      disabledTool.enabled = false;
    });
};

const nextStep = async () => {
  await navigateTo("/link");
};
</script>
