import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail } from "@firebase/auth";
import { fetcher } from "~/apis/baseApi";
import { AccountInfo } from "~/types/auth";
import { ApiResponse, SignUpInfo } from "~/types";
import { StatusCodes } from "~/utils/status-codes";

export const getLoggedInAccount = async (): Promise<AccountInfo | void> => {
  const { data, error } = await useAsyncData<ApiResponse<AccountInfo>>(
    "checkAuthState",
    fetcher("/auth", { method: "GET" })
  );
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data;
    } else {
      console.log(data.value);
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
      headers: { Authorization: `Bearer ${idToken}` }
    }
    ));
  if (data.value && !error.value) {
    if (data.value.status === StatusCodes.OK) {
      return data.value.data;
    } else {
      console.log(data.value);
    }
  } else if (error.value) {
    console.error(error.value);
  }
};

export const signOut = async () => {
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signOut",
    fetcher("/auth/logout", { method: "GET" })
  );
  if (data.value && !error.value) {
    return data.value;
  } else if (error.value) {
    console.error(error.value);
  }
};

export const signUp = async (info: SignUpInfo) => {
  const auth = getAuth();
  const { email, organization, name, password } = info;
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = credential.user;
  const { data, error } = await useAsyncData<ApiResponse<null>>(
    "signUp",
    fetcher("/accounts", {
      method: "POST",
      body: { email, organization, name, uid }
    })
  );
  if (data.value && !error.value) {
    return data.value;
  } else if (error.value) {
    console.error(error.value);
  }
};

export const reset = async (email: string) => {
  const config = useRuntimeConfig();
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email, {
    url: `${config.public.clientBaseUrl}/login`,
    handleCodeInApp: false
  });
};
