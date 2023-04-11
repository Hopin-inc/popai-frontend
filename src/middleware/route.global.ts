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
        return navigateTo("/settings");
      case "/settings":
        return navigateTo("/settings/connect");
      case "/settings/connect":
        return navigateTo("/settings/connect/todo-app");
      case "/settings/organization":
        return navigateTo("/settings/organization/users");
      case "/settings/notification":
        return navigateTo("/settings/notification/common");
      default:
    }
  }
});
