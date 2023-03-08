<template lang="pug">
v-container.fill-height.card-container
  v-card.pa-6.w-100
    PageTitle.mt-4.mb-8.text-center ログイン
    v-form(ref="form" @submit.prevent="submit")
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
      ).mb-4
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
      ).mb-4
      .d-flex.flex-column.align-center
        v-btn(type="submit" color="primary") ログイン
        NuxtLink(:to="toResetAccount").mt-2.text-caption.text-grey パスワードをお忘れの方はこちら
    .d-flex.justify-center.mt-4
      v-btn(nuxt to="/create-account" variant="text" color="primary") 新規登録
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Validations from "~/utils/validations";
import { VForm } from "vuetify/components";
type LoginInfo = {
  email: string;
  password: string;
};

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "ログイン",
});

const { login } = useAuth();
const { startLoading, finishLoading } = useLoading();

const form = ref<VForm>();
const formData = ref<LoginInfo>({ email: "", password: "" });
const showPassword = ref<boolean>(false);
const passType = computed(() => showPassword.value ? "text" : "password");
const passAppendIcon = computed(() => showPassword.value ? "mdi-eye" : "mdi-eye-off");
const { query } = useRoute();

const toResetAccount = computed(() => {
  return { path: "/reset-account", query };
});

const submit = async () => {
  const validation = await form.value?.validate();
  if (validation?.valid) {
    console.log("login: start");
    startLoading();
    await login(formData.value.email, formData.value.password);
    finishLoading();
    console.log("login: finish");
  }
};
</script>

<style scoped lang="sass">
.card-container
  max-width: 480px
  margin: auto
</style>