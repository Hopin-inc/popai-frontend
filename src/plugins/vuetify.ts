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
            primary: "#598B15",
            secondary: "#1F3007",
            accent: "#85BB41",
            error: "#C73936",
            warning: "#DDAB31",
            info: "#2AA7AC",
            success: "#B0C62E",
            background: "#FCFBF6",
          },
          dark: false,
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
