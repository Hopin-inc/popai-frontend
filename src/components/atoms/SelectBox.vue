<template lang="pug">
v-autocomplete(
  v-model="value"
  :items="props.items"
  :label="props.label"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  :readonly="props.readonly"
  variant="outlined"
  density="comfortable"
  color="primary"
  hide-details
)
</template>

<script setup lang="ts">
import type { SelectItem } from "~/types/common";

type Props = {
  modelValue: number | string | null;
  items: SelectItem[];
  label?: string;
  itemValue?: string;
  itemTitle?: string;
  readonly?: boolean;
};
type Emits = {
  (e: "update:model-value", value: number | string | null): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  items: () => [],
  label: "",
  itemValue: "id",
  itemTitle: "name",
  readonly: false,
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value),
});
</script>
