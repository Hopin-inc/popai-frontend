import { ApiResponse, SelectItem } from "~/types/common";
import { ChatToolInfo } from "~/types/settings";
import { fetcher } from "~/apis/base-api";
import { ValueOf } from "~/types/utils";
import { ChatToolId } from "~/consts/enum";

export const getChatTools = async (): Promise<ChatToolInfo[]> => {
  const { data, error } = await useAsyncData<ApiResponse<ChatToolInfo[]>>(
    "getChatTools",
    fetcher("/chat-tool", { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const getChatToolAccounts = async (chatToolId: ValueOf<typeof ChatToolId>): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getChatToolAccounts-${chatToolId}`,
    fetcher(`/chat-tool/${chatToolId}/accounts`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};

export const getChatToolChannels = async (chatToolId: ValueOf<typeof ChatToolId>): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getChatToolChannels-${chatToolId}`,
    fetcher(`/chat-tool/${chatToolId}/channels`, { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value.data;
  } else if (error.value) {
    console.error(error.value);
  }
  return [];
};
