import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "~/assets/sass/variables.sass";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: "#073ef3",
          },
          dark: false,
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});