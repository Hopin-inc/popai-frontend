export default defineNuxtPlugin(async () => {
  const { fetchAuthState } = useAuth();
  await fetchAuthState();
});
