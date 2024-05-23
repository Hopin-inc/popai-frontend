import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      ...labsComponents,
    },
    directives,
    theme: {
      themes: {
        light: {
          colors: {
            primary: "#1976D2",
            secondary: "#00331A",
            accent: "#1ABD65",
            error: "#DB3435",
            warning: "#C6B13E",
            info: "#219B9D",
            success: "#1ABD65",
            background: "#F5F5F5",
          },
          dark: false,
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
