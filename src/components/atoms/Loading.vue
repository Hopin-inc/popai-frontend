<template lang="pug">
v-overlay(v-model="loading" persistent)
  v-progress-circular(indeterminate color="white")
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

const loading = computed({
  get(): boolean {
    return props.modelValue;
  },
  set(value: boolean) {
    emits('update:model-value', value)
  }
});
</script>