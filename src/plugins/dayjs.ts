import dayjs from "dayjs";
import "dayjs/locale/ja";

dayjs.locale("ja");

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("dayjs", dayjs);
});

declare module "#app" {
  interface NuxtApp {
    $dayjs(date?: dayjs.ConfigType): dayjs.Dayjs;
  }
}
declare module "vue" {
  interface ComponentCustomProperties {
    $dayjs(date?: dayjs.ConfigType): dayjs.Dayjs;
  }
}

export const $dayjs = dayjs;
