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
      :data="todoApp"
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
      :data="chatTool"
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
      :data="feature"
      @click-card="onClickFeatureCard"
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
import type { LinkToolBtnData, Feature, FeatureCheckBoxData } from "~/types/settings";

useHead({
  title: "機能を選ぶ",
});
const { startLoading, finishLoading, loading } = useLoading();
const {
  setCurrentStep,
  setSetupTodoAppId,
  setSetupChatToolId,
  setupFeatures,
  addSetupFeature,
  deleteSetupFeature,
} = useSetup();

const todoApps: Ref<LinkToolBtnData[]> = ref<LinkToolBtnData[]>([
  {
    toolName: TodoAppName[TodoAppId.SPREADSHEET],
    selected: false,
    iconSrc: ExternalServiceLogos.SPREADSHEET,
  },
  {
    toolName: TodoAppName[TodoAppId.NOTION],
    selected: false,
    iconSrc: ExternalServiceLogos.NOTION,
  },
  {
    toolName: TodoAppName[TodoAppId.BACKLOG],
    selected: false,
    iconSrc: ExternalServiceLogos.BACKLOG,
  },
]);
const chatTools: Ref<LinkToolBtnData[]> = ref<LinkToolBtnData[]>([
  {
    toolName: ChatToolName[ChatToolId.SLACK],
    selected: false,
    iconSrc: ExternalServiceLogos.SLACK,
  },
  {
    toolName: ChatToolName[ChatToolId.LINEWORKS],
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
    feature: "遅延のリマインド",
  },
  {
    title: "遅延しそうなタスクをシェア",
    description: "社員は簡単な質問に答えるだけ。\nPOPAIが聞いてきた進捗を紹介します！",
    checked: false,
    imgSrc: CaptureImages.FEATURE_SHARE,
    feature: "進捗のシェア",
  },
]);

const onClickFeatureCard = (feature: Feature) => {
  features.value.forEach((f) => {
    if (f.feature === feature) {
      f.checked = !f.checked;
      if (f.checked) {
        addSetupFeature(feature);
      } else {
        deleteSetupFeature(feature);
      }
    }
  });
};

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
  }
  // 選択したTool以外は、disabledにする
  tools
    .filter(tool => tool.toolName !== toolName)
    .forEach((disabledTool) => {
      disabledTool.selected = false;
    });
};

onBeforeMount(() => {
  setCurrentStep(1);
  features.value.forEach((feature) => {
    if (setupFeatures.value.find(f => f === feature.feature)) {
      feature.checked = true;
    } else {
      feature.checked = false;
    }
  });
});

const nextStep = async () => {
  await navigateTo("/link");
};
</script>
