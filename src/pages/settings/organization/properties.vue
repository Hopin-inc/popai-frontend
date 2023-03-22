<template lang="pug">
SettingCard(
  title="タスク情報の紐付け"
  subtitle="タスクを管理するボードを設定し、タスク情報を同期するためのカラムの紐付けを行います。"
)
  template(#content)
    CardSection(title="ボード設定")
      SelectBox(
        v-model="boardId"
        :items="boards"
        label="ボードを選択"
      )
    CardSection(title="カラム設定")
      v-row
        v-col(cols="4")
          FormPart(title="タスク名")
            SelectBox(
              v-model="name.property"
              :items="propertiesForName"
              label="カラムを選択"
            )
        v-col(cols="4")
          FormPart(title="担当者")
            SelectBox(
              v-model="assignee.property"
              :items="propertiesForPeople"
              label="カラムを選択"
            )
        v-col(cols="4")
          FormPart(title="期日")
            SelectBox(
              v-model="deadline.property"
              :items="propertiesForDate"
              label="カラムを選択"
            )
        v-col(cols="12")
          FormPart(title="完了しているかどうか")
            v-row
              v-col(cols="4")
                SelectBox(
                  v-model="isDone.property"
                  :items="propertiesForStatus"
                  label="カラムを選択"
                )
              v-col(cols="8" v-if="isDone.requireOptions")
                MultipleSelectBox(
                  v-model="isDone.options"
                  :items="isDone.availableOptions"
                  label="「完了」に対応するラベル"
                )
              v-col(cols="8" v-if="isDone.requireCheckbox").d-flex.align-center
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
              v-col(cols="4")
                SelectBox(
                  v-model="isClosed.property"
                  :items="propertiesForStatus"
                  label="カラムを選択"
                )
              v-col(cols="8" v-if="isClosed.requireOptions")
                MultipleSelectBox(
                  v-model="isClosed.options"
                  :items="isClosed.availableOptions"
                  label="「保留」に対応するラベル"
                )
              v-col(cols="8" v-if="isClosed.requireCheckbox").d-flex.align-center
                p.text-body-2 「保留」に対応する値:
                v-checkbox(
                  v-model="isClosed.isChecked"
                  color="primary"
                  density="comfortable"
                  hide-details
                )
</template>

<script setup lang="ts">
import { NotionPropertyType, PropertyUsageType } from "~/consts/enum";
import {
  NOTION_PROPERTY_TYPES_WITH_LABELS,
  NOTION_PROPERTY_TYPES_FOR_NAME,
  NOTION_PROPERTY_TYPES_FOR_DATE,
  NOTION_PROPERTY_TYPES_FOR_PEOPLE,
  NOTION_PROPERTY_TYPES_FOR_STATUS,
  NOTION_PROPERTY_TYPES_WITH_CHECKBOX
} from "~/consts";
import {
  getTodoAppBoards,
  getTodoAppProperties,
  getTodoAppPropertyUsages,
  updateTodoAppPropertyUsage
} from "~/apis/todo-app";

type ValueOf<T> = T[keyof T];
type PropertyConfig = {
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
  type: ValueOf<typeof NotionPropertyType>;
  availableOptions?: SelectItem[];
};
type SelectItem = {
  id: string;
  name: string;
};
type PropertyUsage = {
  id: string;
  usage: ValueOf<typeof PropertyUsageType>;
  type: ValueOf<typeof NotionPropertyType>;
  options?: string[];
  isChecked?: boolean;
};

useHead({
  title: "タスク情報の紐付け"
});

const { startLoading, finishLoading } = useLoading();
const { implementedTodoAppId } = useInfo();

const isInit = ref<boolean>(true);
const boards = ref<SelectItem[]>([]);
const properties = ref<Property[]>([]);
const boardId = ref<string | null>(null);
const name = reactive<PropertyConfig>({ property: null, requireOptions: false, requireCheckbox: false });
const assignee = reactive<PropertyConfig>({ property: null, requireOptions: false, requireCheckbox: false });
const deadline = reactive<PropertyConfig>({ property: null, requireOptions: false, requireCheckbox: false });
const isDone = reactive<PropertyConfig>({
  property: null,
  requireOptions: true,
  requireCheckbox: false,
  options: [],
  get availableOptions () {
    return properties.value.find(p => p.id === this.property)?.availableOptions ?? [];
  }
});
const isClosed = reactive<PropertyConfig>({
  property: null,
  requireOptions: true,
  requireCheckbox: false,
  options: [],
  get availableOptions () {
    return properties.value.find(p => p.id === this.property)?.availableOptions ?? [];
  }
});

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

// In case implementedTodoApp is null on mounted.
watch(implementedTodoAppId, async () => {
  await init();
});

// Get property data on boardId changed.
watch(boardId, async (next) => {
  startLoading();
  if (implementedTodoAppId.value && next) {
    properties.value = await getTodoAppProperties(implementedTodoAppId.value, next);
  }
  finishLoading();
});

// Update configs on property selected.
watch(() => name.property, async (next) => {
  if (next && implementedTodoAppId.value) {
    onStatusPropertyChanged(name, next);
    await updatePropertyUsage(name, next);
  }
}, { deep: true });
watch(() => assignee.property, async (next) => {
  if (next && implementedTodoAppId.value) {
    onStatusPropertyChanged(assignee, next);
    await updatePropertyUsage(assignee, next);
  }
}, { deep: true });
watch(() => deadline.property, async (next) => {
  if (next && implementedTodoAppId.value) {
    onStatusPropertyChanged(deadline, next);
    await updatePropertyUsage(deadline, next);
  }
}, { deep: true });
watch(() => isDone.property, async (next) => {
  if (next && implementedTodoAppId.value) {
    onStatusPropertyChanged(isDone, next);
    await updatePropertyUsage(isDone, next);
  }
}, { deep: true });
watch(() => isClosed.property, async (next) => {
  if (next && implementedTodoAppId.value) {
    onStatusPropertyChanged(isClosed, next);
    await updatePropertyUsage(isClosed, next);
  }
}, { deep: true });

// Update configs on label selected or deselected.
watch(() => isDone.requireOptions ? [...isDone.options] : [], async () => {
  if (isDone.property) {
    await updatePropertyUsage(isDone, isDone.property);
  }
}, { deep: true });
watch(() => isClosed.requireOptions ? [...isClosed.options] : [], async () => {
  if (isClosed.property) {
    await updatePropertyUsage(isClosed, isClosed.property);
  }
}, { deep: true });

const onStatusPropertyChanged = (propConfig: PropertyConfig, nextProp: string) => {
  const prop = properties.value.find(p => p.id === nextProp);
  if (prop) {
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
  }
};
const updatePropertyUsage = async (propConfig: PropertyConfig, nextProp: string) => {
  if (nextProp && implementedTodoAppId.value) {
    const prop = properties.value.find(p => p.id === nextProp)!;
    const selections: Partial<{ options: string[], isChecked: boolean }> = {};
    if (propConfig.requireOptions) {
      selections.options = propConfig.options;
    }
    if (propConfig.requireCheckbox) {
      selections.isChecked = propConfig.isChecked;
    }
    await updateTodoAppPropertyUsage(implementedTodoAppId.value, {
      id: nextProp,
      type: prop.type,
      usage: PropertyUsageType.TITLE,
      ...selections
    });
  }
};

onMounted(async () => {
  await init();
});
const init = async () => {
  startLoading();
  await Promise.all([
    fetchPropInfo(),
    fetchConfigs(),
  ]);
  isInit.value = false;
  finishLoading();
};
const fetchPropInfo = async () => {
  if (implementedTodoAppId.value) {
    boards.value = await getTodoAppBoards(implementedTodoAppId.value);
    boardId.value = boards.value[0].id;
    properties.value = await getTodoAppProperties(implementedTodoAppId.value, boardId.value);
  }
};
const fetchConfigs = async () => {
  if (implementedTodoAppId.value && boardId.value) {
    const usages = await getTodoAppPropertyUsages(implementedTodoAppId.value, boardId.value);
    setConfig(usages, name, PropertyUsageType.TITLE);
    setConfig(usages, assignee, PropertyUsageType.ASSIGNEE);
    setConfig(usages, deadline, PropertyUsageType.DEADLINE);
    setConfig(usages, isDone, PropertyUsageType.IS_DONE);
    setConfig(usages, isClosed, PropertyUsageType.IS_CLOSED);
  }
};
const setConfig = (usages: PropertyUsage[], propConfig: PropertyConfig, usageType: ValueOf<typeof PropertyUsageType>) => {
  const usage = usages.find(u => u.usage === usageType);
  propConfig.property = usage?.id ?? null;
  if (usage?.options !== undefined) {
    propConfig.requireOptions = true;
    if (propConfig.requireOptions) {
      propConfig.options = usage.options;
    }
  }
  if (usage?.isChecked !== undefined) {
    propConfig.requireCheckbox = true;
    if (propConfig.requireCheckbox) {
      propConfig.isChecked = usage.isChecked;
    }
  }
};
</script>
