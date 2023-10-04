<template lang="pug">
.d-flex.flex-column.align-center.w-100
  img(:src="ServiceLogos.POPAI_WITH_NAME" height="48").mb-6
  v-card(flat).pa-6.w-100.rounded-lg
    v-row(justify="center")
      v-col(cols="12")
        p アカウント作成が完了しました！ 🎉
        p 続いて、POPAIを{{ ChatToolName[chatToolId] }}にインストールしましょう 🙌
      v-col(v-if="chatToolId === ChatToolId.SLACK" cols="12" sm="8")
        a(:href="`${ config.public.apiBaseUrl }/slack/install`").slack-btn
          img(:src="ExternalServiceLogos.SLACK" height="20")
          span Slackに追加
</template>

<script setup lang="ts">
import { ChatToolId, ChatToolName } from "~/consts/enum";
import { ServiceLogos, ExternalServiceLogos } from "~/consts/images";

const config = useRuntimeConfig();
const { query } = useRoute();
const chatToolId: number = parseInt(query.chatToolId as string);

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "アカウント登録",
});
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
