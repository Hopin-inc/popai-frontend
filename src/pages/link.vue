<template lang="pug">
CommonPage(title="ツール連携")
  v-row
    v-col(cols="12").d-flex.align-center
      .me-auto
        h2.font-weight-bold チャットツール
        p 連携したチャットツール上で、メンバーや全体への通知メッセージを送信します。
      v-btn(
        v-if="implementedChatToolId"
        @click.stop=""
        :prepend-icon="'mdi-close'"
        color="error"
        variant="outlined"
        flat
      ) 連携を解除する
    v-col(v-for="info in chatToolCardInfos" cols="12", lg="6")
      LinkToolCard(
        :title="info.title"
        :description="info.description"
        :icon-src="info.iconSrc"
        :setup-status="info.setupStatus"
        @click-setup="onClickSetup"
      )
  v-row
    v-col(cols="12").d-flex.align-center
      .me-auto
        h2.font-weight-bold タスク管理ツール
        p 連携したタスク管理ツールから、自動でタスクの情報を取得します。
      v-btn(
        v-if="implementedTodoAppId"
        @click.stop=""
        :prepend-icon="'mdi-close'"
        color="error"
        variant="outlined"
        flat
      ) 連携を解除する
    v-col(v-for="info in todoAppCardInfos" cols="12", lg="6")
      LinkToolCard(
        :title="info.title"
        :description="info.description"
        :icon-src="info.iconSrc"
        :setup-status="info.setupStatus"
        @click-setup="onClickSetup"
      )

SetUpBacklogModal(
  v-model="backlogSetupModal"
)
SetUpLineworksModal(
  v-model="lineworksSetupModal"
  @completed="inputBotSecretModal = true;"
)
InputBotSecretModal(
  v-model="inputBotSecretModal"
)
</template>

<script setup lang="ts">
import {
  ProjectRule,
  PropertyUsageType,
  TodoAppId,
  TodoAppName,
  ChatToolId,
  ChatToolName,
} from "~/consts/enum";
import { ExternalServiceLogos } from "~/consts/images";
import type { ToolCardInfo } from "~/types/settings";

useHead({
  title: "ツール連携",
});

const {
  implementedTodoAppId,
  implementedChatToolId,
} = useInfo();
const config = useRuntimeConfig();

const backlogSetupModal: Ref<boolean> = ref<boolean>(false);
const lineworksSetupModal: Ref<boolean> = ref<boolean>(false);
const inputBotSecretModal: Ref<boolean> = ref<boolean>(false);
const chatToolCardInfos = reactive<ToolCardInfo[]>([
  {
    id: ChatToolId.SLACK,
    title: ChatToolName[ChatToolId.SLACK],
    iconSrc: ExternalServiceLogos.SLACK,
    description: "<span>連携手順については、</span><a href='http://google.com'>こちら</a><span>をご覧下さい。</span>",
    setupStatus: "disabled",
  },
  {
    id: ChatToolId.LINEWORKS,
    title: ChatToolName[ChatToolId.LINEWORKS],
    iconSrc: ExternalServiceLogos.LINEWORKS,
    description: "<span>連携手順については、</span><a href='http://google.com'>こちら</a><span>をご覧下さい。</span><br><span>※現在は「リマインド」機能にのみ対応しています。</span>",
    setupStatus: "disabled",
  },
]);
const todoAppCardInfos = reactive<ToolCardInfo[]>([
  {
    id: TodoAppId.NOTION,
    title: TodoAppName[TodoAppId.NOTION],
    iconSrc: ExternalServiceLogos.NOTION,
    description: "<span>連携手順については、</span><a href='http://google.com'>こちら</a><span>をご覧下さい。</span>",
    setupStatus: "disabled",
  },
  {
    id: TodoAppId.BACKLOG,
    title: TodoAppName[TodoAppId.BACKLOG],
    iconSrc: ExternalServiceLogos.BACKLOG,
    description: "<span>連携手順については、</span><a href='http://google.com'>こちら</a><span>をご覧下さい。</span>",
    setupStatus: "disabled",
  },
  {
    id: TodoAppId.SPREADSHEET,
    title: TodoAppName[TodoAppId.SPREADSHEET],
    iconSrc: ExternalServiceLogos.SPREADSHEET,
    description: "<span>連携手順については、</span><a href='http://google.com'>こちら</a><span>をご覧下さい。</span>",
    setupStatus: "disabled",
  },
]);

onMounted(async () => {
  await updateSetUpStatus("chatTool", chatToolCardInfos);
  await updateSetUpStatus("todoApp", todoAppCardInfos);
});
watch(implementedChatToolId, async () => {
  await updateSetUpStatus("chatTool", chatToolCardInfos);
});
watch(implementedTodoAppId, async () => {
  await updateSetUpStatus("todoApp", todoAppCardInfos);
});

// ツールの種類(チャットツール|TODOアプリ)とその表示情報を引数に、表示させるべきカードの状態を返す
const updateSetUpStatus = (toolType: "chatTool" | "todoApp", cards: ToolCardInfo[]) => {
  const implementedToolId = toolType === "chatTool" ? implementedChatToolId.value : implementedTodoAppId.value;
  cards.forEach((card) => {
    if (!implementedToolId) {
      card.setupStatus = "notSetup";
      return;
    }
    if (card.id === implementedToolId) {
      card.setupStatus = "alreadySetup";
    } else {
      card.setupStatus = "disabled";
    }
  });
};

const onClickSetup = (toolName: string) => {
  switch (toolName) {
    case ChatToolName[ChatToolId.SLACK]:
      window.location.href = "https://google.com";
      break;
    case ChatToolName[ChatToolId.LINEWORKS]:
      lineworksSetupModal.value = true;
      break;
    case TodoAppName[TodoAppId.NOTION]:
      window.location.href = `${ config.public.apiBaseUrl }/notion/install`;
      break;
    case TodoAppName[TodoAppId.BACKLOG]:
      backlogSetupModal.value = true;
      break;
    case TodoAppName[TodoAppId.SPREADSHEET]:
      break;
  }
};
</script>

<style scoped lang="sass">
</style>
