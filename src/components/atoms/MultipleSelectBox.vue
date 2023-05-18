<template lang="pug">
v-select(
  v-model="value"
  :items="props.items"
  :label="props.label"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  :density="props.density"
  :readonly="props.readonly"
  multiple
  variant="outlined"
  color="primary"
  hide-details
)
  template(#selection="{ item, index }")
    v-chip(
      @click:close.prevent="removeItem($event, index)"
      :key="item"
      closable
      density="comfortable"
    ) {{ item.title }}
</template>

<script setup lang="ts">
type ItemDef = {
  itemValue: string;
  itemTitle: string;
};
type Props = {
  modelValue: number[];
  item: {
    [K in ItemDef[keyof ItemDef]]: K extends ItemDef["itemValue"]
      ? string | number | null
      : K extends ItemDef["itemTitle"] ? string : unknown;
  } & Record<string, any>[];
  label?: string;
  density?: "compact" | "comfortable" | "default";
  readonly?: boolean;
} & Partial<ItemDef>;
type Emits = {
  (e: "update:model-value", value: number[]): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  items: () => [],
  itemValue: "id",
  itemTitle: "name",
  density: "comfortable",
  readonly: false,
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value),
});

const removeItem = (_e: Event, index: number) => {
  value.value = modelValue.value.filter((_, i) => i !== index);
};
</script>

<style scoped lang="sass">
.v-select
  :deep(.v-field__input)
    gap: 8px
</style>
