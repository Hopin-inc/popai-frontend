<template lang="pug">
v-dialog(
  v-model="value"
  :max-width="props.maxWidth"
  :persistent="props.persistent"
)
  template(#activator="{ props: dialogProps }" v-if="props.btnText")
    v-btn(
      v-bind="dialogProps"
      :variant="props.variant"
      :color="props.color"
      :prepend-icon="props.btnPrependIcon"
      :append-icon="props.btnAppendIcon"
      :size="props.btnSize"
      :height="props.btnHeight"
      :width="props.btnWidth"
      flat
    ) {{ props.btnText }}
  v-card
    v-card-title(v-if="props.title").d-flex.justify-space-between.align-center.px-6.py-4.card-title-height
      p {{ props.title }}
      v-btn(v-if="props.closable" @click.stop="value = false" icon="mdi-close" variant="text" size="small").mr-n4
    v-card-text.px-6.py-4.overflow-y-auto
      slot(name="content")
    v-card-actions.px-6.py-4
      slot(name="actions")
</template>

<script lang="ts" setup>
type Props = {
  // モーダルの開閉状態 `VDialog.modelValue`
  modelValue: boolean;
  // モーダル幅の最大値 `VDialog.maxWidth`
  maxWidth?: number;
  // `VDialog.persistent`
  persistent?: boolean;
  // モーダルを閉じるボタンを表示
  // default: `false`
  closable?: boolean;
  // ボタンのテキスト
  btnText?: string;
  // モーダルのタイトル
  title?: string;
  // ボタンの色 `VBtn.color`
  color?: string;
  // ボタンの幅
  btnWidth?: string;
  // ボタンのサイズ
  btnSize?: "x-small" | "small" | "large" | "x-large";
  // ボタンの高さ
  btnHeight?: string;
  // ボタンの種類 `VBtn.variant`
  // default: `"flat"`
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  // `VBtn.prependIcon`
  btnPrependIcon?: string;
  // `VBtn.appendIcon`
  btnAppendIcon?: string;
};
type Emits = {
  (e: "update:model-value", v: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  color: "primary",
  variant: "flat",
  closable: false
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const value = computed({
  get: () => modelValue.value,
  set: v => emits("update:model-value", v)
});
</script>

<style lang="sass">
.card-title-height
  height: 56px
</style>
