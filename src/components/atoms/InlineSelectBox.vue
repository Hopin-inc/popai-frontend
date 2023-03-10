<template lang="pug">
v-select(
  v-model="value"
  :items="props.items"
  :label="props.label"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  variant="underlined"
  :readonly="props.readonly"
  density="compact"
  color="primary"
  hide-details
).inline-select.mx-2
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

<style scoped lang="sass">
.inline-select
  :deep(.v-field__append-inner)
    padding-top: 0
  :deep(.v-field__input)
    padding-top: 0
    min-height: auto
</style>
