<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (2/2)
v-row
  v-col(cols="12").d-flex.justify-space-between
    SetupInfo()
    v-icon(
      size="large"
      icon="mdi-cog"
      color="grey"
      @click.stop="navigateTo('/setup')"
    )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 1)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  RadioCard(
    v-for="(radioCard) in radioCardData"
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
    v-form(ref="prospectTimingForm")
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
            prepend-icon="mdi-plus"
            variant="text"
            color="primary"
            @click.stop="addRow"
          ) 追加する

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(flat).px-8.py-6
    v-row(v-if="implementedChatToolId === ChatToolId.LINEWORKS")
      v-col(cols="12")
        p ※LINE WORKSのアプリ上から、チャンネルIDをコピーして貼り付けてください。
      v-col(cols="6")
        v-text-field(
          v-model="channel"
          label="チャンネルID"
          variant="outlined"
          density="comfortable"
          color="primary"
          hide-details
        )
    v-row(v-else)
      v-col(cols="4")
        SelectBox(
          v-model="channel"
          :items="chatToolChannels"
          label="チャンネルを選択"
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
      color="primary"
      variant="flat"
      @click.stop="showSetDaysModal = false"
    ).px-4 完了
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import { TIME_LIST } from "~/consts";
import { AskType, AskMode, ChatToolId } from "~/consts/enum";
import { getProspectConfig, updateProspectConfig } from "~/apis/config";
import type {
  SettingExpansionPanelData,
  RadioCardData,
  ConfigProspect,
  ConfigProspectTiming,
  DayToConfirmProgress,
} from "~/types/settings";
import type { SelectItem } from "~/types/common";

useHead({
  title: "機能を設定する (2/2)",
});

const { startLoading, finishLoading } = useLoading();
const { implementedChatToolId, chatToolChannels } = useInfo();
const {
  setupChatToolIconSrc,
  setCurrentStep,
} = useSetup();

const times: SelectItem<string>[] = TIME_LIST;
const timings: Ref<ConfigProspectTiming[]> = ref<ConfigProspectTiming[]>([]);

const prospectTimingForm = ref<VForm>();
const isInit: Ref<boolean> = ref<boolean>(true);
const enabled: Ref<boolean> = ref<boolean>(false);
const channel: Ref<string | null> = ref<string | null>(null);
const from: Ref<number | null> = ref<number | null>(null);
const to: Ref<number | null> = ref<number | null>(null);
const fromDaysBefore: Ref<number | null> = ref<number | null>(0);
const beginOfWeek: Ref<number | null> = ref<number | null>(1);
const timingsMessage: Ref<string | null> = ref<string | null>(null);
const frequency: Ref<number | null> = ref<number | null>(null);
const frequencyDaysBefore: Ref<number[]> = ref<number[]>([]);

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
    isDone: true, // TODO falseに戻す
  },
  {
    step: 2,
    title: "2. 進捗をヒアリングする時刻を選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
    isDone: true, // TODO falseに戻す
  },
  {
    step: 3,
    title: "3. 遅延しそうなタスクを共有するグループを選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: false,
    hasBackButton: false,
    isOpen: false,
    isDone: true, // TODO falseに戻す
  },
]);

const radioCardData: Ref<RadioCardData[]> = ref<RadioCardData[]>([
  {
    captionBeforeTitle: "着手日から期日まで",
    title: "毎日聞く",
    description: "違う場所や違う時間で働くチームの連携を円滑にできます。<br><b>朝会や日報の代わり、報連相の習慣化</b>にお使いいただけます。",
    selected: false,
    frequencyType: 1,
  },
  {
    captionBeforeTitle: "着手日と期日の",
    title: "中間日に聞く",
    description: "期日まで2週間以上の余裕があるタスクを分担する安定したチームにおすすめ。<br><b>念のために中間報告することでリスクを可視化。</b>",
    selected: false,
    frequencyType: 2,
  },
  {
    captionBeforeTitle: "期日の",
    title: "○日前に聞く",
    description: "期日直前に遅延が発覚することを防ぎます。<br><b>こまめな進捗共有も難しいほど、多忙なチームにおすすめ</b>です。",
    selected: false,
    frequencyType: 3,
  },
]);

onBeforeMount(async () => {
  startLoading();
  await setCurrentStep(3);
  finishLoading();
});

watch(enabled, async (next) => {
  await update({ enabled: next });
});
watch(channel, async (next) => {
  if (next) {
    await update({ chatToolId: implementedChatToolId.value ?? undefined, channel: next });
  }
});
watch(to, async (next) => {
  if (next) {
    await update({ to: next });
  }
});
watch(() => [from, fromDaysBefore, beginOfWeek], async () => {
  if (from.value) {
    await update({
      from: from.value,
      fromDaysBefore: fromDaysBefore.value ?? 0,
      beginOfWeek: beginOfWeek.value ?? 1,
    });
  }
}, { deep: true });
watch(() => [...timings.value], async (next) => {
  const validation = await prospectTimingForm.value?.validate();
  if (validation?.valid) {
    timingsMessage.value = null;
    await update({ timings: next });
  } else {
    const errors = validation?.errors ?? [];
    const errorMessages = [...new Set(errors.map(e => e.errorMessages.join(", ")))];
    timingsMessage.value = errorMessages.join(", ");
  }
}, { deep: true });
const update = async (config: Partial<Omit<ConfigProspect, "type">>) => {
  if (!isInit.value) {
    startLoading();
    await updateProspectConfig({ ...config, type: AskType.TODOS });
    finishLoading();
  }
};

onMounted(async () => {
  await init();
});
watch(chatToolChannels, async () => {
  await init();
}, { deep: true });
const init = async () => {
  if (chatToolChannels.value.length) {
    startLoading();
    await fetchConfig();
    isInit.value = false;
    finishLoading();
  }
};
const fetchConfig = async () => {
  const config = await getProspectConfig(AskType.TODOS);
  if (config) {
    enabled.value = config.enabled;
    channel.value = config.channel;
    from.value = config.from;
    to.value = config.to;
    fromDaysBefore.value = config.fromDaysBefore ?? 0;
    beginOfWeek.value = config.beginOfWeek ?? 1;
    frequency.value = config.frequency;
    frequencyDaysBefore.value = config.frequencyDaysBefore ?? [];
    timings.value = config.timings?.map(timing => reactive(timing)) ?? [];
  }
};

const addRow = () => {
  timings.value.push({
    time: "09:00:00",
    type: AskType.TODOS,
    mode: AskMode.BACKWARD,
  });
};
const deleteRow = (index: number) => {
  timings.value.splice(index, 1);
};
const validationNoDuplicate = (value: string) => {
  return timings.value.filter(t => t.time === value).length > 1 ? "同じ時刻を複数設定することはできません。" : true;
};

watch(frequency, async () => {
  radioCardData.value.forEach((radioCard) => {
    radioCard.selected = radioCard.frequencyType === frequency.value;
  });

  if (frequency.value !== 3) {
    frequencyDaysBefore.value = [];
  }
  if (frequency.value) {
    await update({
      frequency: frequency.value,
      frequencyDaysBefore: frequencyDaysBefore.value,
    });
  }
});
watch(() => [...frequencyDaysBefore.value], async () => {
  if (frequency.value) {
    await update({
      frequency: frequency.value,
      frequencyDaysBefore: frequencyDaysBefore.value,
    });
  }
}, { deep: true });

const selectRadioCard = (frequencyType: number) => {
  if (frequencyType === 3) {
    showSetDaysModal.value = true;
  }

  radioCardData.value.forEach((radioCard) => {
    radioCard.selected = radioCard.frequencyType === frequencyType;
  });

  frequency.value = frequencyType;
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
