import { ApiResponse } from "~/types/common";
import { fetcher } from "~/apis/base-api";
import { TodoData, TodoFilter } from "~/types/todos";
import { PaginateResponse } from "~/types/pagination";

export const getTodos = async (todoAppId:number, query: TodoFilter): Promise<PaginateResponse<TodoData[]> | null> => {
  const { data, error } = await useAsyncData<ApiResponse<PaginateResponse<TodoData[]>>>(
    `getTodos-${ todoAppId }`,
    fetcher(`/todos/${ todoAppId }`, { query, method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }

  return null;
};
