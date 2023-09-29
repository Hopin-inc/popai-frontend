<template lang="pug">
BtnModalSet(
  v-model="enableModal"
  title="LINE WORKSのBot Secretを入力する"
  :max-width="840"
  closable
)
  template(#content)
    v-row
      v-col(cols="12")
        p
          //a(href="https://google.com") こちら
          //span のヘルプページを参考に、
          a(href="https://developers.worksmobile.com/jp/") LINE WORKS Developer Console
          span 上でアプリ設定を行い、連携に必要な下記の情報を取得してください。
    v-row
      v-col(cols="12" md="8")
        FormPart(title="Bot Secret")
          v-text-field(
            v-model="botSecret"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
  template(#actions)
    v-btn(
      @click.stop="completeSetup"
      :disabled="botSecret === ''"
      color="primary"
      variant="flat"
    ).px-4 連携を完了する
    v-btn(
      @click.stop="enableModal = false"
      color="primary"
    ).px-4 キャンセル
</template>

<script setup lang="ts">

type Props = {
  modelValue: boolean;
};
type Emits = {
  (e: "update:model-value", v: boolean): void;
  (e: "completed"): void;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});
const emits = defineEmits<Emits>();

const { modelValue } = toRefs(props);
const enableModal = computed({
  get: () => modelValue.value,
  set: v => emits("update:model-value", v),
});
const botSecret = ref("");

watch(enableModal, () => {
  botSecret.value = "";
});

const completeSetup = () => {
  // TODO API作成次第実装
  // `${ config.public.apiBaseUrl }/line-works/install`
  alert("PATCH /line-works/install");
  enableModal.value = false;
};

</script>

<style scoped lang="sass">
</style>
