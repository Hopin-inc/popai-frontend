<template lang="pug">
v-autocomplete(
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
import type { SelectItem } from "~/types/common";

type Props = {
  modelValue: number | string | null;
  items: SelectItem[];
  itemValue?: string;
  itemTitle?: string;
  readonly?: boolean;
  rules?: any[];
};
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
