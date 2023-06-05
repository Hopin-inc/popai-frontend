import { ApiResponse, SelectItem } from "~/types/common";
import { fetcher } from "~/apis/base-api";
import { BoardConfig, Property, PropertyUsage, TodoAppInfo } from "~/types/settings";

export const getTodoApp = async (): Promise<TodoAppInfo | null> => {
  const { data, error } = await useAsyncData<ApiResponse<TodoAppInfo>>(
    "getTodoApps",
    fetcher("/todo-app", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getTodoAppAccounts = async (todoAppId: number): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getTodoAppAccounts-${ todoAppId }`,
    fetcher(`/todo-app/${ todoAppId }/accounts`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const updateTodoAppUser = async (
  todoAppId: number,
  userId: string,
  appUserId: string,
): Promise<SelectItem<string>[]> => {
  const body = { id: appUserId };
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `updateTodoAppUser-${ todoAppId }-${ userId }`,
    fetcher(`/todo-app/${ todoAppId }/users/${ userId }`, { body, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const getTodoAppBoards = async (todoAppId: number): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getTodoAppBoards-${ todoAppId }`,
    fetcher(`/todo-app/${ todoAppId }/boards`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const getBoardConfig = async (todoAppId: number): Promise<BoardConfig> => {
  const { data, error } = await useAsyncData<ApiResponse<BoardConfig>>(
    `getBoardConfig-${ todoAppId }`,
    fetcher(`/todo-app/${ todoAppId }/board`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return {
    boardId: null,
    projectRule: null,
  };
};

export const updateBoardConfig = async (
  todoAppId: number,
  boardId: string,
  projectRule?: number,
): Promise<void> => {
  const body = { boardId, projectRule };
  await useAsyncData<ApiResponse<void>>(
    `updateBoardConfig-${ todoAppId }`,
    fetcher(`/todo-app/${ todoAppId }/board`, { body, method: "PATCH" }),
  );
};

export const getTodoAppProperties = async (
  todoAppId: number,
  boardId: string,
): Promise<Property[]> => {
  const { data, error } = await useAsyncData<ApiResponse<Property[]>>(
    `getTodoAppProperties-${ todoAppId }-${ boardId }`,
    fetcher(`/todo-app/${ todoAppId }/boards/${ boardId }/properties`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const getTodoAppPropertyUsages = async (
  todoAppId: number,
  boardId: string,
): Promise<PropertyUsage[]> => {
  const { data, error } = await useAsyncData<ApiResponse<PropertyUsage[]>>(
    `getTodoAppPropertyUsages-${ todoAppId }-${ boardId }`,
    fetcher(`/todo-app/${ todoAppId }/boards/${ boardId }/usages`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const updateTodoAppPropertyUsage = async (
  todoAppId: number,
  boardId: string,
  usage: PropertyUsage,
): Promise<PropertyUsage | null> => {
  const { data, error } = await useAsyncData<ApiResponse<PropertyUsage>>(
    `updateTodoAppPropertyUsage-${ todoAppId }-${ usage.id }_${ usage.usage }`,
    fetcher(`/todo-app/${ todoAppId }/boards/${ boardId }/usages`, { body: usage, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};
