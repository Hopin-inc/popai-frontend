<template lang="pug">
v-overlay(v-model="value" persistent).d-flex.justify-center.align-center
  v-progress-circular(indeterminate color="white" size="64")
</template>

<script setup lang="ts">
type Props = {
  modelValue: boolean;
};
type Emits = {
  (e: "update:model-value", value: boolean): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value),
});
</script>
