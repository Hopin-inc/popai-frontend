import { ApiResponse, SelectItem } from "~/types/common";
import { InstallLineworksInfo } from "~/types/settings";
import { fetcher } from "~/apis/base-api";

export const installLineworks = async (
  info: InstallLineworksInfo,
) => {
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "installLineworks",
    fetcher("/line-works/install", {
      method: "POST",
      body: { ...info },
    }),
  );
  if (data.value && !error.value) {
    return data.value;
  }
  return null;
};

export const updateLineworksInstall = async (
  botId: string,
  botSecret: string,
) => {
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "updateLineworksInstall",
    fetcher("/line-works/install", {
      method: "PATCH",
      body: { bot_id: botId, bot_secret: botSecret },
    }),
  );
  if (data.value && !error.value) {
    return data.value;
  }
  return null;
};
