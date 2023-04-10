<template lang="pug">
.d-flex.flex-column.align-center.w-100
  img(src="/images/logo_name.svg" height="48").mb-6
  v-card(flat).pa-6.w-100.rounded-lg
    SimplePageTitle ログイン
    v-form(ref="form" @submit.prevent="submit")
      v-row.justify-center
        v-col(cols="12" md="11")
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
          ).mb-4
        v-col(cols="12" md="11")
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
          ).mb-4
        v-col(cols="12" md="10")
          .d-flex.flex-column.align-center
            v-btn(type="submit" color="primary" flat) ログイン
            NuxtLink(:to="toResetAccount").mt-4.text-caption.text-grey パスワードをお忘れの方はこちら
  .d-flex.justify-center.mt-4
    v-btn(nuxt to="/create-account" variant="text" color="primary" append-icon="mdi-arrow-right").px-2 アカウントを作成する (無料)
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VForm } from "vuetify/components";
import Validations from "~/utils/validations";
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
const formData = reactive<LoginInfo>({ email: "", password: "" });
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
    startLoading();
    await login(formData.email, formData.password);
    finishLoading();
  }
};
</script>
