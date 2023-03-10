<template lang="pug">
SettingCard(
  title="従業員の紐付け"
  subtitle="従業員を登録し、チャットツール・タスク管理ツールとの紐付けを設定します。"
)
  template(#content)
    v-table(v-if="configs.length").overflow-x-auto
      thead
        tr
          th.w-240px 従業員名
          th.w-200px Slackアカウント
          th.w-200px Notionアカウント
          th 操作
      tbody
        tr(v-for="(config, index) in configs" :key="config")
          td: SettingTableTextField(v-model="config.user.name" :always-editable="config.new")
          td: SettingTableSelectBox(v-model="config.chatToolUserId")
          td: SettingTableSelectBox(v-model="config.todoAppUserId")
          td: v-btn(@click.stop="deleteRow(index)" prepend-icon="mdi-delete" variant="outlined" color="error") 削除
    p(v-else) 従業員が登録されていません。
    v-btn.mt-2(@click.stop="addRow" prepend-icon="mdi-plus" color="primary") 従業員を追加
</template>

<script setup lang="ts">
type Config = {
  user: User;
  chatToolUserId: string | null;
  todoAppUserId: string | null;
  new: boolean;
};
type User = {
  id?: number;
  name: string;
};

useHead({
  title: "従業員の紐付け"
});

const configs = ref<Config[]>([
  { user: { id: 1, name: "阪田 直樹" }, chatToolUserId: "hoge", todoAppUserId: "fuga", new: false },
  { user: { id: 2, name: "中島 慎治" }, chatToolUserId: "hoge", todoAppUserId: "fuga", new: false },
  { user: { id: 3, name: "渡邉 裕介" }, chatToolUserId: "hoge", todoAppUserId: "fuga", new: false }
]);

const addRow = () => {
  configs.value.push({
    user: { name: "" },
    chatToolUserId: null,
    todoAppUserId: null,
    new: true
  });
};
const deleteRow = (index: number) => {
  configs.value.splice(index, 1);
};
</script>

<style scoped lang="sass">
$widths: 40, 80, 120, 160, 200, 240, 280
@each $width in $widths
  .w-#{$width}px
    min-width: #{$width}px
</style>
