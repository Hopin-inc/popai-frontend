import { toQueryString } from "~/utils/common";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.server) {
    const { isLoggedIn } = useAuth();
    if (!isLoggedIn && (to.meta.layout === "default" || to.meta.layout === undefined)) {
      const redirectTo = `/login?${toQueryString({ redirect: to.fullPath })}`;
      await useRouter().push(redirectTo);
    }
  }
});
