<template lang="pug">
.d-flex.flex-column.align-start.w-100
  img(:src="ServiceLogos.POPAI" height="48").mb-6.mx-auto
  v-card(flat).pa-6.w-100.rounded-lg
    v-form(ref="form" @submit.prevent="submit")
      v-row
        v-col(cols="12")
          p POPAIをご利用いただくまで、あと少しです！ 🎉
          p 最後に、会社名/チーム名を教えてください。
        v-col(cols="12")
          v-text-field(
            v-model="formData.name"
            autocomplete="name"
            type="text"
            :rules="[Validations.required]"
            label="会社名/チーム名 *"
            variant="outlined"
            color="primary"
            hide-details="auto"
          )
        v-col(cols="12")
          v-checkbox(v-model="formData.agree" color="primary" hide-details="auto")
            template(#label)
              p
                NuxtLink(:href="URL_TERMS_OF_USE" target="_blank").text-primary.no-ul.mr-1 利用規約
                  v-icon(size="xs" tag="span") mdi-launch
                span.mr-1 および
                NuxtLink(:href="URL_PRIVACY_POLICY" target="_blank").text-primary.no-ul.mr-1 プライバシーポリシー
                  v-icon(size="xs" tag="span") mdi-launch
                span に同意します。
        v-col(cols="12").text-center
          v-btn(type="submit" color="primary" flat) POPAIの利用を開始する
</template>

<script setup lang="ts">
import { VForm } from "vuetify/components";
import Validations from "~/utils/validations";
import { signUp } from "~/apis/auth";
import { URL_TERMS_OF_USE, URL_PRIVACY_POLICY } from "~/consts/links";
import { ServiceLogos } from "~/consts/images";
import type { SignUpInfo } from "~/types/common";

definePageMeta({
  layout: "before-login",
});
useHead({
  title: "アカウント情報登録",
});

const { startLoading, finishLoading } = useLoading();
const config = useRuntimeConfig();

const form = ref<VForm>();
const formData: SignUpInfo = reactive<SignUpInfo>({
  name: "",
  agree: false,
});
let allowRouteLeave: boolean = false;

onBeforeRouteLeave((_to, _from, next) => {
  const { name } = formData;
  if (!allowRouteLeave && name !== "") {
    const confirmed = confirm("ページを移動すると、入力途中の内容は失われてしまいます。\n本当にページを移動しますか？");
    if (confirmed) {
      next();
    }
  } else {
    next();
  }
});

const submit = async () => {
  const validation = await form.value?.validate();
  if (validation?.valid && formData.agree) {
    startLoading();
    await signUp(formData);
    finishLoading();
    allowRouteLeave = true;
    await navigateTo("/");
  } else if (validation?.valid && !formData.agree) {
    alert("利用規約に同意してください。");
  }
};
</script>

<style scoped lang="sass">
.no-ul
  text-decoration: none
</style>
