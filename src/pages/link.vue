<template lang="pug">
v-row
  v-col(cols="12")
    h2 お使いのツールとPOPAIを連携する
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
    v-btn(
      color="primary"
      variant="outlined"
    ) 連携する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 2)"
)
  v-card(flat).px-8.py-6
    v-row
      v-col(cols="6")
        SelectBox(
        )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
)
  v-card(
    v-if="todoAppName === TodoAppName[TodoAppId.SPREADSHEET]"
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
)
  v-card(flat).px-8.py-6
    v-btn(
      color="primary"
      variant="outlined"
    ) 連携する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 5)"
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
        img(:src="chatToolIconSrc" width="32").mr-2
        span.mr-2 {{ chatToolName }}
      v-col(cols="5").d-flex.align-center.pb-0
        img(:src="todoAppIconSrc" width="32").mr-2
        span.mr-2 {{ todoAppName }}
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
      @click="nextStep"
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
  setCurrentStep,
  setupFeatures,
} = useSetup();

// TODO 前の画面から持ってくるようにする(composables?)
const todoAppName = TodoAppName[TodoAppId.SPREADSHEET];
const chatToolName = ChatToolName[ChatToolId.LINEWORKS];
const todoAppIconSrc = ExternalServiceLogos.SPREADSHEET;
const chatToolIconSrc = ExternalServiceLogos.LINEWORKS;
const features = setupFeatures.value;

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: "1. Google SpreadsheetとPOPAIを連携する",
    description: "簡潔な概要", // TODO
    iconSrc: todoAppIconSrc,
    hasNextButton: true,
    hasBackButton: false,
  },
  {
    step: 2,
    title: "2. シートを選ぶ",
    description: "タスク情報を取得するシートを1つ選択してください。",
    iconSrc: todoAppIconSrc,
    hasNextButton: true,
    hasBackButton: true,
  },
  {
    step: 3,
    title: "3. 列と条件を選ぶ",
    description: "タスク情報を取得するために、Google Spreadsheetの列と条件を選んでください。",
    iconSrc: todoAppIconSrc,
    hasNextButton: true,
    hasBackButton: true,
  },
  {
    step: 4,
    title: "4. LINE WORKSとPOPAIを連携する",
    description: "簡潔な概要", // TODO
    iconSrc: chatToolIconSrc,
    hasNextButton: true,
    hasBackButton: true,
  },
  {
    step: 5,
    title: "5. 社員ごとにアカウントを紐付ける",
    description: "ダイレクトメッセージを送信するために、タスクの担当者とチャットツールのアカウントを紐付けてください。",
    iconSrc: chatToolIconSrc,
    hasNextButton: false,
    hasBackButton: false,
  },
]);

onBeforeMount(() => {
  setCurrentStep(2);
});

const nextStep = async () => {
  await navigateTo("/setting/remind");
};
</script>
