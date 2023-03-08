import { toQueryString } from "~/utils/common";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn && (to.meta.layout === "default" || to.meta.layout === undefined)) {
    const redirectTo = from.meta.layout === "before-login"
      ? "/login"
      : `/login?${ toQueryString({ redirect: to.path }) }`;
    await useRouter().push(redirectTo);
  }
});