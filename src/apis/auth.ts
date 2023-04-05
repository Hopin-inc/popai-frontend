import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import { fetcher } from "~/apis/base-api";
import { AccountInfo } from "~/types/auth";
import { ApiResponse, SignUpInfo } from "~/types/common";
import { StatusCodes } from "~/utils/status-codes";

export const getLoggedInAccount = async (): Promise<AccountInfo | void> => {
  const { data, error } = await useAsyncData<ApiResponse<AccountInfo>>(
    "checkAuthState",
    fetcher("/auth/me", { method: "GET" }),
  );
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data;
    }
  } else if (error.value) {
    console.error(error.value);
  }
};

export const signIn = async (idToken: string): Promise<AccountInfo | void> => {
  const { data, error } = await useAsyncData<ApiResponse<AccountInfo>>(
    "signIn",
    fetcher("/auth/login", {
      method: "GET",
      headers: { Authorization: `Bearer ${ idToken }` },
    }));
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data;
    }
  } else if (error.value) {
    console.error(error.value);
  }
};

export const signOut = async () => {
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signOut",
    fetcher("/auth/logout", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value;
  } else if (error.value) {
    console.error(error.value);
  }
};

export const signUp = async (info: SignUpInfo) => {
  const { email, organization, name, password } = info;
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signUp",
    fetcher("/auth/signup", {
      method: "POST",
      body: { email, organization, name, password },
    }),
  );
  if (data.value && !error.value) {
    return data.value;
  } else if (error.value) {
    throw error.value;
  }
};

export const reset = async (email: string) => {
  const config = useRuntimeConfig();
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email, {
    url: `${ config.public.clientBaseUrl }/login`,
    handleCodeInApp: false,
  });
};
