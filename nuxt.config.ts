// https://nuxt.com/docs/api/configuration/nuxt-config

import "@nuxtjs/google-fonts";

export default defineNuxtConfig({
  ssr: false,
  devServer: {
    port: 8000
  },
  srcDir: "src",
  typescript: {
    shim: false
  },
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/sass/variables.sass",
    "~/assets/sass/style.sass"
  ],
  build: {
    transpile: [
      "vuetify"
    ],
  },
  modules: [
    "@nuxtjs/google-fonts"
  ],
  components: [
    { path: "~/components/atoms/", prefix: undefined },
    { path: "~/components/molecules/", prefix: undefined },
    { path: "~/components/organisms/", prefix: undefined }
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      clientBaseUrl: process.env.CLIENT_BASE_URL,
      identityApiKey: process.env.IDENTITY_API_KEY,
    }
  },
  app: {
    head: {
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.ico" },
      ],
    },
  },
  googleFonts: {
    families: {
      "Noto+Sans+JP": true,
      Roboto: true
    }
  }
});
