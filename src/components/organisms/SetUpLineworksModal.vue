<template lang="pug">
BtnModalSet(
  v-model="enableModal"
  title="LINE WORKSと連携する"
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
      v-col(cols="12" md="6")
        FormPart(title="Client ID")
          v-text-field(
            v-model="lineworksModalInfo.clientId"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
      v-col(cols="12" md="6")
        FormPart(title="Client Secret")
          v-text-field(
            v-model="lineworksModalInfo.clientSecret"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
      v-col(cols="12" md="8")
        FormPart(title="Service Account")
          v-text-field(
            v-model="lineworksModalInfo.serverAccount"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
      v-col(cols="12")
        FormPart(title="Secret Key")
          v-textarea(
            v-model="lineworksModalInfo.secretKey"
            solo
            auto-grow
            rows="4"
            variant="outlined"
            color="primary"
            hide-details
          )
  template(#actions)
    v-btn(
      @click.stop="installLineworks"
      :disabled="validateForm"
      color="primary"
      variant="flat"
    ).px-4 次へ
    v-btn(
      @click.stop="enableModal = false"
      color="primary"
    ).px-4 キャンセル
</template>

<script setup lang="ts">
import type { LineworksModalInfo } from "~/types/settings";

const config = useRuntimeConfig();

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
const lineworksModalInfo: LineworksModalInfo = reactive<LineworksModalInfo>({
  clientId: "",
  clientSecret: "",
  serverAccount: "",
  secretKey: "",
});

watch(enableModal, () => {
  lineworksModalInfo.clientId = "";
  lineworksModalInfo.clientSecret = "";
  lineworksModalInfo.serverAccount = "";
  lineworksModalInfo.secretKey = "";
});

const validateForm = computed((): boolean => {
  return (
    lineworksModalInfo.clientId === "" ||
    lineworksModalInfo.clientSecret === "" ||
    lineworksModalInfo.serverAccount === "" ||
    lineworksModalInfo.secretKey === ""
  );
});

const installLineworks = () => {
  // TODO API作成次第実装
  // `${ config.public.apiBaseUrl }/line-works/install`
  alert("POST /line-works/install");
  enableModal.value = false;
  emits("completed");
};

</script>

<style scoped lang="sass">
</style>
