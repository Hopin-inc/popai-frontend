<template lang="pug">
date-picker(
  v-model="value"
  auto-apply
  text-input
  :placeholder="placeHolder"
  :enable-time-picker="enableTimePicker"
  locale="ja"
  :offset="10"
  :format="formatDate"
  :min-date="minDate"
  :max-date="maxDate"
  input-class-name="inline-date-input"
  :style="attributeStyles"
  ).mx-2
    template(#input-icon="")
      v-icon(size="small").ml-2 mdi-calendar-month

</template>

<script setup lang="ts">
import { formatDateTime } from "~/utils/datetime";

type Props = {
  placeHolder: string;
  enableTimePicker: boolean;
  modelValue: number | string | null;
  minDate: Date | null,
  maxDate: Date | null,
  format: string,
  height?: string;
  background?: string;
};
type Emits = {
  (e: "update:model-value", value: number | string | null): void
};

const props = withDefaults(defineProps<Props>(), {
  placeHolder: "日付を選択",
  enableTimePicker: false,
  modelValue: null,
  minDate: null,
  maxDate: null,
  format: "YYYY-MM-DD",
  height: "56px",
  background: "#f5f5f5",
});

const emits = defineEmits<Emits>();
const { modelValue, format, height, background } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: value => emits("update:model-value", value && formatDateTime(value.toString(), format.value)),
});

const attributeStyles = computed(() => {
  return {
    "--input-height": height.value,
    "--input-background": background.value,
  };
});

const formatDate = (date: string) => {
  return formatDateTime(date, format.value);
};

</script>

<style scoped lang="sass">
:deep(.inline-date-input)
  border: none
  border-bottom: 1px solid #9f9f9f
  border-radius: unset
  height: var(--input-height, 56px)
  background: var(--input-background)
  &:hover
    border-color: black
    background-color: rgb(228 228 228)
</style>
