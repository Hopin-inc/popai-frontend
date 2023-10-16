<template lang="pug">
.d-flex.flex-column.align-center.w-100
  img(:src="ServiceLogos.POPAI_WITH_NAME" height="48").mb-6
  v-card(flat).pa-6.w-100.rounded-lg
    SimplePageTitle ログイン
    v-form(ref="form" @submit.prevent="submit")
      v-row.justify-center
        v-col(cols="12" sm="10")
          v-text-field(
            v-model="formData.email"
            autocomplete="email"
            type="email"
            :rules="[Validations.required, Validations.email]"
            label="メールアドレス"
            prepend-icon="mdi-email"
            variant="outlined"
            color="primary"
            autofocus
            hide-details="auto"
          )
        v-col(cols="12" sm="10")
          v-text-field(
            v-model="formData.password"
            autocomplete="current-password"
            :type="passType"
            :rules="[Validations.required]"
            label="パスワード"
            prepend-icon="mdi-lock"
            :append-inner-icon="passAppendIcon"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            color="primary"
            hide-details="auto"
          )
        v-col(cols="12" md="10")
          .d-flex.flex-column.align-center
            v-btn(type="submit" color="primary" flat) ログイン
    v-row(justify="center").mb-2
      v-col(cols="12" sm="9").d-flex.align-center.justify-center
        a(@click.stop="forgotPasswordModal=true").mx-4.text-min.text-primary.text-link ログインできない方はこちら
    v-row(justify="center")
      v-col(cols="12" sm="9").d-flex.align-center
        span.flex-fill.border-b
        p.text-caption.text-grey 他のアカウントでログイン
        span.flex-fill.border-b
    v-row(justify="center").mt-0
      v-col(cols="12" sm="5")
        a(@click.stop="signInWithSlack('oidc.slack')").slack-btn
          img(:src="ExternalServiceLogos.SLACK" height="20")
          span Slackでログイン
  v-row(justify="center").w-100.mt-4
    v-col(cols="12").d-flex.align-center.justify-center
      a(@click.stop="navigateTo('/sign-up')").mx-4.text-caption.text-primary.text-link まだアカウントをお持ちでない方はこちら
  v-overlay(v-model="popup" contained persistent no-click-animation).d-flex.justify-center.align-center
    .d-flex.flex-column.align-center.pa-6
      v-progress-circular(indeterminate color="white" size="48").mb-4
      p.text-body-2.text-white.font-weight-bold.text-center
        | 新しいウィンドウまたはタブでログイン画面を開いています。<br>
        | ログインするSlackアカウントを選択し、アクセスを許可してください。

BtnModalSet(
  v-model="forgotPasswordModal"
  title="パスワードを忘れた方"
  :max-width="640"
  closable
)
  template(#content)
    v-row
      v-col(cols="12")
        p ご登録されたメールアドレスにパスワード再設定用のメールが送信されます。
    v-row
      v-col(cols="12")
        v-text-field(
            v-model="forgotPasswordEmail"
            autocomplete="email"
            type="email"
            :rules="[Validations.required, Validations.email]"
            label="メールアドレス"
            variant="outlined"
            color="primary"
            autofocus
            hide-details="auto"
        )
  template(#actions)
    v-btn(
      @click.stop="resetPassword()"
      :disabled="forgotPasswordEmail === ''"
      color="primary"
      variant="flat"
    ).px-4 パスワードをリセットする
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { VForm } from "vuetify/components";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import Validations from "~/utils/validations";
import { ServiceLogos, ExternalServiceLogos } from "~/consts/images";

type ProviderId = "oidc.slack";

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "ログイン",
});

type LoginInfo = {
  email: string;
  password: string;
};

const { login, loginWithEmail } = useAuth();
const { startLoading, finishLoading } = useLoading();
const popup: Ref<boolean> = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const passType = computed(() => showPassword.value ? "text" : "password");
const passAppendIcon = computed(() => showPassword.value ? "mdi-eye" : "mdi-eye-off");
const form = ref<VForm>();
const formData: LoginInfo = reactive<LoginInfo>({ email: "", password: "" });
const forgotPasswordModal: Ref<boolean> = ref<boolean>(false);
const forgotPasswordEmail: Ref<string> = ref<string>("");

const submit = async () => {
  const validation = await form.value?.validate();
  if (validation?.valid) {
    startLoading();
    await loginWithEmail(formData.email, formData.password);
    finishLoading();
  }
};

const signInWithSlack = async (providerId: ProviderId) => {
  popup.value = true;
  await login(providerId, [], false);
  popup.value = false;
};

const resetPassword = async () => {
  if (Validations.email(forgotPasswordEmail.value) === true) {
    startLoading();
    const auth = getAuth();
    let resultMessage = "";
    await sendPasswordResetEmail(auth, forgotPasswordEmail.value)
      .then(() => {
        resultMessage = `${ forgotPasswordEmail.value }にパスワード再設定用のメールを送信しました。`;
      })
      .catch(() => {
        resultMessage = "パスワード再設定用のメールの送信に失敗しました。";
      });
    finishLoading();
    alert(resultMessage);
    forgotPasswordModal.value = false;
    forgotPasswordEmail.value = "";
  } else {
    alert("無効なメールアドレスです。");
  }
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

.text-min
  font-size: 10px
.text-link
  cursor: pointer
  &:hover
    text-decoration: underline

:deep(.v-overlay__scrim)
  opacity: 50%
</style>
