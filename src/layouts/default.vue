<template lang="pug">
v-navigation-drawer(v-if="!isPc" v-model="menuOpened" location="end" :temporary="!isPc")
  .d-flex.justify-end
    v-btn(icon="mdi-close" flat @click.stop="menuOpened = false").ma-2
  SideMenu(:menus="menus")
v-main.min-h-screen
  v-container.pa-0
    v-app-bar(v-if="!isPc && isSetupDone" flat)
      template(#prepend)
        NuxtLink(to="/").d-flex.align-center.px-2
          img(:src="ServiceLogos.POPAI_WITH_NAME" width="144")
      template(#append)
        v-app-bar-nav-icon(@click.stop="menuOpened = true")
    v-row.h-100
      v-col(v-if="isPc && isSetupDone" cols="12" md="auto").px-4.py-6.select-menu.bg-white.scroll-y.d-flex.flex-column
        NuxtLink(to="/").d-flex.align-center.mb-4.mx-2.px-2.py-2
          img(:src="ServiceLogos.POPAI_WITH_NAME" height="32")
        SideMenu(:menus="menus" rounded="lg").fill-height
      v-col(cols="12" md="auto").pa-8.flex-fill.scroll-y
        slot(name="sidebar")
        .content.mx-auto.my-10
          slot
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { ServiceLogos } from "~/consts/images";

useHead({
  titleTemplate: title => title ? `${ title } - Angel` : "Angel",
});

const { logout } = useAuth();
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

// TODO 可変にする
const isSetupDone = ref<boolean>(true);

const signOut = async () => {
  startLoading();
  await logout();
  finishLoading();
};

const menus = computed(() => [
  {
    type: "item",
    title: "設定",
    to: "/setup",
    disabled: false,
  },
  {
    type: "item",
    title: "タスク一覧",
    to: "/todos/list",
  },
  { type: "filler" },
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
        target.disabled = target.to !== "/setup";
      }
    });
    if (!["/setup"].includes(path)) {
      await navigateTo("/setup");
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
  max-width: 960px
:deep(.v-list-group)
  --parent-padding: 0
</style>
