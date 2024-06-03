<template lang="pug">
v-row
  v-col(cols="12")
    SetupTitle(
      title="1. タスク管理ツールを選ぶ",
      description="タスクの情報を自動で取得します。\n※Google Spreadsheetは今後対応予定です。",
    )
v-row
  template(v-for="todoApp in todoApps" :key="todoApp.toolName")
    LinkToolBtn(
      :data="todoApp"
      @click-card="onClickToolCard"
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
      @click-card="onClickToolCard"
    ).mr-4
v-row.mt-10
  v-col(cols="12")
    SetupTitle(
      title="3. Angelに依頼したいことを選ぶ",
      description="チームの自律性を育むために、Angelでは2種類のメッセージを送ることができます。使用するものを選択してください。",
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
    @click="nextPage"
  ) ツール連携に進む
</template>

<script setup lang="ts">
import { ExternalServiceLogos, CaptureImages } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName } from "~/consts/enum";
import { SetupFeatureId } from "~/consts/setup";
import type { LinkToolBtnData } from "~/types/settings";
import type { FeatureCheckBoxData, ISetupFeatureId } from "~/types/setup";
definePageMeta({
  layout: "setup",
});
useHead({
  title: "機能を選ぶ",
});
const { startLoading, finishLoading } = useLoading();
const {
  setCurrentStep,
  setupTodoAppId,
  setSetupTodoAppId,
  setupChatToolId,
  setSetupChatToolId,
  setupFeatures,
  addSetupFeature,
  deleteSetupFeature,
} = useSetup();

const todoApps: Ref<LinkToolBtnData[]> = ref<LinkToolBtnData[]>([
  {
    id: TodoAppId.NOTION,
    toolName: TodoAppName[TodoAppId.NOTION],
    selected: false,
    iconSrc: ExternalServiceLogos.NOTION,
  },
  {
    id: TodoAppId.BACKLOG,
    toolName: TodoAppName[TodoAppId.BACKLOG],
    selected: false,
    iconSrc: ExternalServiceLogos.BACKLOG,
  },
  {
    id: TodoAppId.SPREADSHEET,
    toolName: TodoAppName[TodoAppId.SPREADSHEET],
    selected: false,
    iconSrc: ExternalServiceLogos.SPREADSHEET,
  },
]);
const chatTools: Ref<LinkToolBtnData[]> = ref<LinkToolBtnData[]>([
  {
    id: ChatToolId.SLACK,
    toolName: ChatToolName[ChatToolId.SLACK],
    selected: false,
    iconSrc: ExternalServiceLogos.SLACK,
  },
  {
    id: ChatToolId.LINEWORKS,
    toolName: ChatToolName[ChatToolId.LINEWORKS],
    selected: false,
    iconSrc: ExternalServiceLogos.LINEWORKS,
  },
]);

const features: Ref<FeatureCheckBoxData[]> = ref<FeatureCheckBoxData[]>([
  {
    title: "遅延したタスクにリマインド",
    description: "期日を過ぎても完了していないタスクを\nAngelがやさしくリマインド。",
    checked: false,
    imgSrc: CaptureImages.FEATURE_REMIND,
    feature: SetupFeatureId.REMIND,
  },
  {
    title: "遅延しそうなタスクをシェア",
    description: "社員は簡単な質問に答えるだけ。\nAngelが聞いてきた進捗を紹介します！",
    checked: false,
    imgSrc: CaptureImages.FEATURE_SHARE,
    feature: SetupFeatureId.PROSPECT,
  },
]);

const onClickFeatureCard = async (feature: ISetupFeatureId) => {
  startLoading();
  for (const f of features.value) {
    if (f.feature === feature) {
      f.checked = !f.checked;
      if (f.checked) {
        await addSetupFeature(feature);
      } else {
        await deleteSetupFeature(feature);
      }
    }
  }
  finishLoading();
};

const onClickToolCard = async (id: number, toolName: string) => {
  switch (toolName) {
    case TodoAppName[TodoAppId.SPREADSHEET]:
    case TodoAppName[TodoAppId.NOTION]:
    case TodoAppName[TodoAppId.BACKLOG]:
      updateLinkToolBtnState(todoApps.value, toolName);
      startLoading();
      await setSetupTodoAppId(id);
      finishLoading();
      break;
    case ChatToolName[ChatToolId.SLACK]:
    case ChatToolName[ChatToolId.LINEWORKS]:
      updateLinkToolBtnState(chatTools.value, toolName);
      startLoading();
      await setSetupChatToolId(id);
      finishLoading();
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

onMounted(async () => {
  startLoading();
  await setCurrentStep(1);
  finishLoading();
});

watchEffect(() => {
  const todo = todoApps.value.find(t => t.id === setupTodoAppId.value);
  if (todo) { todo.selected = true; }
  const chat = chatTools.value.find(t => t.id === setupChatToolId.value);
  if (chat) { chat.selected = true; }

  features.value.forEach((feature) => {
    if (setupFeatures.value.find(f => f === feature.feature)) {
      feature.checked = true;
    } else {
      feature.checked = false;
    }
  });
});

const nextPage = async () => {
  await navigateTo("/link");
};
</script>
