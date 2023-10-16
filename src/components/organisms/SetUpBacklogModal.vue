<template lang="pug">
BtnModalSet(
  v-model="enableModal"
  title="Backlogと連携する"
  :max-width="640"
  closable
  persistent
)
  template(#content)
    v-row
      v-col(cols="12")
        p BacklogのスペースIDを入力してください。
    v-row
      v-col(cols="12")
        .d-flex.align-center.set-gap
          span https://
          v-text-field(
            v-model="backlogSpaceId.id"
            :rules="[Validations.required]"
            placeholder="スペースIDを入力"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          ).flex-fill
          SelectBox(v-model="backlogSpaceId.domain" :items="backlogDomains")
  template(#actions)
    v-btn(
      :href="`${ config.public.apiBaseUrl }/backlog/install?host=${ backlogSpaceId.id }${ backlogSpaceId.domain }`"
      :disabled="backlogSpaceId.id === ''"
      append-icon="mdi-arrow-right"
      color="primary"
      variant="flat"
    ).px-4 連携を開始する
</template>

<script setup lang="ts">
import type { BacklogSpaceId } from "~/types/settings";
import type { SelectItem } from "~/types/common";
import Validations from "~/utils/validations";

const config = useRuntimeConfig();

type Props = {
  modelValue: boolean;
};
type Emits = {
  (e: "update:model-value", v: boolean): void;
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

const backlogSpaceId = reactive<BacklogSpaceId>({ id: "", domain: ".backlog.com" });
const backlogDomains: SelectItem<string>[] = [
  { id: ".backlog.com", name: ".backlog.com" },
  { id: ".backlog.jp", name: ".backlog.jp" },
];
</script>

<style scoped lang="sass">
.set-gap
  gap: 12px
</style>
