<template lang="pug">
.fill-height
  v-app-bar(flat).px-4.px-md-8.menu-bar.border-b
    v-app-bar-title
      NuxtLink(to="/")
        img(src="/images/logo_name.svg" height="36").mt-2
    template(#append)
      v-menu(v-model="menu" :close-on-content-click="false")
        template(#activator="{ props }")
          v-btn(icon="mdi-account" v-bind="props").bg-grey-lighten-4
        v-card.w-100
          v-list
            v-list-item(:title="organization" :subtitle="name" prepend-icon="mdi-account")
          v-divider
          v-list
            v-list-item(title="ログアウト" @click.once="signOut" prepend-icon="mdi-logout")
  v-main.px-4.px-md-8.px-lg-16.py-8.mt-16
    v-container.page-container
      slot
</template>

<script setup lang="ts">
import { ref } from "vue";

useHead({
  titleTemplate: title => title ? `${title} - Popai` : "Popai"
});

const { organization, name, logout } = useAuth();
const { startLoading, finishLoading } = useLoading();

const menu = ref<boolean>(false);
const signOut = async () => {
  startLoading();
  await logout();
  finishLoading();
};
</script>

<style scoped lang="sass">
.page-container
  max-width: 1280px
  margin: auto

</style>
