<template lang="pug">
SettingCard(
  title="タスク情報の紐付け"
  subtitle="タスクを管理するボードを設定し、タスク情報を同期するためのカラムの紐付けを行います。"
)
  template(#content)
    CardSection(title="カラム設定")
      v-row
        v-col(cols="4")
          FormPart(title="タスク名")
            SelectBox(
              v-model="columns.name.property"
              :items="propertiesForName"
              label="カラムを選択"
              item-value="id"
              item-title="name"
            )
        v-col(cols="4")
          FormPart(title="担当者")
            SelectBox(
              v-model="columns.assignee.property"
              :items="propertiesForPeople"
              label="カラムを選択"
              item-value="id"
              item-title="name"
            )
        v-col(cols="4")
          FormPart(title="期日")
            SelectBox(
              v-model="columns.deadline.property"
              :items="propertiesForDate"
              label="カラムを選択"
              item-value="id"
              item-title="name"
            )
        v-col(cols="12")
          FormPart(title="完了しているかどうか")
            v-row
              v-col(cols="4")
                SelectBox(
                  v-model="columns.isDone.property"
                  :items="propertiesForStatus"
                  label="カラムを選択"
                  item-value="id"
                  item-title="name"
                )
              v-col(cols="8" v-if="columns.isDone.requireOptions")
                MultipleSelectBox(
                  v-model="columns.isDone.options"
                  :items="columns.isDone.availableOptions"
                  label="「完了」に対応するラベル"
                )
        v-col(cols="12")
          FormPart(title="保留かどうか")
            v-row
              v-col(cols="4")
                SelectBox(
                  v-model="columns.isClosed.property"
                  :items="propertiesForStatus"
                  label="カラムを選択"
                  item-value="id"
                  item-title="name"
                )
              v-col(cols="8" v-if="columns.isClosed.requireOptions")
                MultipleSelectBox(
                  v-model="columns.isClosed.options"
                  :items="columns.isClosed.availableOptions"
                  label="「保留」に対応するラベル"
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
} from "~/consts";

type ValueOf<T> = T[keyof T];
type ColumnConfigs = {
  name: PropertyConfig;
  assignee: PropertyConfig;
  deadline: PropertyConfig;
  isDone: PropertyConfig;
  isClosed: PropertyConfig;
};
type PropertyConfig = {
  property: number;
  requireOptions: boolean;
} & ({
  requireOptions: true;
  options: number[];
  availableOptions: Option[];
} | {
  requireOptions: false;
  options?: [];
  availableOptions?: [];
});
type Property = {
  id: number;
  propertyId: number;
  name: string;
  type: ValueOf<typeof NotionPropertyType>;
  usages: ValueOf<typeof PropertyUsageType>[];
  options: Option[];
};
type Option = {
  id: number;
  optionId: string;
  name: string;
};

useHead({
  title: "タスク情報の紐付け"
});

const properties = ref<Property[]>([
  {
    id: 1,
    propertyId: 1,
    name: "ゴール",
    type: NotionPropertyType.TITLE,
    usages: [PropertyUsageType.TITLE],
    options: [],
  },
  {
    id: 12,
    propertyId: 12,
    name: "備考",
    type: NotionPropertyType.RICH_TEXT,
    usages: [],
    options: [],
  },
  {
    id: 2,
    propertyId: 2,
    name: "担当者",
    type: NotionPropertyType.PEOPLE,
    usages: [PropertyUsageType.ASSIGNEE],
    options: [],
  },
  {
    id: 11,
    propertyId: 11,
    name: "作成者",
    type: NotionPropertyType.PEOPLE,
    usages: [PropertyUsageType.ASSIGNEE],
    options: [],
  },
  {
    id: 3,
    propertyId: 3,
    name: "期日",
    type: NotionPropertyType.DATE,
    usages: [PropertyUsageType.DEADLINE],
    options: [],
  },
  {
    id: 13,
    propertyId: 13,
    name: "確認済",
    type: NotionPropertyType.CHECKBOX,
    usages: [],
    options: [],
  },
  {
    id: 4,
    propertyId: 4,
    name: "ステータス",
    type: NotionPropertyType.STATUS,
    usages: [PropertyUsageType.IS_DONE, PropertyUsageType.IS_CLOSED],
    options: [
      { id: 1, optionId: "hoge", name: "未着手" },
      { id: 2, optionId: "fuga", name: "完了" },
      { id: 3, optionId: "piyo", name: "保留" },
    ],
  },
]);
const propertiesForName = computed(() => properties.value.filter(p => {
  return NOTION_PROPERTY_TYPES_FOR_NAME.includes(p.type);
}));
const propertiesForPeople = computed(() => properties.value.filter(p => {
  return NOTION_PROPERTY_TYPES_FOR_PEOPLE.includes(p.type);
}));
const propertiesForDate = computed(() => properties.value.filter(p => {
  return NOTION_PROPERTY_TYPES_FOR_DATE.includes(p.type);
}));
const propertiesForStatus = computed(() => properties.value.filter(p => {
  return NOTION_PROPERTY_TYPES_FOR_STATUS.includes(p.type);
}));
const boardId = ref<number | null>(null);
const columns = reactive<ColumnConfigs>({
  name: { property: 1, requireOptions: false },
  assignee: { property: 2, requireOptions: false },
  deadline: { property: 3, requireOptions: false },
  isDone: {
    property: 4,
    requireOptions: true,
    options: [1, 2],
    availableOptions: properties.value.find(p => p.id === 4)?.options ?? [],
  },
  isClosed: {
    property: 4,
    requireOptions: true,
    options: [3],
    availableOptions: properties.value.find(p => p.id === 4)?.options ?? [],
  },
});

const onPropertyChanged = (propConfig: PropertyConfig, nextProp: number) => {
  const prop = properties.value.find(p => p.id === nextProp);
  if (prop) {
    if (NOTION_PROPERTY_TYPES_WITH_LABELS.includes(prop.type)) {
      propConfig.requireOptions = true;
      if (propConfig.requireOptions) {
        propConfig.availableOptions = prop.options;
      }
    } else {
      propConfig.requireOptions = false;
      if (!propConfig.requireOptions) {
        propConfig.options = [];
        propConfig.availableOptions = [];
      }
    }
  }
}
watch(() => columns.isDone.property, (next) => {
  onPropertyChanged(columns.isDone, next);
}, { deep: true });
watch(() => columns.isClosed.property, (next) => {
  onPropertyChanged(columns.isClosed, next);
}, { deep: true });
</script>
