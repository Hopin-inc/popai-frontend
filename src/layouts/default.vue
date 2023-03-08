<template lang="pug">
v-app-bar
  v-app-bar-title
    NuxtLink(to="/") sakura3
  template(v-slot:append)
    v-menu(v-model="menu" :close-on-content-click="false")
      template(v-slot:activator="{ props }")
        v-btn(icon="mdi-account" v-bind="props")
      v-card
        v-list
          v-list-item(prepend-icon="mdi-account" :title="organization")
        v-divider
        v-list
          v-list-item(title="ログアウト" @click.once="signOut")
v-main.main.px-16.py-8.mt-16
  v-container.page-container
    slot
</template>

<script setup lang="ts">
import { ref } from "vue";

useHead({
  titleTemplate: (title) => title ? `${ title } - sakura3` : "sakura3",
});

const { organization, logout } = useAuth();
const { startLoading, finishLoading } = useLoading();

const menu = ref<boolean>(false);
const signOut = async () => {
  console.log("signOut: start");
  startLoading();
  await logout();
  finishLoading();
  console.log("signOut: finish");
};
</script>

<style scoped lang="sass">
.page-container
  max-width: 1440px
  margin: auto
</style>
