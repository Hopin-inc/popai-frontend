<template lang="pug">
v-row
  v-col(cols="12")
    h2 お使いのツールとPOPAIを連携する
v-row
  v-col(cols="12").d-flex.justify-space-between
    SetupInfo(
      :todoAppIconSrc="setupTodoAppIconSrc"
      :chatToolIconSrc="setupChatToolIconSrc"
      :features="setupFeatures"
    )
    v-icon(
      size="large"
      icon="mdi-cog"
      color="grey"
      @click.stop='navigateTo("/setup");'
    )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 1)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(flat).px-8.py-6
    v-btn(
      color="primary"
      variant="outlined"
    ) 連携する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 2)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(flat).px-8.py-6
    v-row
      v-col(cols="6")
        SelectBox(
        )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(
    v-if="setupTodoAppName === TodoAppName[TodoAppId.SPREADSHEET]"
    flat
  ).px-8.py-6
    h4.mb-2 基本情報
    v-row
      v-col(cols="12" sm="6" md="4")
        FormPart(title="タスク名" required)
          SelectBox(
          )
      v-col(cols="12" sm="6" md="4")
        FormPart(title="担当者" required)
          SelectBox(
          )
      v-col(cols="12" sm="6" md="4")
        FormPart(title="期日" required)
          SelectBox(
          )
    h4.mb-2.mt-8 進捗情報
    v-row
      v-col(cols="12")
        FormPart(title="完了を示す列と条件" required)
          .d-flex.align-center.flex-wrap
            SelectBox(
            )
            span.mx-2 に
            SelectBox(
            )
    v-row
      v-col(cols="12")
        FormPart(title="保留を示す列と条件")
          .d-flex.align-center.flex-wrap
            SelectBox(
            )
            span.mx-2 に
            SelectBox(
            )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 4)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(flat).px-8.py-6
    v-btn(
      color="primary"
      variant="outlined"
    ) 連携する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 5)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(flat).px-8.py-6
    v-row
      v-col(cols="12").d-flex.justify-space-between
        .d-flex.align-center
          v-icon(size="small").mr-2 mdi-information
          span.mr-2.text-caption 同じメールアドレスのアカウントを自動で紐付けています
        v-btn(
          color="primary"
          variant="outlined"
          prepend-icon="mdi-plus"
        ) 追加する
    v-row
      v-col(cols="5").d-flex.align-center.pb-0
        img(:src="setupChatToolIconSrc" width="32").mr-2
        span.mr-2 {{ setupChatToolName }}
      v-col(cols="5").d-flex.align-center.pb-0
        img(:src="setupTodoAppIconSrc" width="32").mr-2
        span.mr-2 {{ setupTodoAppName }}
    v-row.d-flex.align-center
      v-col(cols="5")
        SelectBox(
        )
      v-col(cols="5")
        SelectBox(
        )
      v-col(cols="2").px-0
        v-btn(
          flat
          prepend-icon="mdi-close"
        ) 削除

v-row.my-1.ml-10
  v-col(cols="12")
    v-btn(
      color="primary"
      @click="nextPage"
    ) 機能設定に進む
</template>

<script setup lang="ts">
import { ExternalServiceLogos } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName } from "~/consts/enum";
import type { SettingExpansionPanelData } from "~/types/settings";

useHead({
  title: "ツールを連携する",
});
const { startLoading, finishLoading, loading } = useLoading();
const {
  setupTodoAppName,
  setupTodoAppIconSrc,
  setupChatToolName,
  setupChatToolIconSrc,
  setCurrentStep,
  setupFeatures,
} = useSetup();

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: `1. ${ setupTodoAppName.value }とPOPAIを連携する`,
    description: "簡潔な概要", // TODO
    iconSrc: setupTodoAppIconSrc.value,
    hasNextButton: true,
    hasBackButton: false,
    isOpen: true,
  },
  {
    step: 2,
    title: "2. シートを選ぶ",
    description: "タスク情報を取得するシートを1つ選択してください。",
    iconSrc: setupTodoAppIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
  },
  {
    step: 3,
    title: "3. 列と条件を選ぶ",
    description: `タスク情報を取得するために、${ setupTodoAppName.value }の列と条件を選んでください。`,
    iconSrc: setupTodoAppIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
  },
  {
    step: 4,
    title: `4. ${ setupChatToolName.value }とPOPAIを連携する`,
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
  },
  {
    step: 5,
    title: "5. 社員ごとにアカウントを紐付ける",
    description: "ダイレクトメッセージを送信するために、タスクの担当者とチャットツールのアカウントを紐付けてください。",
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: false,
    hasBackButton: false,
    isOpen: false,
  },
]);

onBeforeMount(() => {
  setCurrentStep(2);
});

const nextStep = (step: number) => {
  const currentPanel = settingExpansionPanelData.value.find(panel => panel.step === step);
  if (currentPanel) { currentPanel.isOpen = false; }
  const nextPanel = settingExpansionPanelData.value.find(panel => panel.step === step + 1);
  if (nextPanel) { nextPanel.isOpen = true; }
};

const prevStep = (step: number) => {
  const currentPanel = settingExpansionPanelData.value.find(panel => panel.step === step);
  if (currentPanel) { currentPanel.isOpen = false; }
  const prevPanel = settingExpansionPanelData.value.find(panel => panel.step === step - 1);
  if (prevPanel) { prevPanel.isOpen = true; }
};

const togglePanel = (step: number) => {
  const currentPanel = settingExpansionPanelData.value.find(panel => panel.step === step);
  if (currentPanel) { currentPanel.isOpen = !currentPanel.isOpen; }
};

const nextPage = async () => {
  await navigateTo("/setting/remind");
};
</script>
