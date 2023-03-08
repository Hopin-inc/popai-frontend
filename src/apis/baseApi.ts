import { NitroFetchOptions } from "nitropack";
import { FetchContext } from 'ofetch'
import { StatusCodes } from "~/utils/status-codes";
import { toQueryString } from "~/utils/common";

const onRequest = ({ request, options }: FetchContext) => {
  console.info('[fetch request]', request, options);
};

const onRequestError = ({ request, error }: FetchContext) => {
  console.error('[fetch request error]', request, error);
};

const onResponse = async ({ response }: FetchContext) => {
  console.info('[fetch response]', response);
};

const onResponseError = async ({ request, response }: FetchContext) => {
  console.error('[fetch response error]', request, response?.status, response?.body);
  if (response?.status === StatusCodes.UNAUTHORIZED) {
    const { setUser } = useAuth();
    const { path } = useRoute();
    setUser(null);
    const redirectTo = `/login?${ toQueryString({ redirect: path }) }`;
    await useRouter().push(redirectTo);
  }
};

export const fetcher = <ResT>(
  path: string,
  fetchOptions: NitroFetchOptions<string> = {},
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
    onResponseError,
  };
  return async () => await $fetch<ResT>(path, { ...defaultOptions, ...fetchOptions });
};