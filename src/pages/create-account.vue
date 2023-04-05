<template lang="pug">
.d-flex.flex-column.align-start.w-100
  img(src="/images/logo_name.svg" height="48").mb-6.mx-auto
  v-card(flat).pa-6.w-100.rounded-lg
    SimplePageTitle 新規登録
    v-form(ref="form" @submit.prevent="submit")
      v-text-field(
        v-model="formData.organization"
        autocomplete="organization"
        type="text"
        :rules="[Validations.required]"
        label="チーム名 *"
        variant="outlined"
        color="primary"
        autofocus
      ).mb-4
      v-text-field(
        v-model="formData.name"
        autocomplete="name"
        type="text"
        :rules="[Validations.required]"
        label="ご担当者名 *"
        variant="outlined"
        color="primary"
      ).mb-4
      v-text-field(
        v-model="formData.email"
        autocomplete="email"
        type="email"
        :rules="[Validations.required, Validations.email]"
        label="メールアドレス *"
        variant="outlined"
        color="primary"
      ).mb-4
      v-text-field(
        v-model="formData.password"
        autocomplete="new-password"
        :type="passType"
        :rules="[Validations.required, Validations.password]"
        label="パスワード *"
        :append-inner-icon="passAppendIcon"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
        color="primary"
      ).mb-4
      v-text-field(
        v-model="formData.passwordConfirm"
        autocomplete="new-password"
        :type="passTypeConfirm"
        :rules="[Validations.required, Validations.password]"
        label="パスワード (確認) *"
        :append-inner-icon="passAppendIconConfirm"
        @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
        variant="outlined"
        color="primary"
      )
      v-checkbox(v-model="formData.agree" color="primary")
        template(#label)
          NuxtLink(:href="URL_TERMS_OF_USE" target="_blank").text--secondary.no-ul.mr-1 利用規約
            v-icon(size="xs") mdi-launch
          span に同意します。
      .d-flex.flex-column.align-center
        v-btn(type="submit" color="primary") 新規登録
  v-btn(nuxt to="/login" variant="text" color="primary" prepend-icon="mdi-chevron-left").px-2.mt-2 ログイン画面に戻る
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VForm } from "vuetify/components";
import Validations from "~/utils/validations";
import { signUp } from "~/apis/auth";
import { URL_TERMS_OF_USE } from "~/consts/links";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "@firebase/auth";
import { DialogMessages, getMessageByAuthError } from "~/utils/messages";

type SignUpInfo = {
  email: string;
  password: string;
  passwordConfirm: string;
  organization: string;
  name: string;
  agree: boolean;
}

definePageMeta({
  layout: "before-login"
});
useHead({
  title: "パスワードの再設定"
});

const { startLoading, finishLoading } = useLoading();
const config = useRuntimeConfig();

const form = ref<VForm>();
const formData = reactive<SignUpInfo>({
  organization: "",
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  agree: false
});
const showPassword = ref<boolean>(false);
const showPasswordConfirm = ref<boolean>(false);
const passType = computed(() => showPassword.value ? "text" : "password");
const passTypeConfirm = computed(() => showPasswordConfirm.value ? "text" : "password");
const passAppendIcon = computed(() => showPassword.value ? "mdi-eye" : "mdi-eye-off");
const passAppendIconConfirm = computed(() => showPasswordConfirm.value ? "mdi-eye" : "mdi-eye-off");

const submit = async () => {
  const validation = await form.value?.validate();
  if (validation?.valid && formData.password === formData.passwordConfirm && formData.agree) {
    startLoading();
    await signUp(formData)
      .then(async () => {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
          .then(async (credential) => {
            const { user } = credential;
            if (!user.emailVerified) {
              await sendEmailVerification(user, {
                url: `${ config.public.apiBaseUrl }/auth/verify?email=${ encodeURIComponent(formData.email) }`,
              });
              alert(DialogMessages.VERIFICATION_EMAIL_SENT);
            } else {
              alert("アカウントを作成しました。");
            }
          });
      }, (err) => {
        console.log(err);
        alert(getMessageByAuthError(err.message));
      });

    finishLoading();
    await navigateTo("/login");
  } else if (validation?.valid && formData.password !== formData.passwordConfirm) {
    alert("パスワードが一致しません。");
  } else if (validation?.valid && !formData.agree) {
    alert("利用規約に同意してください。");
  }
};
</script>

<style scoped lang="sass">
.no-ul
  text-decoration: none
</style>
