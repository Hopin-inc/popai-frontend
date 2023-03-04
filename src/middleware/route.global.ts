export default defineNuxtRouteMiddleware(async (to, _from) => {
  switch (to.path) {
    case "/":
      return await navigateTo("/settings");
    case "/settings":
      return await navigateTo("/settings/connect");
    case "/settings/connect":
      return await navigateTo("/settings/connect/todo-app");
    case "/settings/organization":
      return await navigateTo("/settings/organization/users");
    case "/settings/notification":
      return await navigateTo("/settings/notification/common");
    default:
      return;
  }
});