import { toQueryString } from "~/utils/common";

export default defineNuxtRouteMiddleware((to, _from) => {
  if (!process.server) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn && (to.meta.layout === "default" || to.meta.layout === undefined)) {
      const redirectTo = `/login?${ toQueryString({ redirect: to.fullPath }) }`;
      return navigateTo(redirectTo);
    }
    switch (to.path) {
      case "/":
        return navigateTo("/settings/general");
      default:
        return;
    }
  }
});
