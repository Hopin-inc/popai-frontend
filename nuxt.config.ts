// https://nuxt.com/docs/api/configuration/nuxt-config

import "@nuxtjs/google-fonts";
import type { NuxtPage } from "nuxt/schema";

export default defineNuxtConfig({
  ssr: false,
  devServer: {
    port: 8000,
  },
  srcDir: "src",
  typescript: {
    shim: false,
  },
  css: [
    "~/assets/main.scss",
    "@mdi/font/css/materialdesignicons.css",
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
    { path: "pages", pattern: "_components", prefix: undefined },
  ],
  hooks: {
    "pages:extend" (pages) {
      // アンダーバー(_)からはじまるディレクトリをrouteから除外
      function removePagesMatching (pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove: NuxtPage[] = [];
        pages.forEach((page) => {
          if (page.file == null) {
            return;
          }
          if (pattern.test(page.file)) {
            pagesToRemove.push(page);
          } else {
            removePagesMatching(pattern, page.children);
          }
        });
        pagesToRemove.forEach((page) => {
          pages.splice(pages.indexOf(page), 1);
        });
      }
      removePagesMatching(/\/_.*\//, pages);
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
      clientBaseUrl: process.env.CLIENT_BASE_URL,
      identityApiKey: process.env.IDENTITY_API_KEY,
      identityAuthDomain: process.env.IDENTITY_AUTH_DOMAIN,
    },
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
      "Noto+Sans+JP": [400, 700, 900],
      Lato: [400, 700, 900],
    },
  },
});
