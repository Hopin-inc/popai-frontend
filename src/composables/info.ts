import { type Ref } from "vue";
import { getTodoAppAccounts, getTodoAppBoards, getTodoApps } from "~/apis/todo-app";
import { getChatToolAccounts, getChatToolChannels, getChatTools } from "~/apis/chat-tool";
import { ChatToolInfo, TodoAppInfo } from "~/types/settings";
import { SelectItem } from "~/types/common";

export const useInfo = () => {
  const todoApps = useState<TodoAppInfo[]>("todoApps", () => []);
  const chatTools = useState<ChatToolInfo[]>("chatTools", () => []);
  const todoAppAccounts = useState<SelectItem<string>[]>("todoAppAccounts", () => []);
  const chatToolAccounts = useState<SelectItem<string>[]>("chatToolAccounts", () => []);
  const todoAppBoards = useState<SelectItem<string>[]>("todoAppBoards", () => []);
  const chatToolChannels = useState<SelectItem<string>[]>("chatToolChannels", () => []);

  const connected = computed(() => todoAppConnected.value && chatToolConnected.value);
  const todoAppConnected = computed(() => !!todoApps.value.length);
  const chatToolConnected = computed(() => !!chatTools.value.length);
  const todoAppId = computed(() => todoApps.value.length ? todoApps.value[0].todoAppId : null);
  const chatToolId = computed(() => chatTools.value.length ? chatTools.value[0].chatToolId : null);

  const fetchTodoAppInfo = (state: Ref<TodoAppInfo[]>) => {
    return async () => {
      state.value = await getTodoApps();
    };
  };
  const fetchChatToolInfo = (state: Ref<ChatToolInfo[]>) => {
    return async () => {
      state.value = await getChatTools();
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
    await fetchTodoAppInfo(todoApps)();
    await Promise.all([
      fetchTodoAppAccounts(todoAppAccounts)(),
      fetchTodoAppBoards(todoAppBoards)(),
    ]);
  }
  const fetchChatTools = async () => {
    await fetchChatToolInfo(chatTools)();
    await Promise.all([
      fetchChatToolAccounts(chatToolAccounts)(),
      fetchChatToolChannels(chatToolChannels)(),
    ]);
  }
  const fetchAll = async () => {
    await Promise.all([
      fetchTodoApps(),
      fetchChatTools(),
    ]);
  };

  return {
    implementedTodoApps: readonly(todoApps),
    implementedChatTools: readonly(chatTools),
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
