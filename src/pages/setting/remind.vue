<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (1/2)
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
  v-row
    v-col(
      cols="12" sm="6"
      v-for="radioImageCard in radioImageCardData"
    )
      RadioImageCard(
        :key="radioImageCard.title"
        :data="radioImageCard"
        @click-card="selectRadioImageCard"
      )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 2)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(flat).px-8.py-6
    v-row(v-for="(timing, index) in timings" :key="timing").d-flex.align-center
      v-col(cols="4").py-0
        SettingTableSelectBox(
          v-model="timing.time"
          :items="times"
          :rules="[validationNoDuplicate]"
        )
      v-col(cols="2").px-0
        v-btn(
          flat
          prepend-icon="mdi-close"
          @click.stop="deleteRow(index)"
        ) 削除
    v-row
      v-col(cols="2").py-1
        v-btn(
          @click.stop="addRow"
          prepend-icon="mdi-plus"
          variant="text"
          color="primary"
        ) 追加する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
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
      @click="nextPage"
    ) 次の機能設定に進む

BtnModalSet(
  v-model="showUpdateColumnModal"
  title="更新する列を選んでください"
  :max-width="800"
  closable
  persistent
)
  template(#content)
    v-row
      v-col(cols="12")
        v-icon(size="small" color="orange").mr-2 mdi-information
        span.text-subtitle-2 入力規則が適用されている列のみ利用できます。現在は日付を指定することはできません。
    v-row
      v-col(cols="6")
        SelectBox(
        )
    v-row
      v-col(cols="12").py-2
        span.text-subtitle-2 選択肢：
        span.text-subtitle-2 TODO ツールチップ
  template(#actions)
    v-btn(
      @click.stop="showUpdateColumnModal = false"
      color="primary"
      variant="flat"
    ).px-4 完了
</template>

<script setup lang="ts">
import { ExternalServiceLogos, CaptureImages } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName, AskType, AskMode } from "~/consts/enum";
import type {
  SettingExpansionPanelData,
  ConfigProspect,
  ConfigProspectTiming,
  RadioImageCardData,
} from "~/types/settings";
import { DAYS_BEFORE, DAYS_OF_WEEK, TIME_LIST } from "~/consts";
import type { SelectItem } from "~/types/common";

useHead({
  title: "機能を設定する (1/2)",
});

const { startLoading, finishLoading, loading } = useLoading();
const {
  setupTodoAppIconSrc,
  setupChatToolIconSrc,
  setCurrentStep,
  setupFeatures,
} = useSetup();

const times: SelectItem<string>[] = TIME_LIST;
const timings: Ref<ConfigProspectTiming[]> = ref<ConfigProspectTiming[]>([]);
const showUpdateColumnModal: Ref<boolean> = ref<boolean>(false);

const radioImageCardData: Ref<RadioImageCardData[]> = ref<RadioImageCardData[]>([
  {
    captionBeforeTitle: "タスク管理ツールでの",
    title: "期日の再設定を促す",
    description: "遅延したタスクだけでなく、他タスクの状況も踏まえた丁寧な検討を経て、期日を再設定できます。",
    selected: false,
    imgSrc: CaptureImages.REMIND_PURPOSE_RECONFIGURE,
  },
  {
    captionBeforeTitle: "チャットツールで",
    title: "データの更新を促す",
    description: "タスク管理ツールにアクせずせずとも、かんたんで素早く遅延のネクストアクションを実行できます。",
    selected: false,
    imgSrc: CaptureImages.REMIND_PURPOSE_UPDATE,
  },
]);

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: "1. リマインドする目的を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: false,
    isOpen: true,
  },
  {
    step: 2,
    title: "2. リマインドする時刻を設定する",
    description: "期日を過ぎた翌日の何時にリマインドするかを選んでください。",
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
  },
  {
    step: 3,
    title: "3. 遅延タスクを共有するグループを選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: false,
    hasBackButton: false,
    isOpen: false,
  },
]);

onBeforeMount(() => {
  setCurrentStep(3);
  addRow();
});

const selectRadioImageCard = (title: string) => {
  if (title === "データの更新を促す") {
    showUpdateColumnModal.value = true;
  }

  radioImageCardData.value.forEach((radioImageCard) => {
    radioImageCard.selected = radioImageCard.title === title;
  });
};

const addRow = () => {
  timings.value.push({
    time: "09:00:00",
    type: AskType.PROJECTS,
    mode: AskMode.UNDEFINED,
  });
};

const deleteRow = (index: number) => {
  timings.value.splice(index, 1);
};

const validationNoDuplicate = (value: string) => {
  return timings.value.filter(t => t.time === value).length > 1 ? "同じ時刻を複数設定することはできません。" : false;
};

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
  await navigateTo("/setting/prospect");
};

</script>
