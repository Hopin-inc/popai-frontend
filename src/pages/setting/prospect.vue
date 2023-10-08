<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (2/2)
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
  RadioCard(
    v-for="(radioCard, index) in radioCardData"
    :key="radioCard.title"
    :data="radioCard"
    :days="daysToConfirmProgress"
    @click-card="selectRadioCard"
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

v-row.my-1.ml-9
  v-col(cols="12")
    v-btn(
      color="primary"
      @click="nextPage"
    ) 利用を開始する

BtnModalSet(
  v-model="showSetDaysModal"
  title="進捗を聞く日を選んでください"
  :max-width="560"
  closable
  persistent
)
  template(#content)
    v-row
      v-col(cols="12")
        v-icon(size="small").mr-2 mdi-information
        span.text-subtitle-2 通知日が土日祝の場合は、その直前の平日に進捗を聞きます。
    v-row
      v-col(cols="12").py-2
        template(v-for="day in daysToConfirmProgress" :key="day.day")
          v-chip(
            :variant="!day.selected ? 'outlined' : 'elevated'"
            color="primary"
            @click.stop="setDayToConfirm(day.day)"
          ).mr-2 {{ day.day }}
  template(#actions)
    v-btn(
      @click.stop="showSetDaysModal = false"
      color="primary"
      variant="flat"
    ).px-4 完了
</template>

<script setup lang="ts">
import { ExternalServiceLogos } from "~/consts/images";
import { ChatToolId, TodoAppId, ChatToolName, TodoAppName, AskType, AskMode } from "~/consts/enum";
import type {
  SettingExpansionPanelData,
  RadioCardData,
  ConfigProspect,
  ConfigProspectTiming,
  DayToConfirmProgress,
} from "~/types/settings";
import { DAYS_BEFORE, DAYS_OF_WEEK, TIME_LIST } from "~/consts";
import type { SelectItem } from "~/types/common";

useHead({
  title: "機能を設定する (2/2)",
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

const showSetDaysModal: Ref<boolean> = ref<boolean>(false);
const daysToConfirmProgress: Ref<DayToConfirmProgress[]> = ref<DayToConfirmProgress[]>([
  {
    day: "当日",
    selected: false,
  },
  {
    day: "2日前",
    selected: false,
  },
  {
    day: "3日前",
    selected: false,
  },
  {
    day: "4日前",
    selected: false,
  },
  {
    day: "5日前",
    selected: false,
  },
]);

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: "1. 進捗をヒアリングする条件を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: false,
    isOpen: true,
  },
  {
    step: 2,
    title: "2. 進捗をヒアリングする時刻を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
  },
  {
    step: 3,
    title: "3. 遅延しそうなタスクを共有するグループを選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: false,
    hasBackButton: false,
    isOpen: false,
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

const deleteRow = (index: number) => {
  timings.value.splice(index, 1);
};

const validationNoDuplicate = (value: string) => {
  return timings.value.filter(t => t.time === value).length > 1 ? "同じ時刻を複数設定することはできません。" : false;
};

const selectRadioCard = (title: string) => {
  if (title === "○日前に聞く") {
    showSetDaysModal.value = true;
  }

  radioCardData.value.forEach((radioCard) => {
    radioCard.selected = radioCard.title === title;
  });
};

const setDayToConfirm = (day: string) => {
  const selectedItem = daysToConfirmProgress.value.find(
    (d) => { return d.day === day; },
  );
  if (selectedItem) {
    selectedItem.selected = !selectedItem.selected;
  }
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
  await navigateTo("/completion");
};

</script>
