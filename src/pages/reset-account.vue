<template lang="pug">
v-container.fill-height.card-container
  v-card.pa-6.w-100
    v-btn(nuxt to="/login" variant="text" color="primary" prepend-icon="mdi-chevron-left").px-2 ログイン画面に戻る
    PageTitle.my-6.text-center パスワード再設定
    v-form(ref="form" @submit.prevent="")
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
        v-btn(type="submit" color="primary") 送信する
</template>

<script setup lang="ts">
import { ref } from "vue";
import Validations from "~/utils/validations";
import { VForm } from "vuetify/components";

definePageMeta({
  layout: false,
});
useHead({
  title: "パスワードの再設定",
});

const { login } = useAuth();

const form = ref<VForm>();
const email = ref<string>("");

</script>

<style scoped lang="sass">
.card-container
  max-width: 480px
  margin: auto
</style>