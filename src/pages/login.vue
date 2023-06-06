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
</template>

<script setup lang="ts">
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

const signIn = async (providerId: ProviderId, initial: boolean = false) => {
  await login(providerId, [], initial);
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
</style>
