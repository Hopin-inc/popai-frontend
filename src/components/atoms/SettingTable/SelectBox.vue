<template lang="pug">
v-select(
  v-model="value"
  :items="props.items"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  :readonly="props.readonly"
  :rules="props.rules"
  variant="outlined"
  density="compact"
  color="primary"
  hide-details
)
</template>

<script setup lang="ts">
type ItemDef = {
  itemValue: string;
  itemTitle: string;
};
type Props = {
  modelValue: number | string | null;
  item: {
    [K in ItemDef[keyof ItemDef]]: K extends ItemDef["itemValue"]
      ? string | number | null
      : K extends ItemDef["itemTitle"] ? string : unknown;
  } & Record<string, any>[];
  readonly?: boolean;
  rules?: any[];
} & Partial<ItemDef>;
type Emits = {
  (e: "update:model-value", value: number | string | null): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  items: () => [],
  itemValue: "id",
  itemTitle: "name",
  readonly: false,
  rules: () => [],
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value),
});
</script>

<style scoped lang="sass">
:deep(.v-select__selection-text)
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
</style>
