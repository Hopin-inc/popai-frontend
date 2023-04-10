<template lang="pug">
.d-flex.flex-column.align-start.w-100
  img(src="/images/logo_name.svg" height="48").mb-6.mx-auto
  v-card(flat).pa-6.w-100.rounded-lg
    SimplePageTitle パスワード再設定
    v-form(ref="form" @submit.prevent="submit")
      p.mb-6.text-body-2
        | ご登録のメールアドレス（ログインID）をご入力ください。<br>
        | ご入力頂いたメールアドレスへ、パスワード再設定用のURLを送信します。
      v-text-field(
        v-model="email"
        autocomplete="email"
        type="email"
        :rules="[Validations.required, Validations.email]"
        label="メールアドレス"
        prepend-icon="mdi-email"
        variant="outlined"
        color="primary"
        autofocus
      ).mb-4
      .d-flex.flex-column.align-center
        v-btn(type="submit" color="primary" flat) 送信する
  v-btn(nuxt :to="{ path: '/login', query }" variant="text" color="primary" prepend-icon="mdi-chevron-left").px-2.mt-2 戻る
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VForm } from "vuetify/components";
import Validations from "~/utils/validations";
import { reset } from "~/apis/auth";

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "パスワードの再設定",
});

const { query } = useRoute();
const { startLoading, finishLoading } = useLoading();

const form = ref<VForm>();
const email = ref<string>("");

const submit = async () => {
  startLoading();
  await reset(email.value);
  finishLoading();
  alert("入力されたメールアドレスに、パスワード再設定用のURLを送信しました。\nURLをクリックして、パスワードを再設定してください。");
  await navigateTo({ path: "/login", query });
};
</script>
