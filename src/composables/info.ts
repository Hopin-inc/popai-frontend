import { type Ref } from "vue";
import { getTodoApps } from "~/apis/todo-app";
import { getChatTools } from "~/apis/chat-tool";
import { ChatToolInfo, TodoAppInfo } from "~/types/settings";

export const useInfo = () => {
  const todoApps = useState<TodoAppInfo[]>("todoApps", () => []);
  const chatTools = useState<ChatToolInfo[]>("chatTools", () => []);

  const connected = computed(() => todoAppConnected && chatToolConnected);
  const todoAppConnected = computed(() => !!todoApps.value.length);
  const chatToolConnected = computed(() => !!chatTools.value.length);
  const todoAppId = computed(() => todoApps.value.length ? todoApps.value[0].todoAppId : null);
  const chatToolId = computed(() => chatTools.value.length ? chatTools.value[0].chatToolId : null);

  const fetchTodoApps = (state: Ref<TodoAppInfo[]>) => {
    return async () => {
      state.value = await getTodoApps();
    };
  };

  const fetchChatTools = (state: Ref<ChatToolInfo[]>) => {
    return async () => {
      state.value = await getChatTools();
    };
  };

  const fetchAll = async () => {
    await Promise.all([
      fetchTodoApps(todoApps)(),
      fetchChatTools(chatTools)()
    ]);
  };

  return {
    implementedTodoApps: readonly(todoApps),
    implementedChatTools: readonly(chatTools),
    connected,
    todoAppConnected,
    chatToolConnected,
    implementedTodoAppId: todoAppId,
    implementedChatToolId: chatToolId,
    fetchTodoApps: fetchTodoApps(todoApps),
    fetchChatTools: fetchChatTools(chatTools),
    fetchAll
  };
};
