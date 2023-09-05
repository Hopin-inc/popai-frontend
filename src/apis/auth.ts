import { fetcher } from "~/apis/base-api";
import { AccountInfo } from "~/types/auth";
import { ApiResponse, SignUpInfo, EmailSignUpInfo } from "~/types/common";
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
  }
};

export const signInWithEmail = async (idToken: string): Promise<AccountInfo | void> => {
  const { data, error } = await useAsyncData<ApiResponse<AccountInfo>>(
    "signInWithEmail",
    fetcher("/auth/login/email", {
      method: "GET",
      headers: { Authorization: `Bearer ${ idToken }` },
    }));
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data;
    }
  }
};

export const signOut = async () => {
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signOut",
    fetcher("/auth/logout", { method: "GET" }),
  );
  if (data.value && !error.value) {
    return data.value;
  }
};

export const signUp = async (info: SignUpInfo) => {
  const { name } = info;
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signUp",
    fetcher("/auth/signup", {
      method: "POST",
      body: { name },
    }),
  );
  if (data.value && !error.value) {
    return data.value;
  }
};

export const signUpWithEmail = async (info: EmailSignUpInfo) => {
  const { uid, company } = info;
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signUpWithEmail",
    fetcher("/auth/signup/email", {
      method: "POST",
      body: { uid, company },
    }),
  );
  if (data.value && !error.value) {
    return data.value;
  }
};
