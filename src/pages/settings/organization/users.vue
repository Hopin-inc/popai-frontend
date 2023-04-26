<template lang="pug">
SettingCard(
  title="従業員の紐付け"
  subtitle="従業員を登録し、チャットツール・タスク管理ツールとの紐付けを設定します。"
)
  template(#content)
    v-table(v-if="configs.length && chatToolAccounts.length && todoAppAccounts.length").overflow-x-auto
      thead
        tr
          th.w-240px 従業員名
          th.w-200px Slackアカウント
          th.w-200px Notionアカウント
          th 操作
      tbody
        tr(v-for="(config, index) in configs" :key="config")
          td: SettingTableTextField(v-model="config.user.name" :always-editable="config.new")
          td: SettingTableSelectBox(v-model="config.chatToolUserId" :items="chatToolAccounts")
          td: SettingTableSelectBox(v-model="config.todoAppUserId" :items="todoAppAccounts")
          td: v-btn(@click.stop="deleteRow(index)" prepend-icon="mdi-delete" variant="outlined" color="error") 削除
    p(v-else-if="!isInit || !loading") 従業員が登録されていません。
    v-btn.mt-2(@click.stop="addRow" prepend-icon="mdi-plus" variant="text" color="primary") 従業員を追加
</template>

<script setup lang="ts">
import { updateChatToolUsers } from "~/apis/chat-tool";
import { updateTodoAppUser } from "~/apis/todo-app";
import { deleteUser, getUserConfigs, updateUser } from "~/apis/users";

type SelectItem = {
  id: number | string;
  name: string;
};
type Config = {
  user: User;
  chatToolUserId: string | null;
  todoAppUserId: string | null;
  new: boolean;
  index: number;
};
type User = {
  id?: string;
  name: string;
};

useHead({
  title: "従業員の紐付け",
});

const { startLoading, finishLoading, loading } = useLoading();
const { implementedChatToolId, implementedTodoAppId, chatToolAccounts, todoAppAccounts } = useInfo();
const isInit = ref<boolean>(true);
const configs = ref<Config[]>([]);

onMounted(async () => {
  await init();
});
watch(() => [implementedChatToolId.value, implementedTodoAppId.value], async () => {
  await init();
});
const init = async () => {
  if (isInit.value && implementedChatToolId.value && implementedTodoAppId.value) {
    isInit.value = false;
    startLoading();
    await fetchUserConfigs();
    finishLoading();
  }
};
const fetchUserConfigs = async () => {
  if (implementedChatToolId.value && implementedTodoAppId.value) {
    const userConfigs = await getUserConfigs(implementedChatToolId.value, implementedTodoAppId.value);
    userConfigs.forEach((config, index) => {
      configs.value.push(createConfig({
        ...config,
        chatToolUserId: config.chatToolUserId ?? null,
        todoAppUserId: config.todoAppUserId ?? null,
        index,
        new: false,
      }));
    });
  }
};

const createConfig = (config: Config) => {
  const reactiveUser = reactive({
    id: config.user.id,
    name: customRef((track, trigger) => ({
      get () {
        track();
        return config.user.name;
      },
      async set (next) {
        if (config.user.name !== next) {
          config.user.name = next;
          await onUserNameChanged(config.index);
        }
        trigger();
      },
    })),
  });
  return reactive({
    user: reactiveUser,
    chatToolUserId: customRef((track, trigger) => ({
      get () {
        track();
        return config.chatToolUserId;
      },
      async set (next) {
        if (config.chatToolUserId !== next) {
          config.chatToolUserId = next;
          await onChatToolUserIdChanged(config.index, next);
          trigger();
        }
      },
    })),
    todoAppUserId: customRef((track, trigger) => ({
      get () {
        track();
        return config.todoAppUserId;
      },
      async set (next) {
        if (config.todoAppUserId !== next) {
          config.todoAppUserId = next;
          await onTodoAppUserIdChanged(config.index, next);
          trigger();
        }
      },
    })),
    new: config.new,
    index: config.index,
  });
};
const onUserNameChanged = async (index: number) => {
  startLoading();
  await updateUserName(index);
  finishLoading();
};
const onChatToolUserIdChanged = async (index: number, next: string | null) => {
  startLoading();
  if (!configs.value[index].user.id) {
    await updateUserName(index);
  }
  const { id } = configs.value[index].user;
  if (implementedChatToolId.value && id && next) {
    await updateChatToolUsers(implementedChatToolId.value, id, next);
  }
  finishLoading();
};
const onTodoAppUserIdChanged = async (index: number, next: string | null) => {
  startLoading();
  if (!configs.value[index].user.id) {
    await updateUserName(index);
  }
  const { id } = configs.value[index].user;
  if (implementedTodoAppId.value && id && next) {
    await updateTodoAppUser(implementedTodoAppId.value, id, next);
  }
  finishLoading();
};

const updateUserName = async (index: number) => {
  const user = await updateUser(configs.value[index].user);
  if (user) {
    configs.value[index].user.id = user.id;
  }
};
const addRow = async () => {
  const index = configs.value.length;
  configs.value.push(createConfig({
    user: { name: "" },
    chatToolUserId: null,
    todoAppUserId: null,
    new: true,
    index,
  }));
  await onUserNameChanged(index);
};
const deleteRow = async (index: number) => {
  const agreed = confirm(`「${ configs.value[index].user.name }」さんを削除しますか？`);
  if (agreed) {
    const [{ user: deletedUser }] = configs.value.splice(index, 1);
    configs.value.forEach((config, index) => {
      config.index = index;
    });
    if (deletedUser?.id) {
      startLoading();
      await deleteUser(deletedUser.id);
      finishLoading();
    }
  }
};
</script>

<style scoped lang="sass">
$widths: 40, 80, 120, 160, 200, 240, 280
@each $width in $widths
  .w-#{$width}px
    min-width: #{$width}px
</style>
