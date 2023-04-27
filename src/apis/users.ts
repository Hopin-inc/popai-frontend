import { ApiResponse } from "~/types/common";
import { fetcher } from "~/apis/base-api";
import { User, UserConfig, UserReportingLine } from "~/types/settings";
import { IdOptional, ValueOf } from "~/types/utils";
import { ChatToolId, TodoAppId } from "~/consts/enum";

export const updateUser = async (user: IdOptional<User>): Promise<User | null> => {
  const { data, error } = await useAsyncData<ApiResponse<User>>(
    `updateUser-${ user.id }`,
    fetcher("/users", { body: user, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const deleteUser = async (id: string): Promise<void> => {
  await useAsyncData<ApiResponse<undefined>>(
    `updateUser-${ id }`,
    fetcher(`/users/${ id }`, { method: "DELETE" }),
  );
};

export const getUserConfigs = async (
  chatToolId: ValueOf<typeof ChatToolId>,
  todoAppId: ValueOf<typeof TodoAppId>,
): Promise<UserConfig[]> => {
  const query = { chatToolId, todoAppId };
  const { data, error } = await useAsyncData<ApiResponse<UserConfig[]>>(
    `getUserConfigs-${ chatToolId }-${ todoAppId }`,
    fetcher("/users/configs", { query, method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const getUserReportingLines = async (): Promise<UserReportingLine[]> => {
  const { data, error } = await useAsyncData<ApiResponse<UserReportingLine[]>>(
    "getUserReportingLines",
    fetcher("/users/reporting-lines", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return [];
};

export const updateUserReportingLines = async (
  subordinateUserId: string,
  superiorUserIds: string[],
): Promise<void> => {
  await useAsyncData<ApiResponse<void>>(
    `updateUserReportingLines-${ subordinateUserId }`,
    fetcher(`/users/reporting-lines/${ subordinateUserId }`, { body: superiorUserIds, method: "PATCH" }),
  );
};
