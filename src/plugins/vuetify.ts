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
            primary: "#2979FF",
            secondary: "#002C75",
            accent: "#448AFF",
            error: "#FF1744",
            warning: "#FFC400",
            info: "#607D8B",
            success: "#00C853",
            background: "#F4F8FF"
          },
          dark: false
        }
      }
    }
  });

  nuxtApp.vueApp.use(vuetify);
});
