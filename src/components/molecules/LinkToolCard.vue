<template lang="pug">
v-card(
  :class="{'card-disabled': props.setupStatus === 'disabled'}"
  flat
  rounded="xl"
).pa-6.fill-width
  v-row
    v-col(cols="12")
      .d-flex.align-center.mb-4
        img(v-if="props.iconSrc" :src="props.iconSrc" width="32").mr-4
        h2.font-weight-bold.me-auto {{ props.title }}
        v-btn(
          v-if="props.setupStatus === 'notSetup'"
          @click.stop="onClickSetup"
          color="primary"
          variant="outlined"
          flat
        ) 連携する
        v-btn(
          v-else-if="props.setupStatus === 'alreadySetup'"
          color="primary"
          :prepend-icon="'mdi-check-circle'"
          flat
        ).btn-disabled 連携済み
        v-btn(
          v-else-if="props.setupStatus === 'disabled'"
          variant="outlined"
          flat
        ).btn-disabled 未設定
      p.ml-12(v-html="props.description")
</template>

<script setup lang="ts">
import type { SetupStatus } from "~/types/settings";

type Props = {
  title: string;
  description: string;
  setupStatus: SetupStatus;
  iconSrc: string;
};
type Emits = {
  (e: "click-setup", toolName: string): void
};

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  setupStatus: "notSetup",
  iconSrc: "",
});
const emits = defineEmits<Emits>();

const onClickSetup = () => {
  emits("click-setup", props.title);
};
</script>

<style scoped lang="sass">
.card-disabled
  background-color: gray
  opacity: 0.4
.btn-disabled
  cursor: default
  pointer-events: none
.fill-width
  width: 100%
  max-width: 100%
</style>
