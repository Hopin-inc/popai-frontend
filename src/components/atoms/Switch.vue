<template lang="pug">
v-switch(
  v-model="value"
  :label="props.label"
  color="primary"
  hide-details
).no-stretch.ml-3
  template(#label v-if="!props.label")
    slot
</template>

<script setup lang="ts">
type Props = {
  modelValue: boolean;
  label?: string;
};
type Emits = {
  (e: "update:model-value", value: boolean): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value)
});
</script>

<style scoped lang="sass">
.no-stretch
  :deep(.v-selection-control)
    flex: 0 0
    label
      padding-right: 10px
      white-space: nowrap
</style>
