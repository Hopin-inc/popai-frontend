<template lang="pug">
BtnModalSet(
  v-model="enableModal"
  title="LINE WORKSと連携する"
  :max-width="840"
  closable
  persistent
)
  template(#content)
    v-row
      v-col(cols="12")
        p
          a(href="https://dev.worksmobile.com/jp/console/openapi/v2/app/list/view") LINE WORKS Developer Console
          span 上でアプリ設定を行い、連携に必要な下記の情報を取得してください。
    v-row
      v-col(cols="12" md="6")
        FormPart(title="Client ID")
          v-text-field(
            v-model="installLineworksInfo.client_id"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
      v-col(cols="12" md="6")
        FormPart(title="Client Secret")
          v-text-field(
            v-model="installLineworksInfo.client_secret"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
      v-col(cols="12" md="8")
        FormPart(title="Service Account")
          v-text-field(
            v-model="installLineworksInfo.service_account"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
          )
      v-col(cols="12")
        FormPart(title="Secret Key")
          v-textarea(
            v-model="installLineworksInfo.secret_key"
            solo
            auto-grow
            rows="4"
            variant="outlined"
            color="primary"
            hide-details
          )
  template(#actions)
    v-btn(
      :disabled="validateForm"
      color="primary"
      variant="flat"
      @click.stop="onClickNext"
    ).px-4 次へ
    v-btn(
      color="primary"
      @click.stop="enableModal = false"
    ).px-4 キャンセル
</template>

<script setup lang="ts">
import type { InstallLineworksInfo } from "~/types/settings";
import { installLineworks } from "~/apis/line-works";

const { startLoading, finishLoading } = useLoading();

type Props = {
  modelValue: boolean;
};
type Emits = {
  (e: "update:model-value", v: boolean): void;
  (e: "installed"): void;
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
const installLineworksInfo: InstallLineworksInfo = reactive<InstallLineworksInfo>({
  client_id: "",
  client_secret: "",
  service_account: "",
  secret_key: "",
});

watch(enableModal, () => {
  installLineworksInfo.client_id = "";
  installLineworksInfo.client_secret = "";
  installLineworksInfo.service_account = "";
  installLineworksInfo.secret_key = "";
});

const validateForm = computed((): boolean => {
  return (
    installLineworksInfo.client_id === "" ||
    installLineworksInfo.client_secret === "" ||
    installLineworksInfo.service_account === "" ||
    installLineworksInfo.secret_key === ""
  );
});

const onClickNext = async () => {
  startLoading();
  if (await installLineworks(installLineworksInfo) === null) {
    alert("LINE WORKSとの連携に失敗しました。");
    return;
  }
  finishLoading();
  enableModal.value = false;
  emits("installed");
};
</script>
