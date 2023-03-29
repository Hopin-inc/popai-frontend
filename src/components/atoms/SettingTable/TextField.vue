<template lang="pug">
.d-flex
  v-text-field(
    :model-value="value"
    @blur.capture="onInput"
    :variant="editable ? 'outlined' : 'plain'"
    :readonly="!editable || readonly"
    density="compact"
    color="primary"
    hide-details
  ).editable-field
  .d-flex(v-if="!props.alwaysEditable").align-center.ml-2
    v-icon(v-if="!editable" @click.stop="onSwitchedOn" size="small") mdi-pencil
    template(v-else)
      v-icon(@click.stop="onSaved" color="primary" size="small").mr-1 mdi-check-bold
      v-icon(@click.stop="onCanceled" size="small") mdi-close
</template>

<script setup lang="ts">
type Props = {
  modelValue: string;
  alwaysEditable?: boolean;
  alwaysReadonly?: boolean;
};
type Emits = {
  (e: "update:model-value", value: string): void
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  alwaysEditable: false,
  alwaysReadonly: false
});
const emits = defineEmits<Emits>();

const value = ref<string>(props.modelValue);
const editable = ref<boolean>(props.alwaysEditable ?? false);
const readonly = ref<boolean>(props.alwaysReadonly ?? false);

const onInput = (e: InputEvent) => {
  if (e.target instanceof HTMLInputElement) {
    if (props.alwaysEditable) {
      emits("update:model-value", e.target?.value);
    } else {
      value.value = e.target?.value;
    }
  }
};
const onSwitchedOn = () => {
  editable.value = true;
};
const onCanceled = () => {
  value.value = props.modelValue;
  editable.value = false;
};
const onSaved = () => {
  emits("update:model-value", value.value);
  editable.value = false;
};
</script>

<style scoped lang="sass">
.editable-field :deep(.v-field--variant-plain input)
  padding-top: 0 !important
</style>
