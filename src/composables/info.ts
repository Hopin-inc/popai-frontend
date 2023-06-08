import { ComputedRef, type Ref } from "vue";
import { getTodoAppAccounts, getTodoAppBoards, getTodoApp } from "~/apis/todo-app";
import { getChatToolAccounts, getChatToolChannels, getChatTool } from "~/apis/chat-tool";
import { ChatToolInfo, ConfigStatus, TodoAppInfo } from "~/types/settings";
import { SelectItem } from "~/types/common";
import { ReadonlyArrayRef, ReadonlyRef } from "~/types/utils";
import { getConfigStatus } from "~/apis/config";

interface UseInfo {
  configStatus: ReadonlyRef<ConfigStatus>;
  implementedTodoApp: ReadonlyRef<TodoAppInfo | null>;
  implementedChatTool: ReadonlyRef<ChatToolInfo | null>;
  todoAppAccounts: ReadonlyArrayRef<SelectItem<string>>;
  chatToolAccounts: ReadonlyArrayRef<SelectItem<string>>;
  todoAppBoards: ReadonlyArrayRef<SelectItem<string>>;
  chatToolChannels: ReadonlyArrayRef<SelectItem<string>>;
  connected: ComputedRef<boolean>;
  todoAppConfigured: ComputedRef<boolean>;
  usersConfigured: ComputedRef<boolean>;
  projectsEnabled: ComputedRef<boolean>;
  todosEnabled: ComputedRef<boolean>;
  implementedTodoAppId: ComputedRef<number | null>;
  implementedChatToolId: ComputedRef<number | null>;
  fetchConfigStatus: () => Promise<void>;
  fetchAll: () => Promise<void>;
}

export const useInfo = (): UseInfo => {
  const configStatus = useState<ConfigStatus>("configStatus", () => ({
    users: false,
    todoApp: false,
    projects: {
      enabled: false,
      isValid: false,
    },
    todos: {
      enabled: false,
      isValid: false,
    },
  }));
  const todoApp = useState<TodoAppInfo | null>("todoApp");
  const chatTool = useState<ChatToolInfo | null>("chatTool");
  const todoAppAccounts = useState<SelectItem<string>[]>("todoAppAccounts", () => []);
  const chatToolAccounts = useState<SelectItem<string>[]>("chatToolAccounts", () => []);
  const todoAppBoards = useState<SelectItem<string>[]>("todoAppBoards", () => []);
  const chatToolChannels = useState<SelectItem<string>[]>("chatToolChannels", () => []);

  const connected = computed(() => todoAppConnected.value && chatToolConnected.value);
  const todoAppConfigured = computed(() => configStatus.value.todoApp);
  const usersConfigured = computed(() => configStatus.value.users);
  const projectsEnabled = computed(() => configStatus.value.projects.enabled);
  const todosEnabled = computed(() => configStatus.value.todos.enabled);
  const todoAppConnected = computed(() => !!todoApp.value);
  const chatToolConnected = computed(() => !!chatTool.value);
  const todoAppId = computed(() => todoApp.value?.todoAppId ?? null);
  const chatToolId = computed(() => chatTool.value?.chatToolId ?? null);

  const fetchConfigStatus = (state: Ref<ConfigStatus>) => {
    return async () => {
      state.value = await getConfigStatus();
    };
  };
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
      fetchConfigStatus(configStatus)(),
      fetchTodoApps(),
      fetchChatTools(),
    ]);
  };

  return {
    configStatus: readonly(configStatus),
    implementedTodoApp: readonly(todoApp),
    implementedChatTool: readonly(chatTool),
    todoAppAccounts: readonly(todoAppAccounts),
    chatToolAccounts: readonly(chatToolAccounts),
    todoAppBoards: readonly(todoAppBoards),
    chatToolChannels: readonly(chatToolChannels),
    connected,
    todoAppConfigured,
    usersConfigured,
    projectsEnabled,
    todosEnabled,
    implementedTodoAppId: todoAppId,
    implementedChatToolId: chatToolId,
    fetchConfigStatus: fetchConfigStatus(configStatus),
    fetchAll,
  };
};
