import { NitroFetchOptions } from "nitropack";
import { FetchContext } from 'ofetch'
import { StatusCodes } from "~/utils/status-codes";
import { toQueryString } from "~/utils/common";

const onRequest = ({ request, options }: FetchContext) => {
  console.info('[fetch request]', request, options);
}

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

const defaultOptions: NitroFetchOptions<string> = {
  baseURL: "http://localhost:3000/api",  // FIXME
  parseResponse: JSON.parse,
  retry: 3,
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
};

export const fetcher = <ResT>(
  path: string,
  fetchOptions: NitroFetchOptions<string> = defaultOptions,
) => {
  return async () => await $fetch<ResT>(path, { ...defaultOptions, ...fetchOptions });
};