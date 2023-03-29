import { NitroFetchOptions } from "nitropack";
import { FetchContext } from "ofetch";
import { StatusCodes } from "~/utils/status-codes";
import { toQueryString } from "~/utils/common";

const onRequest = () => {};
const onRequestError = () => {};
const onResponse = () => {};
const onResponseError = async ({ response }: FetchContext) => {
  if (response?.status === StatusCodes.UNAUTHORIZED) {
    const { setUser } = useAuth();
    const { fullPath, meta } = useRoute();
    setUser(null);
    const redirectTo = meta.layout === "default" || meta.layout === undefined
      ? `/login?${toQueryString({ redirect: fullPath })}`
      : "/login";
    await useRouter().push(redirectTo);
  }
};

export const fetcher = <ResT>(
  path: string,
  fetchOptions: NitroFetchOptions<string> = {}
) => {
  const config = useRuntimeConfig();
  const defaultOptions: NitroFetchOptions<string> = {
    baseURL: config.public.apiBaseUrl,
    parseResponse: JSON.parse,
    retry: 3,
    credentials: "include",
    onRequest,
    onRequestError,
    onResponse,
    onResponseError
  };
  return async () => await $fetch<ResT>(path, { ...defaultOptions, ...fetchOptions });
};
