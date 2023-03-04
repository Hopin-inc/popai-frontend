<template lang="pug">
v-container.fill-height.card-container
  v-card.pa-6.w-100
    v-btn(nuxt to="/login" variant="text" color="primary" prepend-icon="mdi-chevron-left").px-2 ログイン画面に戻る
    PageTitle.my-6.text-center 新規登録
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
        template(v-slot:label)
          NuxtLink(href="https://www.google.com/" target="_blank").no-ul 利用規約
            v-icon(size="xs") mdi-launch
          span に同意します。
      .d-flex.flex-column.align-center
        v-btn(type="submit" color="primary") 新規登録
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Validations from "~/utils/validations";
import { VForm } from "vuetify/components";

type SignUpInfo = {
  email: string;
  password: string;
  passwordConfirm: string;
  organization: string;
  name: string;
  agree: boolean;
}

definePageMeta({
  layout: false,
});
useHead({
  title: "パスワードの再設定",
});

const { login } = useAuth();

const form = ref<VForm>();
const formData = ref<SignUpInfo>({
  organization: "",
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  agree: false,
});
const showPassword = ref<boolean>(false);
const showPasswordConfirm = ref<boolean>(false);
const passType = computed(() => showPassword.value ? "text" : "password");
const passTypeConfirm = computed(() => showPasswordConfirm.value ? "text" : "password");
const passAppendIcon = computed(() => showPassword.value ? "mdi-eye" : "mdi-eye-off");
const passAppendIconConfirm = computed(() => showPasswordConfirm.value ? "mdi-eye" : "mdi-eye-off");

const submit = async () => {
  const validation = await form.value?.validate();
  if (validation?.valid && formData.value.password === formData.value.passwordConfirm && formData.value.agree) {
    alert("createAccount!");
    // await createAccount(formData.value.email, formData.value.password);
    await navigateTo("/login");
  } else if (validation?.valid && formData.value.password !== formData.value.passwordConfirm) {
    alert("パスワードが一致しません。");
  } else if (validation?.valid && !formData.value.agree) {
    alert("利用規約に同意してください。");
  }
}
</script>

<style scoped lang="sass">
.card-container
  max-width: 480px
  margin: auto

.no-ul
  cursor: pointer
</style>