import { LocationQuery } from "vue-router";
import { ApiResponse } from "~/types";
import { fetcher } from "~/apis/baseApi";
import { StatusCodes } from "~/utils/status-codes";

export const getAddSlackUrl = async (): Promise<string | void> => {
  const { data, error } = await useAsyncData<ApiResponse<{ url: string }>>(
    "getAddSlackUrl",
    fetcher("/slack/install", { method: "GET" })
  );
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data.url;
    } else {
      console.log(data.value);
    }
  } else if (error.value) {
    console.error(error.value);
  }
};

export const redirectToSlack = async (query: LocationQuery): Promise<unknown> => {
  const { data, error } = await useAsyncData<ApiResponse<{ url: string }>>(
    "redirectToSlack",
    fetcher("/slack/oauth_redirect", { method: "GET", query })
  );
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data.url;
    } else {
      console.log(data.value);
    }
  } else if (error.value) {
    console.error(error.value);
  }
};
