import { ApiResponse, SelectItem } from "~/types/common";
import { ChatToolInfo } from "~/types/settings";
import { fetcher } from "~/apis/base-api";
import { ValueOf } from "~/types/utils";
import { ChatToolId } from "~/consts/enum";

export const getChatTools = async (): Promise<ChatToolInfo[]> => {
  const { data, error } = await useAsyncData<ApiResponse<ChatToolInfo[]>>(
    "getChatTools",
    fetcher("/chat-tool", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const getChatToolAccounts = async (chatToolId: ValueOf<typeof ChatToolId>): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getChatToolAccounts-${ chatToolId }`,
    fetcher(`/chat-tool/${ chatToolId }/accounts`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const updateChatToolUsers = async (
  chatToolId: ValueOf<typeof ChatToolId>,
  userId: number,
  appUserId: string,
): Promise<SelectItem<string>[]> => {
  const body = { id: appUserId };
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `updateChatToolUsers-${ chatToolId }-${ appUserId }`,
    fetcher(`/chat-tool/${ chatToolId }/users/${ userId }`, { body, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const getChatToolChannels = async (chatToolId: ValueOf<typeof ChatToolId>): Promise<SelectItem<string>[]> => {
  const { data, error } = await useAsyncData<ApiResponse<SelectItem<string>[]>>(
    `getChatToolChannels-${ chatToolId }`,
    fetcher(`/chat-tool/${ chatToolId }/channels`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};
