import { ApiResponse } from "~/types/common";
import {
  ConfigCommon,
  ConfigDailyReport,
  ConfigFeatures,
  ConfigNotify,
  ConfigProspect,
  ConfigStatus,
} from "~/types/settings";
import { ConfigSetup } from "~/types/setup";
import { fetcher } from "~/apis/base-api";

export const getConfigStatus = async (): Promise<ConfigStatus> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigStatus>>(
    "getConfigStatus",
    fetcher("/config", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return {
    users: false,
    todoApp: false,
    todos: {
      enabled: false,
      isValid: false,
    },
    projects: {
      enabled: false,
      isValid: false,
    },
  };
};

export const getCommonConfig = async (): Promise<ConfigCommon | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigCommon | null>>(
    "getCommonConfig",
    fetcher("/config/common", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const updateCommonConfig = async (config: Partial<ConfigCommon>): Promise<ConfigCommon | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigCommon | null>>(
    "updateCommonConfig",
    fetcher("/config/common", { body: config, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getFeatures = async (): Promise<ConfigFeatures | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigFeatures | null>>(
    "getFeatures",
    fetcher("/config/features", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getDailyReportConfig = async (): Promise<ConfigDailyReport | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigDailyReport | null>>(
    "getDailyReportConfig",
    fetcher("/config/daily-report", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const updateDailyReportConfig = async (config: Partial<ConfigDailyReport>): Promise<ConfigDailyReport | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigDailyReport | null>>(
    "updateDailyReportConfig",
    fetcher("/config/daily-report", { body: config, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getNotifyConfig = async (): Promise<ConfigNotify | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigNotify | null>>(
    "getNotifyConfig",
    fetcher("/config/notify", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const updateNotifyConfig = async (config: Partial<ConfigNotify>): Promise<ConfigNotify | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigNotify | null>>(
    "updateNotifyConfig",
    fetcher("/config/notify", { body: config, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getProspectConfig = async (type: number): Promise<ConfigProspect | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigProspect | null>>(
    "getProspectConfig",
    fetcher(`/config/prospect?type=${ type }`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const updateProspectConfig = async (config: Partial<ConfigProspect>): Promise<ConfigProspect | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigProspect | null>>(
    "updateProspectConfig",
    fetcher("/config/prospect", { body: config, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getRemindConfig = async (type: number): Promise<ConfigProspect | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigProspect | null>>(
    "getRemindConfig",
    fetcher(`/config/remind?type=${ type }`, { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const updateRemindConfig = async (config: Partial<ConfigProspect>): Promise<ConfigProspect | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigProspect | null>>(
    "updateRemindConfig",
    fetcher("/config/remind", { body: config, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const getSetupConfig = async (): Promise<ConfigSetup | null> => {
  const { data, error } = await useAsyncData<ApiResponse<ConfigSetup | null>>(
    "getConfigSetup",
    fetcher("/config/setup", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value.data;
  }
  return null;
};

export const updateSetupConfig = async (config: Partial<ConfigSetup>): Promise<any> => {
  const { data, error } = await useAsyncData<ApiResponse<any>>(
    "updateSetupConfig",
    fetcher("/config/setup", { body: config, method: "PATCH" }),
  );
  if (data.value && !error.value) {
    return data.value;
  }
  return null;
};
