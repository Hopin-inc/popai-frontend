import dayjs from "dayjs";
import "dayjs/locale/ja";

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.locale("ja");
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
