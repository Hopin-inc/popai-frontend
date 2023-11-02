<template lang="pug">
v-row
  v-col(cols="12")
    h2 お使いのツールとPOPAIを連携する
v-row
  v-col(cols="12").d-flex.justify-space-between
    SetupInfo()
    v-icon(
      size="large"
      icon="mdi-cog"
      color="grey"
      @click.stop="navigateTo('/setup');"
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
      :disabled="implementedTodoAppId !== null"
      @click.stop="installTodoApp"
    ) {{ implementedTodoAppId ? "連携済み" : "連携する" }}

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
          v-model="boardId"
          :items="todoAppBoards"
        )

SettingExpansionPanel(
  :data="settingExpansionPanelData.find((data) => data.step === 3)"
  @click-next="nextStep"
  @click-prev="prevStep"
  @click-toggle-panel="togglePanel"
)
  v-card(
    v-if="setupTodoAppId === TodoAppId.SPREADSHEET"
    flat
  ).px-8.py-6
    h4.mb-2 基本情報
    v-row
      v-col(cols="12" sm="6" md="4")
        FormPart(title="タスク名" required)
          SelectBox(
            v-model="name.property"
            :items="propertiesForName"
          )
      v-col(cols="12" sm="6" md="4")
        FormPart(title="担当者" required)
          SelectBox(
            v-model="assignee.property"
            :items="propertiesForPeople"
          )
      v-col(cols="12" sm="6" md="4")
        FormPart(title="期日" required)
          SelectBox(
            v-model="deadline.property"
            :items="propertiesForDate"
          )
    h4.mb-2.mt-8 進捗情報
    v-row
      v-col(cols="12")
        FormPart(title="完了を示す列と条件" required)
          .d-flex.align-center.flex-wrap
            SelectBox(
              v-model="isDone.property"
              :items="propertiesForStatus"
            )
            span.mx-2 に
            SelectBox(
              v-model="isDone.options"
              :items="isDone.availableOptions"
            )
    v-row
      v-col(cols="12")
        FormPart(title="保留を示す列と条件")
          .d-flex.align-center.flex-wrap
            SelectBox(
              v-model="isClosed.property"
              :items="propertiesForStatus"
            )
            span.mx-2 に
            SelectBox(
              v-model="isClosed.options"
              :items="isClosed.availableOptions"
            )
  v-card(
    v-if="setupTodoAppId === TodoAppId.NOTION"
    flat
  ).px-8.py-6
    h4.mb-2 基本情報
    v-row
      v-col(cols="12" sm="6" md="4")
        FormPart(title="タスク名" required)
          SelectBox(
            v-model="name.property"
            :items="propertiesForName"
          )
      v-col(cols="12" sm="6" md="4")
        FormPart(title="担当者" required)
          SelectBox(
            v-model="assignee.property"
            :items="propertiesForPeople"
          )
      v-col(cols="12" sm="6" md="4")
        FormPart(title="期日" required)
          SelectBox(
            v-model="deadline.property"
            :items="propertiesForDate"
          )
    h4.mb-2.mt-8 進捗情報
    v-row
      v-col(cols="12")
        FormPart(title="完了を示す列と条件" required)
          .d-flex.align-center.flex-wrap
            SelectBox(
              v-model="isDone.property"
              :items="propertiesForStatus"
            )
            span.mx-2 が
            MultipleSelectBox(
              v-model="isDone.options"
              :items="isDone.availableOptions"
            )
            span.mx-2 のいずれか
    v-row
      v-col(cols="12")
        FormPart(title="保留を示す列と条件")
          .d-flex.align-center.flex-wrap
            SelectBox(
              v-model="isClosed.property"
              :items="propertiesForStatus"
            )
            span.mx-2 が
            MultipleSelectBox(
              v-model="isClosed.options"
              :items="isClosed.availableOptions"
            )
            span.mx-2 のいずれか
    h4.mb-2.mt-8 関連情報
    v-row
      v-col(cols="4")
        FormPart(title="親タスク")
          .d-flex.align-center.flex-wrap
            SelectBox(
              v-model="parent.property"
              :items="propertiesForRelation"
            )
  v-card(
    v-if="setupTodoAppId === TodoAppId.BACKLOG"
    flat
  ).px-8.py-6
    v-row
      v-col(cols="12" sm="6")
        FormPart(title="完了を示す状態" required)
          SelectBox(
            v-model="isDone.options"
            :items="isDone.availableOptions"
          )
      v-col(cols="12" sm="6")
        FormPart(title="保留を示す状態")
          SelectBox(
            v-model="isClosed.options"
            :items="isClosed.availableOptions"
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
      @click.stop="installChatTool"
    ) {{ implementedChatToolId ? "連携済み" : "連携する" }}

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
    v-row.mb-2
      v-col(cols="5").d-flex.align-center.pb-0
        img(:src="setupChatToolIconSrc" width="32").mr-2
        span.mr-2 {{ setupChatToolName }}
      v-col(cols="5").d-flex.align-center.pb-0
        img(:src="setupTodoAppIconSrc" width="32").mr-2
        span.mr-2 {{ setupTodoAppName }}
    v-row(
      v-for="(memberConfig, index) in memberConfigs"
:key="memberConfig"
    ).d-flex.align-center
      v-col(cols="5").py-0
        SelectBox(
          v-model="memberConfig.chatToolUserId"
          :items="chatToolAccounts"
        )
      v-col(cols="5").py-0
        SelectBox(
          v-model="memberConfig.todoAppUserId"
          :items="todoAppAccounts"
        )
      v-col(cols="2").px-0
        v-btn(
          flat
          prepend-icon="mdi-close"
          @click.stop="deleteRow(index)"
        ) 削除
    v-row
      v-col.py-1
        v-btn(
          color="primary"
          variant="text"
          prepend-icon="mdi-plus"
          @click.stop="addRow"
        ) 追加する

v-row.my-1.ml-10
  v-col(cols="12")
    v-btn(
      color="primary"
      :disabled="!canGoToNextPage"
      @click="nextPage"
    ) 機能設定に進む

SetUpBacklogModal(
  v-model="showBacklogModal"
)
SetUpLineworksModal(
  v-model="showLineworksModal"
  @installed="showBotSecretModal = true;"
)
InputBotSecretModal(
  v-model="showBotSecretModal"
)
</template>

<script setup lang="ts">
import {
  NOTION_PROPERTY_TYPES_WITH_LABELS,
  NOTION_PROPERTY_TYPES_FOR_NAME,
  NOTION_PROPERTY_TYPES_FOR_DATE,
  NOTION_PROPERTY_TYPES_FOR_PEOPLE,
  NOTION_PROPERTY_TYPES_FOR_STATUS,
  NOTION_PROPERTY_TYPES_WITH_CHECKBOX,
  NOTION_PROPERTY_TYPES_FOR_RELATION,
} from "~/consts";
import {
  ChatToolId,
  TodoAppId,
  PropertyUsageType,
} from "~/consts/enum";
import { SetupFeatureId } from "~/consts/setup";
import {
  getBoardConfig,
  getTodoAppProperties,
  getTodoAppPropertyUsages,
  updateBoardConfig,
  updateTodoAppPropertyUsage,
  updateTodoAppUser,
  fetchDataForBoard,
} from "~/apis/todo-app";
import {
  deleteUser,
  getUserConfigs,
  getUserReportingLines,
  updateUser,
  updateUserReportingLines,
} from "~/apis/users";
import { updateChatToolUsers } from "~/apis/chat-tool";
import type {
  SettingExpansionPanelData,
  Property,
  PropertyConfig,
  PropertyUsage,
  MemberConfig,
  ReportingLine,
} from "~/types/settings";

useHead({
  title: "ツールを連携する",
});
const { startLoading, finishLoading } = useLoading();
const {
  implementedTodoAppId,
  implementedChatToolId,
  todoAppBoards,
  todoAppAccounts,
  chatToolAccounts,
  fetchConfigStatus,
} = useInfo();
const {
  setupTodoAppId,
  setupTodoAppName,
  setupTodoAppIconSrc,
  setupChatToolId,
  setupChatToolName,
  setupChatToolIconSrc,
  setCurrentStep,
  setupFeatures,
} = useSetup();
const runtimeConfig = useRuntimeConfig();

const showBacklogModal: Ref<boolean> = ref<boolean>(false);
const showLineworksModal: Ref<boolean> = ref<boolean>(false);
const showBotSecretModal: Ref<boolean> = ref<boolean>(false);
const boardId: Ref<string | null> = ref<string | null>(null);

const memberConfigs: Ref<MemberConfig[]> = ref<MemberConfig[]>([]);
const reportingLines: Ref<ReportingLine[]> = ref<ReportingLine[]>([]);

const isInit: Ref<boolean> = ref<boolean>(true);
let isUpdating: boolean = false;
const properties: Ref<Property[]> = ref<Property[]>([]);
const propInitVal: PropertyConfig = { id: null, property: null, requireOptions: false, requireCheckbox: false };
const name: Ref<PropertyConfig> = ref<PropertyConfig>({ ...propInitVal });
const assignee: Ref<PropertyConfig> = ref<PropertyConfig>({ ...propInitVal });
const deadline: Ref<PropertyConfig> = ref<PropertyConfig>({ ...propInitVal });
const parent: Ref<PropertyConfig> = ref<PropertyConfig>({ ...propInitVal });
const isDone: Ref<PropertyConfig> = ref<PropertyConfig>({
  ...propInitVal,
  requireOptions: true,
  options: [],
  get availableOptions () {
    switch (implementedTodoAppId.value) {
      case TodoAppId.NOTION:
        return properties.value.find(p => p.id === this.property)?.availableOptions ?? [];
      case TodoAppId.BACKLOG:
        return properties.value.length ? (properties.value[0].availableOptions ?? []) : [];
      default:
        return [];
    }
  },
});
const isClosed: Ref<PropertyConfig> = ref<PropertyConfig>({
  ...propInitVal,
  requireOptions: true,
  options: [],
  get availableOptions () {
    switch (implementedTodoAppId.value) {
      case TodoAppId.NOTION:
        return properties.value.find(p => p.id === this.property)?.availableOptions ?? [];
      case TodoAppId.BACKLOG:
        return properties.value.length ? (properties.value[0].availableOptions ?? []) : [];
      default:
        return [];
    }
  },
});
const projectRule: Ref<number | null> = ref<number | null>(null);

const captionStep2 = computed((): {
  title: string;
  description: string;
} => {
  switch (setupTodoAppId.value) {
    case TodoAppId.SPREADSHEET:
      return {
        title: "2. シートを選ぶ",
        description: "タスク情報を取得するシートを1つ選択してください。",
      };
    case TodoAppId.NOTION:
      return {
        title: "2. データベースを選ぶ",
        description: "タスク情報を取得するデータベースを1つ選択してください。",
      };
    case TodoAppId.BACKLOG:
      return {
        title: "2. プロジェクトを選ぶ",
        description: "タスク情報を取得するプロジェクトを1つ選択してください。",
      };
    default:
      return {
        title: "",
        description: "",
      };
  }
});

const captionStep3 = computed((): {
  title: string;
  description: string;
} => {
  switch (setupTodoAppId.value) {
    case TodoAppId.SPREADSHEET:
      return {
        title: "3. 列と条件を選ぶ",
        description: `タスク情報を取得するために、${ setupTodoAppName.value }の列と条件を選んでください。`,
      };
    case TodoAppId.NOTION:
      return {
        title: "3. プロパティを選ぶ",
        description: `タスクのステータスを取得するために、対応する${ setupTodoAppName.value }のプロパティを選択してください`,
      };
    case TodoAppId.BACKLOG:
      return {
        title: "3. 状態を選ぶ",
        description: `タスクのステータスを取得するために、ステータスに対応する${ setupTodoAppName.value }の状態を紐付けてください。`,
      };
    default:
      return {
        title: "",
        description: "",
      };
  }
});

const canGoToNextPage = computed(() => {
  return (memberConfigs.value.length > 0);
});

const settingExpansionPanelData: Ref<SettingExpansionPanelData[]> = ref<SettingExpansionPanelData[]>([
  {
    step: 1,
    title: `1. ${ setupTodoAppName.value }とPOPAIを連携する`,
    description: "簡潔な概要", // TODO
    iconSrc: setupTodoAppIconSrc.value,
    hasNextButton: true,
    hasBackButton: false,
    isOpen: true,
    isDone: false,
  },
  {
    step: 2,
    title: captionStep2.value.title,
    description: captionStep2.value.description,
    iconSrc: setupTodoAppIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
    isDone: false,
  },
  {
    step: 3,
    title: captionStep3.value.title,
    description: captionStep3.value.description,
    iconSrc: setupTodoAppIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
    isDone: false,
  },
  {
    step: 4,
    title: `4. ${ setupChatToolName.value }とPOPAIを連携する`,
    description: "簡潔な概要", // TODO
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: true,
    hasBackButton: true,
    isOpen: false,
    isDone: false,
  },
  {
    step: 5,
    title: "5. 社員ごとにアカウントを紐付ける",
    description: "ダイレクトメッセージを送信するために、タスクの担当者とチャットツールのアカウントを紐付けてください。",
    iconSrc: setupChatToolIconSrc.value,
    hasNextButton: false,
    hasBackButton: false,
    isOpen: false,
    isDone: false,
  },
]);

const propertiesForName = computed(() => properties.value.filter((p) => {
  return NOTION_PROPERTY_TYPES_FOR_NAME.includes(p.type);
}));
const propertiesForPeople = computed(() => properties.value.filter((p) => {
  return NOTION_PROPERTY_TYPES_FOR_PEOPLE.includes(p.type);
}));
const propertiesForDate = computed(() => properties.value.filter((p) => {
  return NOTION_PROPERTY_TYPES_FOR_DATE.includes(p.type);
}));
const propertiesForStatus = computed(() => properties.value.filter((p) => {
  return NOTION_PROPERTY_TYPES_FOR_STATUS.includes(p.type);
}));
const propertiesForRelation = computed(() => properties.value.filter((p) => {
  return NOTION_PROPERTY_TYPES_FOR_RELATION.includes(p.type);
}));

const isDoneTodoAppSetting = computed(() => {
  switch (implementedTodoAppId.value) {
    case TodoAppId.SPREADSHEET:
    case TodoAppId.NOTION:
      if (
        name.value.property &&
        assignee.value.property &&
        deadline.value.property &&
        isDone.value.property &&
        (isDone.value.requireOptions && isDone.value.options.length > 0)
      ) {
        return true;
      }
      break;
    case TodoAppId.BACKLOG:
      if (isDone.value.requireOptions && isDone.value.options.length > 0) {
        return true;
      }
      break;
  }
  return false;
});

watch(isDoneTodoAppSetting, () => {
  settingExpansionPanelData.value.find(panel => panel.step === 3)!.isDone = isDoneTodoAppSetting.value;
});

watch(canGoToNextPage, () => {
  settingExpansionPanelData.value.find(panel => panel.step === 5)!.isDone = canGoToNextPage.value;
});

watch(boardId, async (next) => {
  if (!isUpdating && implementedTodoAppId.value && next) {
    startLoading();
    isUpdating = true;
    await updateBoardConfig(implementedTodoAppId.value, next);
    await init();
    isUpdating = false;
    finishLoading();
  }
  if (boardId.value) {
    settingExpansionPanelData.value.find(panel => panel.step === 2)!.isDone = true;
  }
});

watch(() => name.value.property, async (next) => {
  if (!isUpdating && next && implementedTodoAppId.value) {
    isUpdating = true;
    onStatusPropertyChanged(name.value, next);
    await updatePropertyUsage(name.value, PropertyUsageType.TITLE, next);
    isUpdating = false;
  }
}, { deep: true });
watch(() => assignee.value.property, async (next) => {
  if (!isUpdating && next && implementedTodoAppId.value) {
    isUpdating = true;
    onStatusPropertyChanged(assignee.value, next);
    await updatePropertyUsage(assignee.value, PropertyUsageType.ASSIGNEE, next);
    isUpdating = false;
  }
}, { deep: true });
watch(() => deadline.value.property, async (next) => {
  if (!isUpdating && next && implementedTodoAppId.value) {
    isUpdating = true;
    onStatusPropertyChanged(deadline.value, next);
    await updatePropertyUsage(deadline.value, PropertyUsageType.DEADLINE, next);
    isUpdating = false;
  }
}, { deep: true });
watch(() => parent.value.property, async (next) => {
  if (!isUpdating && next && implementedTodoAppId.value) {
    isUpdating = true;
    onStatusPropertyChanged(parent.value, next);
    await updatePropertyUsage(parent.value, PropertyUsageType.PARENT_TODO, next);
    isUpdating = false;
  }
}, { deep: true });
watch(() => isDone.value.property, async () => {
  if (!isUpdating && isDone.value.property && implementedTodoAppId.value) {
    isUpdating = true;
    onStatusPropertyChanged(isDone.value, isDone.value.property);
    await updatePropertyUsage(isDone.value, PropertyUsageType.IS_DONE, isDone.value.property);
    isUpdating = false;
  }
}, { deep: true });
watch(() => isClosed.value.property, async () => {
  if (!isUpdating && isClosed.value.property && implementedTodoAppId.value) {
    isUpdating = true;
    onStatusPropertyChanged(isClosed.value, isClosed.value.property);
    await updatePropertyUsage(isClosed.value, PropertyUsageType.IS_CLOSED, isClosed.value.property);
    isUpdating = false;
  }
}, { deep: true });

watch(() => [
  ...(isDone.value.requireOptions ? [...isDone.value.options] : []),
  isDone.value.requireCheckbox ? isDone.value.isChecked : null,
], async () => {
  if (!isUpdating && isDone.value.property && implementedTodoAppId.value) {
    isUpdating = true;
    await updatePropertyUsage(isDone.value, PropertyUsageType.IS_DONE, isDone.value.property);
    isUpdating = false;
  }
}, { deep: true });
watch(() => [
  ...(isClosed.value.requireOptions ? [...isClosed.value.options] : []),
  isClosed.value.requireCheckbox ? isClosed.value.isChecked : null,
], async () => {
  if (!isUpdating && isClosed.value.property && implementedTodoAppId.value) {
    isUpdating = true;
    await updatePropertyUsage(isClosed.value, PropertyUsageType.IS_CLOSED, isClosed.value.property);
    isUpdating = false;
  }
}, { deep: true });
watch(projectRule, async () => {
  if (!isUpdating && implementedTodoAppId.value && boardId.value && projectRule.value) {
    isUpdating = true;
    startLoading();
    await updateBoardConfig(implementedTodoAppId.value, boardId.value, projectRule.value);
    await fetchConfigStatus();
    finishLoading();
    isUpdating = false;
  }
});

const onStatusPropertyChanged = (propConfig: PropertyConfig, nextProp: string) => {
  const prop = properties.value.find(p => p.id === nextProp);
  if (prop) {
    switch (implementedTodoAppId.value) {
      case TodoAppId.NOTION:
        if (NOTION_PROPERTY_TYPES_WITH_LABELS.includes(prop.type)) {
          propConfig.requireOptions = true;
          propConfig.requireCheckbox = false;
          if (propConfig.requireOptions) {
            propConfig.options = [];
          }
        } else if (NOTION_PROPERTY_TYPES_WITH_CHECKBOX.includes(prop.type)) {
          propConfig.requireOptions = false;
          propConfig.requireCheckbox = true;
          if (propConfig.requireCheckbox) {
            propConfig.isChecked = true;
          }
        } else {
          propConfig.requireOptions = false;
          propConfig.requireCheckbox = false;
        }
        break;
      case TodoAppId.BACKLOG:
        propConfig.requireOptions = true;
        propConfig.requireCheckbox = false;
        break;
    }
  }
};
const resetPropertyUsages = () => {
  Object.assign(name.value, { ...propInitVal });
  Object.assign(assignee.value, { ...propInitVal });
  Object.assign(deadline.value, { ...propInitVal });
  Object.assign(parent.value, { ...propInitVal });
  Object.assign(isDone.value, { ...propInitVal });
  Object.assign(isClosed.value, { ...propInitVal });
};
const updatePropertyUsage = async (
  propConfig: PropertyConfig,
  usage: number,
  nextProp: string,
) => {
  if (!isInit.value && implementedTodoAppId.value && boardId.value) {
    startLoading();
    const prop = properties.value.find(p => p.id === nextProp)!;
    const selections: Partial<{ options: string[], isChecked: boolean }> = {};
    if (propConfig.requireOptions) {
      selections.options = propConfig.options;
    }
    if (propConfig.requireCheckbox) {
      selections.isChecked = propConfig.isChecked;
    }
    const newPropUsage = await updateTodoAppPropertyUsage(implementedTodoAppId.value, boardId.value, {
      id: propConfig.id!,
      property: nextProp,
      type: prop.type,
      usage,
      ...selections,
    });
    if (newPropUsage) {
      propConfig.id = newPropUsage.id;
    }
    await fetchConfigStatus();
    finishLoading();
  }
};

onMounted(async () => {
  if (implementedTodoAppId.value) {
    settingExpansionPanelData.value.find(panel => panel.step === 1)!.isDone = true;
  }
  if (implementedChatToolId.value) {
    settingExpansionPanelData.value.find(panel => panel.step === 4)!.isDone = true;
  }
  await init();
});
watch(implementedTodoAppId, async () => {
  await init();
  if (implementedTodoAppId.value) {
    settingExpansionPanelData.value.find(panel => panel.step === 1)!.isDone = true;
  }
});
watch(implementedChatToolId, () => {
  if (implementedChatToolId.value) {
    settingExpansionPanelData.value.find(panel => panel.step === 4)!.isDone = true;
  }
});
watch(todoAppBoards, async () => {
  await init();
}, { deep: true });
const init = async () => {
  startLoading();
  if (isInit.value && implementedChatToolId.value && implementedTodoAppId.value) {
    isInit.value = false;
    await Promise.all([
      reportingLineInit(),
    ]);
  }
  if (implementedTodoAppId.value && todoAppBoards.value.length) {
    isUpdating = true;
    resetPropertyUsages();
    await fetchBoardId();
    await Promise.all([
      fetchProperties(),
      fetchConfigs(),
      fetchConfigStatus(),
      fetchUserConfigs(),
    ]);
    isUpdating = false;
  }
  isInit.value = false;
  finishLoading();
};
const fetchBoardId = async () => {
  if (implementedTodoAppId.value) {
    const boardConfig = await getBoardConfig(implementedTodoAppId.value);
    boardId.value = boardConfig.boardId;
    projectRule.value = boardConfig.projectRule;
  }
};
const fetchProperties = async () => {
  if (implementedTodoAppId.value && boardId.value) {
    properties.value = await getTodoAppProperties(implementedTodoAppId.value, boardId.value);
  }
};
const fetchConfigs = async () => {
  if (implementedTodoAppId.value && boardId.value) {
    const usages = await getTodoAppPropertyUsages(implementedTodoAppId.value, boardId.value);
    setConfig(usages, name.value, PropertyUsageType.TITLE);
    setConfig(usages, assignee.value, PropertyUsageType.ASSIGNEE);
    setConfig(usages, deadline.value, PropertyUsageType.DEADLINE);
    setConfig(usages, parent.value, PropertyUsageType.PARENT_TODO);
    setConfig(usages, isDone.value, PropertyUsageType.IS_DONE);
    setConfig(usages, isClosed.value, PropertyUsageType.IS_CLOSED);
  }
};
const setConfig = (usages: PropertyUsage[], propConfig: PropertyConfig, usageType: number) => {
  const usage = usages.find(u => u.usage === usageType);
  if (usage) {
    propConfig.id = usage.id ?? null;
    propConfig.property = usage.property ?? null;
    switch (implementedTodoAppId.value) {
      case TodoAppId.NOTION:
        if (NOTION_PROPERTY_TYPES_WITH_LABELS.includes(usage.type)) {
          propConfig.requireOptions = true;
          if (propConfig.requireOptions) {
            propConfig.options = usage.options ?? [];
          }
        }
        if (NOTION_PROPERTY_TYPES_WITH_CHECKBOX.includes(usage.type)) {
          propConfig.requireCheckbox = true;
          if (propConfig.requireCheckbox) {
            propConfig.isChecked = usage.isChecked ?? false;
          }
        }
        break;
      case TodoAppId.BACKLOG:
        propConfig.requireOptions = true;
        if (propConfig.requireOptions) {
          propConfig.options = usage.options ?? [];
        }
        break;
    }
  }
  if (implementedTodoAppId.value === TodoAppId.BACKLOG) {
    propConfig.requireOptions = true;
  }
};

watch(() => [implementedChatToolId.value, implementedTodoAppId.value], async () => {
  await init();
});

const reportingLineInit = async () => {
  reportingLines.value = await getUserReportingLines();
  reportingLines.value.forEach((config, index) => {
    watch(() => config.superiorUsers, async () => {
      const { user, superiorUsers } = reportingLines.value[index];
      await onSuperiorUsersChanged(user.id, superiorUsers);
    }, { deep: true });
  });
};
const fetchUserConfigs = async () => {
  if (implementedChatToolId.value && implementedTodoAppId.value) {
    const userConfigs = await getUserConfigs(implementedChatToolId.value, implementedTodoAppId.value);
    userConfigs.forEach((config, index) => {
      memberConfigs.value.push(createConfig({
        ...config,
        chatToolUserId: config.chatToolUserId ?? null,
        todoAppUserId: config.todoAppUserId ?? null,
        index,
        new: false,
      }));
    });
  }
};

const createConfig = (config: MemberConfig) => {
  const reactiveUser = reactive({
    id: config.user.id,
    name: customRef((track, trigger) => ({
      get () {
        track();
        return config.user.name;
      },
      async set (next) {
        if (config.user.name !== next) {
          config.user.name = next;
          await onUserNameChanged(config.index);
        }
        trigger();
      },
    })),
  });
  return reactive({
    user: reactiveUser,
    chatToolUserId: customRef((track, trigger) => ({
      get () {
        track();
        return config.chatToolUserId;
      },
      async set (next) {
        if (config.chatToolUserId !== next) {
          config.chatToolUserId = next;
          await onChatToolUserIdChanged(config.index, next);
          trigger();
        }
      },
    })),
    todoAppUserId: customRef((track, trigger) => ({
      get () {
        track();
        return config.todoAppUserId;
      },
      async set (next) {
        if (config.todoAppUserId !== next) {
          config.todoAppUserId = next;
          await onTodoAppUserIdChanged(config.index, next);
          trigger();
        }
      },
    })),
    new: config.new,
    index: config.index,
  });
};
const onUserNameChanged = async (index: number) => {
  startLoading();
  await updateUserName(index);
  await reportingLineInit();
  finishLoading();
};
const onChatToolUserIdChanged = async (index: number, next: string | null) => {
  startLoading();
  if (!memberConfigs.value[index].user.id) {
    await updateUserName(index);
  }
  const { id } = memberConfigs.value[index].user;
  if (implementedChatToolId.value && id && next) {
    await updateChatToolUsers(implementedChatToolId.value, id, next);
  }
  await fetchConfigStatus();
  finishLoading();
};
const onTodoAppUserIdChanged = async (index: number, next: string | null) => {
  startLoading();
  if (!memberConfigs.value[index].user.id) {
    await updateUserName(index);
  }
  const { id } = memberConfigs.value[index].user;
  if (implementedTodoAppId.value && id && next) {
    await updateTodoAppUser(implementedTodoAppId.value, id, next);
  }
  await fetchConfigStatus();
  finishLoading();
};

const updateUserName = async (index: number) => {
  const user = await updateUser(memberConfigs.value[index].user);
  if (user) {
    memberConfigs.value[index].user.id = user.id;
  }
  await fetchConfigStatus();
};
const addRow = async () => {
  const index = memberConfigs.value.length;
  memberConfigs.value.push(createConfig({
    user: { name: "" },
    chatToolUserId: null,
    todoAppUserId: null,
    new: true,
    index,
  }));
  await Promise.all([
    onUserNameChanged(index),
    fetchConfigStatus(),
  ]);
};
const deleteRow = async (index: number) => {
  const [{ user: deletedUser }] = memberConfigs.value.splice(index, 1);
  memberConfigs.value.forEach((config, index) => {
    config.index = index;
  });
  if (deletedUser?.id) {
    startLoading();
    await deleteUser(deletedUser.id);
    await Promise.all([
      reportingLineInit(),
      fetchConfigStatus(),
    ]);
    finishLoading();
  }
};

const onSuperiorUsersChanged = async (subordinateUserId: string, superiorUserIds: string[]) => {
  startLoading();
  await updateUserReportingLines(subordinateUserId, superiorUserIds);
  finishLoading();
};

onBeforeMount(async () => {
  startLoading();
  await setCurrentStep(2);
  finishLoading();
});

const installTodoApp = async () => {
  switch (setupTodoAppId.value) {
    case TodoAppId.SPREADSHEET:
      // TODO API未実装
      alert("GET /google/install");
      break;
    case TodoAppId.NOTION:
      await navigateTo(
        `${ runtimeConfig.public.apiBaseUrl }/notion/install`,
        { external: true },
      );
      break;
    case TodoAppId.BACKLOG:
      showBacklogModal.value = !showBacklogModal.value;
      break;
  }
};

const installChatTool = async () => {
  switch (setupChatToolId.value) {
    case ChatToolId.SLACK:
      await navigateTo(
        `${ runtimeConfig.public.apiBaseUrl }/slack/install`,
        { external: true },
      );
      break;
    case ChatToolId.LINEWORKS:
      showLineworksModal.value = !showLineworksModal.value;
      break;
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

const fetchData = async () => {
  startLoading();
  await fetchDataForBoard(implementedTodoAppId.value!);
  finishLoading();
};

const nextPage = async () => {
  await fetchData();
  if (setupFeatures.value.includes(SetupFeatureId.REMIND)) {
    await navigateTo("/setting/remind");
  } else if (setupFeatures.value.includes(SetupFeatureId.PROSPECT)) {
    await navigateTo("/setting/prospect");
  } else {
    // 本来通りえないケース
    alert("「機能を選ぶ」画面でPOPAIに依頼したい機能を選択してください。");
    await navigateTo("/setup");
  }
};
</script>

<style scoped lang="sass">
.set-gap
  gap: 12px
</style>
