<template lang="pug">
v-autocomplete(
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
      :key="item"
      closable
      density="comfortable"
      @click:close.prevent="removeItem($event, index)"
    ) {{ item.title }}
</template>

<script setup lang="ts">
import type { SelectItem } from "~/types/common";

type Props = {
  modelValue: number[];
  items: SelectItem[];
  itemValue?: string;
  itemTitle?: string;
  label?: string;
  density?: "compact" | "comfortable" | "default";
  readonly?: boolean;
};
type Emits = {
  (e: "update:model-value", value: number[]): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  items: () => [],
  itemValue: "id",
  itemTitle: "name",
  label: "",
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
