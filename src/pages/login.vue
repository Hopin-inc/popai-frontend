<template lang="pug">
.d-flex.flex-column.align-center.w-100
  img(:src="ServiceLogos.LOGO_WITH_NAME" height="48").mb-6
  v-card(flat).pa-6.w-100.rounded-lg
    SimplePageTitle ログイン
    v-row(justify="center")
      v-col(cols="12" sm="6")
        a(@click.stop="signIn('oidc.slack')").slack-btn
          img(:src="ExternalServiceLogos.SLACK" height="20")
          span Slackでログイン
    v-row(justify="center")
      v-col(cols="12" sm="9").d-flex.align-center
        span.flex-fill.border-b
        p.mx-4.text-caption.text-grey 初めての方は…
        span.flex-fill.border-b
    v-row(justify="center")
      v-col(cols="auto").d-flex.justify-center.pa-0
        p.font-weight-bold 新規アカウント作成
    v-row(justify="center")
      v-col(cols="12" sm="6")
        a(@click.stop="signIn('oidc.slack', true)").slack-btn
          img(:src="ExternalServiceLogos.SLACK" height="20")
          span Slackで登録
    v-overlay(v-model="popup" contained persistent no-click-animation).d-flex.justify-center.align-center
      .d-flex.flex-column.align-center.pa-6
        v-progress-circular(indeterminate color="white" size="48").mb-4
        p.text-white.font-weight-bold.text-center
          | ポップアップを起動します。<br>
          | {{ isInitial ? "登録" : "ログイン" }}するSlackアカウントを選択し、アクセスを許可してください。
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ServiceLogos, ExternalServiceLogos } from "~/consts/images";

type ProviderId = "oidc.slack";

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "ログイン",
});

const { login } = useAuth();
const config = useRuntimeConfig();
const popup: Ref<boolean> = ref<boolean>(false);
const isInitial: Ref<boolean> = ref<boolean>(false);

const signIn = async (providerId: ProviderId, initial: boolean = false) => {
  isInitial.value = initial;
  popup.value = true;
  await login(providerId, [], initial);
  popup.value = false;
};
</script>

<style scoped lang="sass">
.btn
  align-items: center
  color: #000
  cursor: pointer
  background-color: #fff
  border: 1px solid #ddd
  border-radius: 4px
  display: inline-flex
  font-size: 16px
  font-weight: 600
  gap: 20px
  height: 48px
  justify-content: center
  padding: 4px 16px
  text-decoration: none
  width: 100%

.slack-btn
  @extend .btn

:deep(.v-overlay__scrim)
  opacity: 50%
</style>
