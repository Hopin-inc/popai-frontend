import { ApiResponse, SelectItem } from "~/types/common";
import { fetcher } from "~/apis/base-api";
import { ValueOf } from "~/types/utils";
import { TodoAppId } from "~/consts/enum";
import { Property, PropertyUsage, TodoAppInfo } from "~/types/settings";

export const getTodoApps = async (): Promise<TodoAppInfo[]> => {
  const { data, error } = await useAsyncData<ApiResponse<TodoAppInfo[]>>(
    "getTodoApps",
    fetcher("/todo-app", { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const getTodoAppAccounts = async (todoAppId: ValueOf<typeof TodoAppId>): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getTodoAppAccounts-${todoAppId}`,
    fetcher(`/todo-app/${todoAppId}/accounts`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const getTodoAppBoards = async (todoAppId: ValueOf<typeof TodoAppId>): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getTodoAppBoards-${todoAppId}`,
    fetcher(`/todo-app/${todoAppId}/boards`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const getTodoAppProperties = async (
  todoAppId: ValueOf<typeof TodoAppId>,
  boardId: string
): Promise<Property[]> => {
  const { data, error } = await useAsyncData<ApiResponse<Property[]>>(
    `getTodoAppProperties-${todoAppId}-${boardId}`,
    fetcher(`/todo-app/${todoAppId}/boards/${boardId}/properties`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const getTodoAppPropertyUsages = async (
  todoAppId: ValueOf<typeof TodoAppId>,
  boardId: string,
): Promise<PropertyUsage[]> => {
  const { data, error } = await useAsyncData<ApiResponse<PropertyUsage[]>>(
    `getTodoAppPropertyUsages-${todoAppId}-${boardId}`,
    fetcher(`/todo-app/${todoAppId}/boards/${boardId}/usages`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const updateTodoAppPropertyUsage = async (
  todoAppId: ValueOf<typeof TodoAppId>,
  usage: PropertyUsage
): Promise<PropertyUsage | null> => {
  const { data, error } = await useAsyncData<ApiResponse<PropertyUsage>>(
    `updateTodoAppPropertyUsage-${todoAppId}-${usage.id}_${usage.usage}`,
    fetcher(`/todo-app/${todoAppId}/usages`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return null;
};
