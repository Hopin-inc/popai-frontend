<template lang="pug">
v-select(
  v-model="value"
  :items="props.items"
  :label="props.label"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  variant="outlined"
  :readonly="props.readonly"
  density="comfortable"
  color="primary"
  hide-details
)
</template>

<script setup lang="ts">
type SelectItem = {
  id: number;
  name: string;
  [key: string]: any;
};
type Props = {
  modelValue: number;
  items: SelectItem[];
  label?: string;
  readonly?: boolean;
  itemValue?: string;
  itemTitle?: string;
};
type Emits = {
  (e: "update:model-value", value: number): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  items: () => [],
  readonly: false,
  itemValue: "id",
  itemTitle: "name",
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: (value) => emits("update:model-value", value),
});
</script>
