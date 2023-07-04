<template lang="pug">
CommonPage(title="タスク管理ツール")
  v-row(v-if="!isInit")
    v-col(cols="12").mb-4
      h2.font-weight-bold 連携可能なツール
      p POPAIにタスクデータを同期するツールを選んでください。
      .d-flex.mt-4.align-center.set-gap
        v-btn(
          :href="`${ config.public.apiBaseUrl }/notion/install`"
          :disabled="!!implementedTodoApp"
          :class="implementedTodoAppId === TodoAppId.NOTION ? 'tool-selected' : ''"
          :variant="implementedTodoAppId === TodoAppId.NOTION ? 'outlined' : 'flat'"
          flat
        ).pa-4.fill-height
          img(:src="ExternalServiceLogos.NOTION" height="40")
        v-btn(
          @click.stop="backlogSetup = true"
          :disabled="!!implementedTodoApp"
          :class="implementedTodoAppId === TodoAppId.BACKLOG ? 'tool-selected' : ''"
          :variant="implementedTodoAppId === TodoAppId.BACKLOG ? 'outlined' : 'flat'"
          flat
        ).pa-4.fill-height
          img(:src="ExternalServiceLogos.BACKLOG" height="40")
    v-col(cols="12" v-if="implementedTodoAppId === TodoAppId.NOTION")
      SectionCard(
        title="プロパティを設定する"
        :description="`${ TodoAppName[TodoAppId.NOTION] }のデータを同期するために、データベースと対応するプロパティを選択してください。`"
        :icon-src="ExternalServiceLogos.NOTION"
      )
        SubSection(title="データベース設定")
          v-row
            v-col(cols="12" sm="8" md="6")
              SelectBox(
                v-model="boardId"
                :items="todoAppBoards"
                label="データベースを選択"
              )
        SubSection(title="カラム設定")
          v-row
            v-col(cols="12" sm="6" md="4")
              FormPart(title="タスク名")
                SelectBox(
                  v-model="name.property"
                  :items="propertiesForName"
                  label="カラムを選択"
                )
            v-col(cols="12" sm="6" md="4")
              FormPart(title="担当者")
                SelectBox(
                  v-model="assignee.property"
                  :items="propertiesForPeople"
                  label="カラムを選択"
                )
            v-col(cols="12" sm="6" md="4")
              FormPart(title="期日")
                SelectBox(
                  v-model="deadline.property"
                  :items="propertiesForDate"
                  label="カラムを選択"
                )
            v-col(cols="12" sm="6" md="4")
              FormPart(title="親レコード")
                SelectBox(
                  v-model="parent.property"
                  :items="propertiesForRelation"
                  label="カラムを選択"
                )
            v-col(cols="12")
              FormPart(title="完了しているかどうか")
                v-row
                  v-col(cols="12" sm="6" md="4")
                    SelectBox(
                      v-model="isDone.property"
                      :items="propertiesForStatus"
                      label="カラムを選択"
                    )
                  v-col(cols="12" md="8" v-if="isDone.requireOptions")
                    MultipleSelectBox(
                      v-model="isDone.options"
                      :items="isDone.availableOptions"
                      label="「完了」に対応するラベル"
                    )
                  v-col(cols="12" sm="6" md="8" v-if="isDone.requireCheckbox").d-flex.align-center
                    p.text-body-2 「完了」に対応する値:
                    v-checkbox(
                      v-model="isDone.isChecked"
                      color="primary"
                      density="comfortable"
                      hide-details
                    )
            v-col(cols="12")
              FormPart(title="保留かどうか")
                v-row
                  v-col(cols="12" sm="6" md="4")
                    SelectBox(
                      v-model="isClosed.property"
                      :items="propertiesForStatus"
                      label="カラムを選択"
                    )
                  v-col(cols="12" md="8" v-if="isClosed.requireOptions")
                    MultipleSelectBox(
                      v-model="isClosed.options"
                      :items="isClosed.availableOptions"
                      label="「保留」に対応するラベル"
                    )
                  v-col(cols="12" sm="6" md="8" v-if="isClosed.requireCheckbox").d-flex.align-center
                    p.text-body-2 「保留」に対応する値:
                    v-checkbox(
                      v-model="isClosed.isChecked"
                      color="primary"
                      density="comfortable"
                      hide-details
                    )
        SubSection(title="プロジェクトとタスクの設定方法")
          v-row
            v-col(cols="12")
              v-radio-group(v-model="projectRule" color="primary" hide-details)
                v-radio(v-for="rule in projectRules" :key="rule" :value="rule.id" :label="rule.name").my-1.my-md-0
    v-col(cols="12" v-if="implementedTodoAppId === TodoAppId.BACKLOG")
      SectionCard(
        title="プロジェクトを設定する"
        :description="`データを同期するために、${ TodoAppName[TodoAppId.BACKLOG] }のプロジェクトと状態を選択してください。`"
        :icon-src="ExternalServiceLogos.BACKLOG"
      )
        SubSection(title="同期するBacklogプロジェクトの設定")
          v-row
            v-col(cols="12" sm="8" md="6")
              SelectBox(
                v-model="boardId"
                :items="todoAppBoards"
                label="Backlogのプロジェクトを選択"
              )
        SubSection(title="状態の設定")
          v-row
            v-col(cols="12" md="6")
              FormPart(title="完了しているかどうか")
                v-row
                  v-col(cols="12")
                    MultipleSelectBox(
                      v-model="isDone.options"
                      :items="isDone.availableOptions"
                      label="「完了」に対応する状態"
                    )
            v-col(cols="12" md="6")
              FormPart(title="保留かどうか")
                v-row
                  v-col(cols="12")
                    MultipleSelectBox(
                      v-model="isClosed.options"
                      :items="isClosed.availableOptions"
                      label="「保留」に対応する状態"
                    )
        SubSection(title="プロジェクトとタスクの設定方法")
          v-row
            v-col(cols="12")
              v-radio-group(v-model="projectRule" color="primary" hide-details)
                v-radio(v-for="rule in projectRules" :key="rule" :value="rule.id" :label="rule.name").my-1.my-md-0
        SubSection(title="データの初回同期")
          v-row
            v-col(cols="12")
              p Backlogをご利用の場合は、「タスク管理ツール」と「メンバー」の設定を完了した後、一度だけ「初回同期」の実行が必要です。
            v-col(cols="12")
              v-btn(
                @click.stop="fetchData"
                :disabled="fetchDisabled"
                prepend-icon="mdi-update"
                color="primary"
                flat
              ) データの初回同期を実行する
BtnModalSet(
  v-model="backlogSetup"
  title="Backlogを設定する"
  :max-width="640"
  closable
)
  template(#content)
    v-row
      v-col(cols="12")
        p BacklogのスペースIDを入力してください。
    v-row
      v-col(cols="12")
        .d-flex.align-center.set-gap
          span https://
          v-text-field(
            v-model="backlogSpaceId.id"
            :rules="[Validations.required]"
            placeholder="スペースIDを入力"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          ).flex-fill
          SelectBox(v-model="backlogSpaceId.domain" :items="backlogDomains")
  template(#actions)
    v-btn(
      :href="`${ config.public.apiBaseUrl }/backlog/install?host=${ backlogSpaceId.id }${ backlogSpaceId.domain }`"
      :disabled="backlogSpaceId.id === ''"
      append-icon="mdi-arrow-right"
      color="primary"
      variant="flat"
    ).px-4 連携を開始する
</template>

<script setup lang="ts">
import type { ComputedRef, Ref } from "vue";
import { ProjectRule, PropertyUsageType, TodoAppId, TodoAppName } from "~/consts/enum";
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
  fetchDataForBoard,
  getBoardConfig,
  getTodoAppProperties,
  getTodoAppPropertyUsages,
  updateBoardConfig,
  updateTodoAppPropertyUsage,
} from "~/apis/todo-app";
import Validations from "~/utils/validations";
import { ExternalServiceLogos } from "~/consts/images";

type PropertyConfig = {
  id: number | null;
  property: string | null;
} & PropertyConfigOptions & PropertyConfigCheckbox;
type PropertyConfigOptions<RequireOptions extends boolean = boolean> = RequireOptions extends true ? {
  requireOptions: RequireOptions;
  options: string[];
  get availableOptions(): SelectItem[];
} : {
  requireOptions: RequireOptions;
};
type PropertyConfigCheckbox<RequireCheckbox extends boolean = boolean> = RequireCheckbox extends true ? {
  requireCheckbox: RequireCheckbox;
  isChecked: boolean;
} : {
  requireCheckbox: RequireCheckbox;
};
type Property = {
  id: string;
  name: string;
  type: number;
  availableOptions?: SelectItem[];
};
type SelectItem<I = string> = {
  id: I;
  name: string;
};
type PropertyUsage = {
  id: number;
  property: string;
  usage: number;
  type: number;
  options?: string[];
  isChecked?: boolean;
};
type BacklogSpaceId = {
  id: string;
  domain: ".backlog.com" | ".backlog.jp";
};

useHead({
  title: "タスク管理ツール",
});

const { startLoading, finishLoading } = useLoading();
const { implementedTodoApp, implementedTodoAppId, todoAppBoards, fetchConfigStatus, configStatus } = useInfo();
const config = useRuntimeConfig();

const isInit: Ref<boolean> = ref<boolean>(true);
const backlogSetup: Ref<boolean> = ref<boolean>(false);
const backlogSpaceId = reactive<BacklogSpaceId>({ id: "", domain: ".backlog.com" });
const backlogDomains: SelectItem[] = [
  { id: ".backlog.com", name: ".backlog.com" },
  { id: ".backlog.jp", name: ".backlog.jp" },
];
let isUpdating: boolean = false;
const properties: Ref<Property[]> = ref<Property[]>([]);
const boardId: Ref<string | null> = ref<string | null>(null);
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
const projectRules: ComputedRef<SelectItem<number>[]> = computed(() => {
  switch (implementedTodoAppId.value) {
    case TodoAppId.NOTION:
      return [
        { id: ProjectRule.PARENT_TODO, name: "親レコードがあるレコードをタスク、ないレコードをプロジェクトとみなす。" },
      ];
    case TodoAppId.BACKLOG:
      return [
        { id: ProjectRule.MILESTONE, name: "マイルストーンをプロジェクトとして、課題はすべてタスクとみなす。" },
        { id: ProjectRule.PARENT_TODO, name: "親課題がある課題をタスク、ない課題をプロジェクトとみなす。" },
      ];
    default:
      return [];
  }
});
const fetchDisabled = computed(() => !(
  implementedTodoAppId.value
  && boardId.value
  && projectRule.value
  && configStatus.value.todoApp
  && configStatus.value.users
));

// Get property data on boardId changed.
watch(boardId, async (next) => {
  if (!isUpdating && implementedTodoAppId.value && next) {
    startLoading();
    isUpdating = true;
    await updateBoardConfig(implementedTodoAppId.value, next);
    await init();
    isUpdating = false;
    finishLoading();
  }
});

// Update configs on property selected.
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

// Update configs on label selected or deselected.
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
  await init();
});
watch(implementedTodoAppId, async () => {
  await init();
});
watch(todoAppBoards, async () => {
  await init();
}, { deep: true });
const init = async () => {
  if (implementedTodoAppId.value && todoAppBoards.value.length) {
    isUpdating = true;
    startLoading();
    resetPropertyUsages();
    await fetchBoardId();
    await Promise.all([
      fetchProperties(),
      fetchConfigs(),
      fetchConfigStatus(),
    ]);
    finishLoading();
    isUpdating = false;
  }
  isInit.value = false;
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
const fetchData = async () => {
  if (implementedTodoAppId.value && boardId.value && projectRule.value) {
    startLoading();
    await fetchDataForBoard(implementedTodoAppId.value);
    finishLoading();
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
</script>

<style scoped lang="sass">
.tool-selected
  background-color: rgba(var(--v-theme-accent), .3)
  color: rgb(var(--v-theme-accent))
  opacity: 1
  :deep(.v-btn__overlay)
    opacity: 0
.set-gap
  gap: 12px
</style>
