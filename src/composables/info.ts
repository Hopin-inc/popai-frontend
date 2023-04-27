import { type Ref } from "vue";
import { getTodoAppAccounts, getTodoAppBoards, getTodoApp } from "~/apis/todo-app";
import { getChatToolAccounts, getChatToolChannels, getChatTool } from "~/apis/chat-tool";
import { ChatToolInfo, TodoAppInfo } from "~/types/settings";
import { SelectItem } from "~/types/common";

export const useInfo = () => {
  const todoApp = useState<TodoAppInfo | null>("todoApp");
  const chatTool = useState<ChatToolInfo | null>("chatTool");
  const todoAppAccounts = useState<SelectItem<string>[]>("todoAppAccounts", () => []);
  const chatToolAccounts = useState<SelectItem<string>[]>("chatToolAccounts", () => []);
  const todoAppBoards = useState<SelectItem<string>[]>("todoAppBoards", () => []);
  const chatToolChannels = useState<SelectItem<string>[]>("chatToolChannels", () => []);

  const connected = computed(() => todoAppConnected.value && chatToolConnected.value);
  const todoAppConnected = computed(() => !!todoApp.value);
  const chatToolConnected = computed(() => !!chatTool.value);
  const todoAppId = computed(() => todoApp.value?.todoAppId ?? null);
  const chatToolId = computed(() => chatTool.value?.chatToolId ?? null);

  const fetchTodoAppInfo = (state: Ref<TodoAppInfo | null>) => {
    return async () => {
      state.value = await getTodoApp();
    };
  };
  const fetchChatToolInfo = (state: Ref<ChatToolInfo | null>) => {
    return async () => {
      state.value = await getChatTool();
    };
  };
  const fetchTodoAppAccounts = (state: Ref<SelectItem<string>[]>) => {
    return async () => {
      if (todoAppId.value) {
        state.value = await getTodoAppAccounts(todoAppId.value);
      }
    };
  };
  const fetchTodoAppBoards = (state: Ref<SelectItem<string>[]>) => {
    return async () => {
      if (todoAppId.value) {
        state.value = await getTodoAppBoards(todoAppId.value);
      }
    };
  };
  const fetchChatToolAccounts = (state: Ref<SelectItem<string>[]>) => {
    return async () => {
      if (chatToolId.value) {
        state.value = await getChatToolAccounts(chatToolId.value);
      }
    };
  };
  const fetchChatToolChannels = (state: Ref<SelectItem<string>[]>) => {
    return async () => {
      if (chatToolId.value) {
        state.value = await getChatToolChannels(chatToolId.value);
      }
    };
  };

  const fetchTodoApps = async () => {
    await fetchTodoAppInfo(todoApp)();
    await Promise.all([
      fetchTodoAppAccounts(todoAppAccounts)(),
      fetchTodoAppBoards(todoAppBoards)(),
    ]);
  };
  const fetchChatTools = async () => {
    await fetchChatToolInfo(chatTool)();
    await Promise.all([
      fetchChatToolAccounts(chatToolAccounts)(),
      fetchChatToolChannels(chatToolChannels)(),
    ]);
  };
  const fetchAll = async () => {
    await Promise.all([
      fetchTodoApps(),
      fetchChatTools(),
    ]);
  };

  return {
    implementedTodoApp: readonly(todoApp),
    implementedChatTool: readonly(chatTool),
    todoAppAccounts: readonly(todoAppAccounts),
    chatToolAccounts: readonly(chatToolAccounts),
    todoAppBoards: readonly(todoAppBoards),
    chatToolChannels: readonly(chatToolChannels),
    connected,
    implementedTodoAppId: todoAppId,
    implementedChatToolId: chatToolId,
    fetchAll,
  };
};
