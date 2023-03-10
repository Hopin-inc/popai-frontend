<template lang="pug">
v-select(
  v-model="value"
  variant="outlined"
  :readonly="props.readonly"
  density="compact"
  color="primary"
  hide-details
)
</template>

<script setup lang="ts">
type Props = {
  modelValue: string;
  readonly?: boolean;
};
type Emits = {
  (e: "update:model-value", value: string): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  readonly: false
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: (value) => emits("update:model-value", value),
});
</script>
