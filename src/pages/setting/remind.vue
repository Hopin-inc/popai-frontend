<template lang="pug">
v-row
  v-col(cols="12")
    h2 機能を設定する (1/2)
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
  v-row
    v-col().pb-0
      p ※チャットツールでデータの更新を促す機能は今後対応予定です。
  v-row
    v-col(
      v-for="radioImageCard in radioImageCardData"
      :key="radioImageCard.title"
      cols="12"
      sm="6"
    )
      RadioImageCard(
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
      color="primary"
      variant="flat"
      @click.stop="showUpdateColumnModal = false"
    ).px-4 完了
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import { CaptureImages } from "~/consts/images";
import { AskType, ChatToolId } from "~/consts/enum";
import { TIME_LIST } from "~/consts";
import { SetupFeatureId } from "~/consts/setup";
import { getRemindConfig, updateRemindConfig } from "~/apis/config";
import type {
  SettingExpansionPanelData,
  ConfigProspect,
  ConfigProspectTiming,
  RadioImageCardData,
} from "~/types/settings";
import type { SelectItem } from "~/types/common";

useHead({
  title: "機能を設定する (1/2)",
});

const { startLoading, finishLoading } = useLoading();
const { implementedChatToolId, chatToolChannels } = useInfo();
const {
  setupChatToolIconSrc,
  setCurrentStep,
  setupFeatures,
} = useSetup();

const times: SelectItem<string>[] = TIME_LIST;
const timings: Ref<ConfigProspectTiming[]> = ref<ConfigProspectTiming[]>([]);
const showUpdateColumnModal: Ref<boolean> = ref<boolean>(false);

const prospectTimingForm = ref<VForm>();
const isInit: Ref<boolean> = ref<boolean>(false); // TODO trueに戻す
const enabled: Ref<boolean> = ref<boolean>(false);
const channel: Ref<string | null> = ref<string | null>(null);
const from: Ref<number | null> = ref<number | null>(null);
const to: Ref<number | null> = ref<number | null>(null);
const fromDaysBefore: Ref<number | null> = ref<number | null>(0);
const beginOfWeek: Ref<number | null> = ref<number | null>(1);
const timingsMessage: Ref<string | null> = ref<string | null>(null);

const radioImageCardData: Ref<RadioImageCardData[]> = ref<RadioImageCardData[]>([
  {
    captionBeforeTitle: "タスク管理ツールでの",
    title: "期日の再設定を促す",
    description: "遅延したタスクだけでなく、他タスクの状況も踏まえた丁寧な検討を経て、期日を再設定できます。",
    selected: true,
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
    isDone: true, // TODO falseに戻す
  },
  {
    step: 2,
    title: "2. リマインドする時刻を設定する",
    description: "期日を過ぎた翌日の何時にリマインドするかを選んでください。",
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
    isDone: true, // TODO falseに戻す
  },
  {
    step: 3,
    title: "3. 遅延タスクを共有するグループを選ぶ",
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: false,
    hasBackButton: false,
    isOpen: false,
    isDone: true, // TODO falseに戻す
  },
]);

onBeforeMount(async () => {
  startLoading();
  await setCurrentStep(3);
  finishLoading();
});

const selectRadioImageCard = (title: string) => {
  if (title === "データの更新を促す") {
    showUpdateColumnModal.value = true;
  }

  radioImageCardData.value.forEach((radioImageCard) => {
    radioImageCard.selected = radioImageCard.title === title;
  });
};

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
    await updateRemindConfig({ ...config, type: AskType.TODOS });
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
  const config = await getRemindConfig(AskType.TODOS);
  if (config) {
    enabled.value = config.enabled;
    channel.value = config.channel;
    from.value = config.from;
    to.value = config.to;
    fromDaysBefore.value = config.fromDaysBefore ?? 0;
    beginOfWeek.value = config.beginOfWeek ?? 1;
    timings.value = config.timings?.map(timing => reactive(timing)) ?? [];
  }
};

const addRow = () => {
  timings.value.push({
    time: "09:00:00",
    type: AskType.TODOS,
  });
};
const deleteRow = (index: number) => {
  timings.value.splice(index, 1);
};
const validationNoDuplicate = (value: string) => {
  return timings.value.filter(t => t.time === value).length > 1 ? "同じ時刻を複数設定することはできません。" : true;
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
  if (setupFeatures.value.includes(SetupFeatureId.PROSPECT)) {
    await navigateTo("/setting/prospect");
  } else {
    await navigateTo("/completion");
  }
};

</script>
