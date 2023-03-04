import { fetcher } from "~/apis/baseApi";
import { AccountInfo } from "~/types/auth";

export const signIn = async (idToken: string): Promise<AccountInfo | void> => {
  const { data, error } = await useAsyncData<AccountInfo>("signIn", fetcher("/auth/login", {
    method: "GET",
    headers: { "Authorization": `Bearer ${ idToken }` },
  }));
  if (data.value && !error.value) {
    return data.value;
  } else if (error.value) {
    console.error(error.value);
  }
}

export const signOut = async () => {
  const { token } = useAuth()
  const { data, error } = await useAsyncData<void>("signOut", fetcher("/auth/logout", {
    method: "GET",
    headers: { "Authorization": `Bearer ${ token }` },
  }));
  if (data.value && !error.value) {
    return data.value;
  } else if (error.value) {
    console.error(error.value);
  }
}