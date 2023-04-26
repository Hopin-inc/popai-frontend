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
import { getUserReportingLines, updateUserReportingLines } from "~/apis/users";

type Config = {
  user: User;
  superiorUsers: number[];
};
type User = {
  id: string;
  name: string;
};

useHead({
  title: "タスク管理ツール連携",
});

const { startLoading, finishLoading } = useLoading();

const isInit = ref<boolean>(true);
const configs = ref<Config[]>([]);
const users = computed(() => configs.value.map(config => config.user));

onMounted(async () => {
  await init();
});
const init = async () => {
  startLoading();
  configs.value = await getUserReportingLines();
  configs.value.forEach((config, index) => {
    watch(() => config.superiorUsers, async () => {
      const { user, superiorUsers } = configs.value[index];
      await onSuperiorUsersChanged(user.id, superiorUsers);
    }, { deep: true });
  });
  isInit.value = false;
  finishLoading();
};

const onSuperiorUsersChanged = async (subordinateUserId: number, superiorUserIds: number[]) => {
  startLoading();
  await updateUserReportingLines(subordinateUserId, superiorUserIds);
  finishLoading();
};
</script>
