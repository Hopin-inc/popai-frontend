import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: "#00A356",
            secondary: "#00331A",
            accent: "#1ABD65",
            error: "#DB3435",
            warning: "#C6B13E",
            info: "#219B9D",
            success: "#1ABD65",
            background: "#FAFFFC",
          },
          dark: false,
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
