<template lang="pug">
v-navigation-drawer(v-if="!isPc" v-model="menuOpened" location="end" :temporary="!isPc")
  .d-flex.justify-end
    v-btn(@click.stop="menuOpened = false" icon="mdi-close" flat).ma-2
  SideMenu(:menus="menus")
v-main.fill-height
  v-container.pa-0.fill-height
    v-app-bar(v-if="!isPc" flat)
      template(#prepend)
        NuxtLink(to="/").d-flex.align-center.px-2
          img(:src="ServiceLogos.LOGO_WITH_NAME" width="144")
      template(#append)
        v-app-bar-nav-icon(@click.stop="menuOpened = true")
    v-row.flex-wrap.flex-md-nowrap.fill-height.ma-0
      v-col(cols="12" md="auto" v-if="isPc").px-4.py-6.select-menu.bg-white.scroll-y
        NuxtLink(to="/").d-flex.align-center.mb-4.mx-2
          img(:src="ServiceLogos.LOGO_WITH_NAME" width="160")
        SideMenu(v-if="isPc" :menus="menus" rounded="lg")
      v-col(cols="12" md="auto").pa-8.flex-fill.scroll-y
        .mx-auto.content
          slot
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { ServiceLogos } from "~/consts/images";

useHead({
  titleTemplate: title => title ? `${ title } - POPAI` : "POPAI",
});

const { name, logout } = useAuth();
const { startLoading, finishLoading } = useLoading();
const {
  connected,
  projectsEnabled,
  todosEnabled,
  todoAppConfigured,
  usersConfigured,
} = useInfo();
const { mdAndUp } = useDisplay();
const { currentRoute } = useRouter();

const menu = ref<string[]>([]);
const menuOpened = ref<boolean>(false);
const isPc = computed(() => mdAndUp.value);

const signOut = async () => {
  startLoading();
  await logout();
  finishLoading();
};
const menus = computed(() => [
  { type: "subheader", title: "連携" },
  {
    type: "item",
    title: "タスク管理ツール",
    to: "/link/todo-app",
    disabled: false,
  },
  {
    type: "item",
    title: "メンバー",
    to: "/link/members",
    disabled: !connected.value,
  },
  { type: "divider" },
  { type: "subheader", title: "設定" },
  {
    type: "item",
    title: "利用設定",
    to: "/settings/general",
    disabled: !todoAppConfigured.value || !usersConfigured.value,
  },
  {
    type: "item",
    title: "通知設定",
    to: "/settings/notification",
    disabled: !todoAppConfigured.value || !usersConfigured.value,
  },
  { type: "divider" },
  { type: "subheader", title: "機能ごとのカスタマイズ" },
  {
    type: "item",
    title: "タスクのシェア",
    to: "/features/todos",
    disabled: !todoAppConfigured.value || !usersConfigured.value || !todosEnabled.value,
  },
  {
    type: "item",
    title: "プロジェクトのシェア",
    to: "/features/projects",
    disabled: !usersConfigured.value || !todoAppConfigured.value || !projectsEnabled.value,
  },
  { type: "divider" },
  {
    type: "item",
    title: "ログアウト",
    action: signOut,
    disabled: false,
  },
]);

watch(currentRoute, () => {
  menu.value = [];
});
watch(connected, async (next) => {
  const { path } = useRoute();
  if (!next) {
    menus.value.forEach((v, idx) => {
      const target = menus.value[idx];
      if (target.type === "item") {
        target.disabled = target.to !== "/link/todo-app";
      }
    });
    if (!["/link/todo-app"].includes(path)) {
      await navigateTo("/link/todo-app");
    }
  } else {
    menus.value.forEach((v, idx) => {
      const target = menus.value[idx];
      if (target.type === "item") {
        target.disabled = false;
      }
    });
  }
});
</script>

<style scoped lang="sass">
.v-container
  max-width: none
  height: 100%
:deep(.v-list-item__prepend > .v-icon)
  margin-inline-end: 16px
  -webkit-margin-end: 16px
.select-menu
  width: 240px
  min-width: 240px
.scroll-y
  max-height: 100vh
  overflow-y: scroll
.content
  max-width: 1080px
:deep(.v-list-group)
  --parent-padding: 0
</style>
