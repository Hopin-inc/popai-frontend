import { ReadonlyRef } from "~/types/utils";
import { getTodos } from "~/apis/todos";
import { TodoData, TodoFilter } from "~/types/todos";
import { PaginateResponse } from "~/types/pagination";

interface UseTodo {
  todoDatas: ReadonlyRef<PaginateResponse<TodoData[]> | null>;
  fetchTodos: (todoAppId: number, query: TodoFilter) => Promise<void>;
}

export const UseTodo = (): UseTodo => {
  const todos = useState<PaginateResponse<TodoData[]> | null>("todos", () => null);
  const todoDatas = computed(() => todos.value);

  const fetchTodos = async (todoAppId: number, query: TodoFilter) => {
    const data = await getTodos(todoAppId, query);
    if (data) {
      todos.value = data;
    }
  };

  return {
    todoDatas,
    fetchTodos,
  };
};
