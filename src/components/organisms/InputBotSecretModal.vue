<template lang="pug">
BtnModalSet(
  v-model="enableModal"
  title="LINE WORKSのBot Secretを入力する"
  :max-width="840"
  closable
  persistent
)
  template(#content)
    v-row
      v-col(cols="12")
        p
          a(href="https://google.com") こちら
          span のヘルプページを参考に、
          a(href="https://dev.worksmobile.com/jp/console/openapi/v2/app/list/view") LINE WORKS Developer Console
          span 上でアプリ設定を行い、連携に必要な下記の情報を取得してください。
    v-row
      v-col(cols="12" md="6")
        FormPart(title="Bot ID")
          v-text-field(
            v-model="botId"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
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
      :disabled="botSecret === '' || botId === ''"
      color="primary"
      variant="flat"
      @click.stop="completeSetup"
    ).px-4 連携を完了する
    v-btn(
      color="primary"
      @click.stop="enableModal = false"
    ).px-4 キャンセル
</template>

<script setup lang="ts">
import { updateLineworksInstall } from "~/apis/line-works";

const { startLoading, finishLoading } = useLoading();

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
const botId = ref("");

watch(enableModal, () => {
  botId.value = "";
  botSecret.value = "";
});

const completeSetup = async () => {
  startLoading();
  if (await updateLineworksInstall(botId.value, botSecret.value) === null) {
    alert("LINE WORKSとの連携に失敗しました。");
  }
  finishLoading();
  enableModal.value = false;
};
</script>
