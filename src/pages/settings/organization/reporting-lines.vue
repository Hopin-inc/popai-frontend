<template lang="pug">
SettingCard(
  title="報告先設定"
  subtitle="見立ての回答結果を知らせる報告先メンバーを設定します。"
)
  template(#content)
    v-table(v-if="configs.length").overflow-x-auto
      thead
        tr
          th 従業員名
          th 報告先の従業員
      tbody
        tr(v-for="config in configs" :key="config")
          td {{ config.user.name }}
          td: MultipleSelectBox(v-model="config.superiorUsers" :items="users").my-3
</template>

<script setup lang="ts">
type Config = {
  user: User;
  superiorUsers: User[];
};
type User = {
  id: number;
  name: string;
};

useHead({
  title: "タスク管理ツール連携"
});

const configs = ref<Config[]>([
  { user: { id: 1, name: "阪田 直樹" }, superiorUsers: [{ id: 2, name: "中島 慎治" }] },
  { user: { id: 2, name: "中島 慎治" }, superiorUsers: [{ id: 1, name: "阪田 直樹" }, { id: 3, name: "渡邉 裕介" }] },
  { user: { id: 3, name: "渡邉 裕介" }, superiorUsers: [{ id: 1, name: "阪田 直樹" }] }
]);
const users = ref<User[]>([
  { id: 1, name: "阪田 直樹" },
  { id: 2, name: "中島 慎治" },
  { id: 3, name: "渡邉 裕介" },
]);
</script>
