<template lang="pug">
v-row
  v-col(cols="12")
    PageTitle 設定
v-row
  v-col(cols="12" md="auto").pa-3.select-menu
    div(v-if="isPc")
      SideMenu(:menus="menus" rounded="lg")
    v-list(v-else v-model:opened="menu").py-0.rounded-lg
      v-list-group(value="menu")
        template(#activator="{ props }")
          v-list-item(v-bind="props" title="設定メニュー")
        v-list-item.pa-0.py-2
          SideMenu(:menus="menus" :rounded="menuRounded")
  v-col(cols="12" md="auto").pa-3.flex-fill
    NuxtPage
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/common";
import PageTitle from "~/components/atoms/PageTitle.vue";
import { useDisplay } from "vuetify";

const { connected, implementedTodoAppId } = useInfo();
const { mdAndUp } = useDisplay();
const { currentRoute } = useRouter();

const menu = ref<string[]>([]);
const menus = computed(() => connected.value ? menusAfterConnect : menusBeforeConnect);
const isPc = computed(() => mdAndUp.value);
const menuRounded = computed(() => mdAndUp.value ? "lg" : undefined);
const menusBeforeConnect: MenuItem[] = [
  { type: "subheader", title: "ツール連携" },
  { type: "item", title: "タスク管理ツール", href: "/settings/connect/todo-app" },
  { type: "item", title: "チャットツール", href: "/settings/connect/chat-tool" }
];
const menusAfterConnect: MenuItem[] = [
  { type: "subheader", title: "ツール連携" },
  { type: "item", title: "タスク管理ツール", href: "/settings/connect/todo-app" },
  { type: "item", title: "チャットツール", href: "/settings/connect/chat-tool" },
  { type: "divider" },
  { type: "subheader", title: "チーム情報" },
  { type: "item", title: "従業員の紐付け", href: "/settings/organization/users" },
  { type: "item", title: "タスク情報の紐付け", href: "/settings/organization/properties" },
  { type: "item", title: "報告先設定", href: "/settings/organization/reporting-lines" },
  { type: "divider" },
  { type: "subheader", title: "通知" },
  { type: "item", title: "通知日時設定", href: "/settings/notification/common" },
  { type: "item", title: "日報設定", href: "/settings/notification/daily-report" },
  { type: "item", title: "タスク更新通知設定", href: "/settings/notification/update" },
  { type: "item", title: "見立て共有設定", href: "/settings/notification/prospect" }
];

watch(currentRoute, () => {
  menu.value = [];
});
watch(connected, async (next) => {
  const { path } = useRoute();
  if (!next && !["/settings/connect/todo-app", "/settings/connect/chat-tool"].includes(path)) {
    const to = !implementedTodoAppId.value ? "/settings/connect/todo-app" : "/settings/connect/chat-tool";
    await navigateTo(to);
  }
});
</script>

<style scoped lang="sass">
.select-menu
  width: 220px
  min-width: 220px
:deep(.v-list-group)
  --parent-padding: 0
</style>
