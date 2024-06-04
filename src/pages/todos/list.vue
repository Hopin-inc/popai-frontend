<template lang="pug">
v-row
  v-col(cols="12")
    SetupTitle(
      title="タスク一覧",
      description="絞り込み検索",
    )
v-form
  v-row
    v-col(cols="12" sm="6" md="7")
      v-row
        v-col(cols="6")
          v-list-subheader ステータス
          v-select(
            v-model="filters.status"
            label="すべて"
            :items="todoStatus"
            item-value="id"
            item-title="name"
            bg-color="#f5f5f5"
            clearable)
        v-col(cols="6")
          v-list-subheader 担当者
          v-select(
            v-model="filters.assignee"
            label="すべて"
            item-value="id"
            item-title="name"
            :items="userList"
            bg-color="#f5f5f5"
            clearable)
    v-col(cols="12" sm="6" md="5")
      v-list-subheader 期日
      v-row
        v-col
          v-input-group.d-flex.align-center
            DateInput(
              v-model="filters.startDate"
              :place-holder="日付を選択"
            )
            span 〜
            DateInput(
              v-model="filters.endDate"
              :place-holder="日付を選択"
              :min-date="filters.startDate"
            )
v-data-table-server(
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="todoDatas?.items"
    :items-length="todoDatas?.meta.totalCount"
    @update:options="loadTodos"
  ).pb-10
  template(#item="{ item }")
    tr
      td.w-50 {{ truncatedText(item.props.title.name) }}
      td
        template(v-if="item.props.title.isDone")
          span 完了
        template(v-else-if="item.props.title.isClosed")
          span 保留
        template(v-else)
          span 未完了
      td.w-30
        template(v-if="listTodoUser(item.props.title.todoUsers).length")
          span {{ listTodoUser(item.props.title.todoUsers) }}
        template(v-else)
          span.text-grey-lighten-1 未設定
      td.text-no-wrap
        template(v-if="item.props.title.startDate && item.props.title.deadline")
          template(v-if="item.props.title.startDate == item.props.title.deadline")
            span {{ formatDateTime(item.props.title.deadline, "M/D") }}
          template(v-else)
            span {{ formatDateTime(item.props.title.startDate,"M/D") }} ~ {{ formatDateTime(item.props.title.deadline, "M/D")}}
        template(v-else)
          span.text-grey-lighten-1 未設定
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VDataTable } from "vuetify/labs/components";

import type { TodoFilter, TodoUser } from "~/types/todos";
import type { SelectItem } from "~/types/common";

import { formatDateTime } from "~/utils/datetime";
import { TodoStatus } from "~/consts/enum";
import { getList } from "~/apis/users";
type DataTableHeader = InstanceType<typeof VDataTable>["headers"];
type DataTableOptions= InstanceType<typeof VDataTable>["options"];

useHead({
  title: "タスク一覧",
});
const itemsPerPage = ref(10);
const { startLoading, finishLoading } = useLoading();

const {
  setupTodoAppId,
} = useSetup();

const {
  todoDatas,
  fetchTodos,
} = UseTodo();

const userList :Ref<SelectItem<string>[]> = ref<SelectItem<string>[]>([]);
const filters : Ref<TodoFilter> = ref<TodoFilter>({
  status: null,
  assignee: null,
  startDate: "",
  endDate: "",
});

const headers: Ref<DataTableHeader> = ref<DataTableHeader>([
  { title: "タスク名", align: "start", key: "name", sortable: false },
  { title: "ステータス", align: "start", key: "status", sortable: false },
  { title: "担当者", align: "start", key: "assignee", sortable: false },
  { title: "期日", align: "start", key: "expired", sortable: false },
]);

const todoStatus : Ref<SelectItem<string>[]> = ref<SelectItem<string>[]>([
  { id: TodoStatus.DONE, name: "完了" },
  { id: TodoStatus.CLOSED, name: "保留" },
  { id: TodoStatus.INCOMPLETE, name: "未完了" },
]);

const fetchAll = async () => {
  startLoading();
  if (setupTodoAppId.value) {
    await fetchTodos(setupTodoAppId.value, filters.value);
  }
  finishLoading();
};

onBeforeMount(async () => {
  startLoading();
  const userDatas = await getList();
  if (userDatas) {
    userList.value = userDatas;
  }
  finishLoading();
});

watch(() => [setupTodoAppId.value, filters.value], async (next) => {
  await fetchAll();
}, { deep: true });

const loadTodos = ({ page, itemsPerPage, sortBy }: DataTableOptions) => {
  filters.value = { ...filters.value, page, perPage: itemsPerPage, order: sortBy };
};

const listTodoUser = (todoUsers: TodoUser[]) => {
  return todoUsers
    .filter(todoUser => todoUser.user)
    .map(todoUser => todoUser.user?.name)
    .join(", ");
};

const truncatedText = (text: string) => {
  const maxLength = 50;

  return text.length > maxLength
    ? text.slice(0, maxLength) + "..."
    : text;
};

</script>
