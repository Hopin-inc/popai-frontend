<template lang="pug">
v-select(
  v-model="value"
  :items="props.items"
  :label="props.label"
  :item-value="props.itemValue"
  :item-title="props.itemTitle"
  :readonly="props.readonly"
  variant="underlined"
  density="compact"
  color="primary"
  hide-details
).inline-select.mx-2
</template>

<script setup lang="ts">
type SelectItem = {
  id: number | string | null;
  name: string;
};
type Props = {
  modelValue: number | string | null;
  items: SelectItem[];
  label?: string;
  readonly?: boolean;
  itemValue?: string;
  itemTitle?: string;
};
type Emits = {
  (e: "update:model-value", value: number | string | null): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  items: () => [],
  readonly: false,
  itemValue: "id",
  itemTitle: "name"
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value)
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
