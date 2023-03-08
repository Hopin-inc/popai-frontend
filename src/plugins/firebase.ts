import { initializeApp } from "@firebase/app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  initializeApp({
    apiKey: config.public.identityApiKey,
    authDomain: config.public.identityAuthDomain,
  });
});