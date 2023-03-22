<template lang="pug">
v-row
  v-col(cols="12")
    PageTitle 設定
v-row.flex-nowrap
  .pa-3.select-menu
    SideMenu(:menus="menus" rounded="lg")
  .pa-3.flex-fill
    NuxtPage
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/common";
import PageTitle from "~/components/atoms/PageTitle.vue";

const { connected, todoAppConnected } = useInfo();

const menus = computed(() => connected.value ? menusAfterConnect : menusBeforeConnect);
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

watch(connected.value, async (next) => {
  const { path } = useRoute();
  if (!next && !["/settings/connect/todo-app", "/settings/connect/chat-tool"].includes(path)) {
    const to = !todoAppConnected ? "/settings/connect/todo-app" : "/settings/connect/chat-tool";
    await navigateTo(to);
  }
});
</script>

<style scoped lang="sass">
.select-menu
  width: 220px
  min-width: 220px
</style>
