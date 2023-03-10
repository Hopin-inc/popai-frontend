<template lang="pug">
v-select(
  v-model="value"
  :items="props.items"
  :label="props.label"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  :density="props.density"
  multiple
  variant="outlined"
  color="primary"
  hide-details
)
  template(#selection="{ item, index }")
    v-chip(
      closable
      @click:close.prevent="removeItem(e, index)"
      :key="index"
      density="comfortable"
    ) {{ item.title }}
</template>

<script setup lang="ts">
type SelectItem<IdType = number> = {
  id: IdType;
  name: string;
  [key: string]: any;
}

type Props = {
  modelValue: number[];
  items: SelectItem[];
  itemValue?: string;
  itemTitle?: string;
  label?: string;
  density: "compact" | "comfortable" | "default";
};
type Emits = {
  (e: "update:model-value", value: number[]): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  items: () => [],
  itemValue: "id",
  itemTitle: "name",
  density: "comfortable",
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
let value = computed({
  get: () => modelValue.value,
  set: (value) => emits("update:model-value", value),
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
