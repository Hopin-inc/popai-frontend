<template lang="pug">
.d-flex.flex-column.align-center.w-100
  img(src="/images/logo_name.svg" height="48").mb-6.mx-auto
  v-card(flat).pa-6.w-100.rounded-lg
    SimplePageTitle 新規登録
    v-form(ref="form" @submit.prevent="submit")
      v-row.justify-center
        v-col(cols="12" sm="10")
          v-text-field(
            v-model="formData.company"
            autocomplete="company"
            type="text"
            :rules="[Validations.required]"
            label="会社名/チーム名"
            variant="outlined"
            color="primary"
            autofocus
            hide-details="auto"
          )
        v-col(cols="12" sm="10")
          v-text-field(
            v-model="formData.email"
            autocomplete="email"
            type="email"
            :rules="[Validations.required, Validations.email]"
            label="メールアドレス"
            variant="outlined"
            color="primary"
            hide-details="auto"
          )
        v-col(cols="12" sm="10")
          v-text-field(
            v-model="formData.password"
            autocomplete="new-password"
            :type="passType"
            :rules="[Validations.required, Validations.password]"
            label="パスワード"
            :append-inner-icon="passAppendIcon"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            hide-details="auto"
          )
        v-col(cols="12" sm="10")
          v-text-field(
            v-model="formData.passwordConfirm"
            autocomplete="new-password"
            :type="passTypeConfirm"
            :rules="[Validations.required, Validations.password]"
            label="パスワードを再入力"
            :append-inner-icon="passAppendIconConfirm"
            @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
            variant="outlined"
            color="primary"
            hide-details="auto"
          )
        v-col(cols="12")
          v-checkbox(v-model="formData.agree" color="primary" hide-details="auto").d-flex.align-center.justify-center
            template(#label)
              p
                NuxtLink(:href="URL_TERMS_OF_USE" target="_blank").text-primary.no-ul.mr-1 利用規約
                  v-icon(size="xs" tag="span") mdi-launch
                span.mr-1 および
                NuxtLink(:href="URL_PRIVACY_POLICY" target="_blank").text-primary.no-ul.mr-1 プライバシーポリシー
                  v-icon(size="xs" tag="span") mdi-launch
                span に同意します。
        v-col(cols="12").text-center
          v-btn(type="submit" color="primary" flat) 新規登録
        v-col(cols="12" sm="9").d-flex.align-center.justify-center
          span.flex-fill.border-b
          p.text-caption.text-grey 他のアカウントで新規登録
          span.flex-fill.border-b
        v-col(cols="12" sm="5")
          a(@click.stop="signUpWithSlack('oidc.slack')").slack-btn
            img(:src="ExternalServiceLogos.SLACK" height="20")
            span Slackで新規登録
  v-row(justify="center").w-100.mt-2
    v-col(cols="12").d-flex.align-center.justify-center
      a(@click.stop="navigateTo('/login')").mx-4.text-caption.text-primary.text-link すでにアカウントをお持ちの方はこちら

  v-overlay(v-model="popup" contained persistent no-click-animation).d-flex.justify-center.align-center
    .d-flex.flex-column.align-center.pa-6
      v-progress-circular(indeterminate color="white" size="48").mb-4
      p.text-body-2.text-white.font-weight-bold.text-center
        | 新しいウィンドウまたはタブで登録画面を開いています。<br>
        | 新規登録するSlackアカウントを選択し、アクセスを許可してください。
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VForm } from "vuetify/components";
import { getAuth, sendEmailVerification, createUserWithEmailAndPassword } from "@firebase/auth";
import Validations from "~/utils/validations";
import { signUpWithEmail } from "~/apis/auth";
import { URL_TERMS_OF_USE, URL_PRIVACY_POLICY } from "~/consts/links";
import { DialogMessages } from "~/utils/messages";
import { ExternalServiceLogos } from "~/consts/images";
import type { EmailSignUpInfo } from "~/types/common";

type ProviderId = "oidc.slack";

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "新規登録",
});

const { login } = useAuth();
const { startLoading, finishLoading } = useLoading();
const form = ref<VForm>();
const formData = reactive<EmailSignUpInfo>({
  company: "",
  email: "",
  password: "",
  passwordConfirm: "",
  agree: false,
});
const showPassword = ref<boolean>(false);
const showPasswordConfirm = ref<boolean>(false);
const popup: Ref<boolean> = ref<boolean>(false);
const passType = computed(() => showPassword.value ? "text" : "password");
const passTypeConfirm = computed(() => showPasswordConfirm.value ? "text" : "password");
const passAppendIcon = computed(() => showPassword.value ? "mdi-eye" : "mdi-eye-off");
const passAppendIconConfirm = computed(() => showPasswordConfirm.value ? "mdi-eye" : "mdi-eye-off");
let allowRouteLeave: boolean = false;

onBeforeRouteLeave((_to, _from, next) => {
  const { company, email, password, passwordConfirm } = formData;
  if (!allowRouteLeave && (company !== "" || email !== "" || password !== "" || passwordConfirm !== "")) {
    const confirmed = confirm("ページを移動すると、入力途中の内容は失われてしまいます。\n本当にページを移動しますか？");
    if (confirmed) {
      next();
    }
  } else {
    next();
  }
});

// signup with email
const submit = async () => {
  const validation = await form.value?.validate();
  if (validation?.valid && formData.password === formData.passwordConfirm && formData.agree) {
    startLoading();
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (credential) => {
        const { user } = credential;
        await signUpWithEmail(user.uid, formData.company);
        if (!user.emailVerified) {
          await sendEmailVerification(user);
          alert(DialogMessages.VERIFICATION_EMAIL_SENT);
        } else {
          alert("アカウントを作成しました。");
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("すでに登録済みのメールアドレスです。");
        } else {
          alert("アカウントの作成に失敗しました。");
        }
      });
    finishLoading();
    allowRouteLeave = true;
    await navigateTo("/login");
  } else if (validation?.valid && formData.password !== formData.passwordConfirm) {
    alert("パスワードが一致しません。");
  } else if (validation?.valid && !formData.agree) {
    alert("利用規約に同意してください。");
  }
};

const signUpWithSlack = async (providerId: ProviderId) => {
  popup.value = true;
  await login(providerId, [], true);
  popup.value = false;
};
</script>

<style scoped lang="sass">
.no-ul
  text-decoration: none

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

.text-link
  cursor: pointer
  &:hover
    text-decoration: underline
</style>
