// https://nuxt.com/docs/api/configuration/nuxt-config

import "@nuxtjs/google-fonts";

export default defineNuxtConfig({
  devServer: {
    port: 8000,
  },
  srcDir: "src",
  typescript: {
    shim: false,
  },
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/sass/variables.sass",
  ],
  build: {
    transpile: [
      "vuetify",
    ],
  },
  modules: [
    "@nuxtjs/google-fonts",
  ],
  components: [
    { path: "~/components/atoms/", prefix: undefined },
    { path: "~/components/molecules/", prefix: undefined },
    { path: "~/components/organisms/", prefix: undefined },
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      identityApiKey: process.env.IDENTITY_API_KEY,
      identityAuthDomain: process.env.IDENTITY_AUTH_DOMAIN,
    },
  },
  googleFonts: {
    families: {
      "Noto+Sans+JP": true,
      "Roboto": true,
    }
  },
});
