<template lang="pug">
v-navigation-drawer(v-if="!isPc" v-model="menuOpened" location="end" :temporary="!isPc")
  .d-flex.justify-end
    v-btn(icon="mdi-close" flat @click.stop="menuOpened = false").ma-2
  SideMenu(:menus="menus")
v-main
  v-container.pa-0
    v-app-bar(v-if="!isPc && isSetupDone" flat)
      template(#prepend)
        NuxtLink(to="/").d-flex.align-center.px-2
          img(:src="ServiceLogos.POPAI_WITH_NAME" width="144")
      template(#append)
        v-app-bar-nav-icon(@click.stop="menuOpened = true")

    SettingStepper(
      v-if="!isSetupDone"
      :current-step="currentStep"
      :data="stepperItems"
      @click-step="chagePage"
    )
    v-row
      v-col(v-if="isPc && isSetupDone" cols="12" md="auto").px-4.py-6.select-menu.bg-white.scroll-y
        NuxtLink(to="/").d-flex.align-center.mb-4.mx-2
          img(:src="ServiceLogos.POPAI_WITH_NAME" width="160")
        SideMenu(:menus="menus" rounded="lg")
      v-col(cols="12" md="auto").pa-8.flex-fill
        .content.mx-auto
          slot
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { ServiceLogos } from "~/consts/images";
import type { SettingStepperData } from "~/types/settings";

useHead({
  titleTemplate: title => title ? `${ title } - POPAI` : "POPAI",
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
const {
  currentStep,
  setCurrentStep,
} = useSetup();
const { mdAndUp } = useDisplay();
const { currentRoute } = useRouter();

const menu = ref<string[]>([]);
const menuOpened = ref<boolean>(false);
const isPc = computed(() => mdAndUp.value);

// TODO 可変にする
const isSetupDone = ref<boolean>(false);

const signOut = async () => {
  startLoading();
  await logout();
  finishLoading();
};

const stepperItems: Ref<SettingStepperData[]> = ref<SettingStepperData[]>([
  {
    step: 1,
    title: "機能を選ぶ",
  },
  {
    step: 2,
    title: "ツールを連携する",
  },
  {
    step: 3,
    title: "機能を設定する",
  },
  {
    step: 4,
    title: "利用を開始",
  },
]);

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

const chagePage = async (step: number) => {
  await setCurrentStep(step);
  switch (step) {
    case 1:
      navigateTo("/setup");
      break;
    case 2:
      navigateTo("/link");
      break;
    case 3:
      navigateTo("/setting/remind");
      break;
    case 4:
      navigateTo("/completion");
      break;
  }
};

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
