import { type Ref } from "vue";

export const useLoading = () => {
  const loading = useState<boolean>("loading", () => false);

  const start = (state: Ref<boolean>) => {
    return () => state.value = true;
  };

  const finish = (state: Ref<boolean>) => {
    return () => state.value = false;
  };

  return {
    loading,
    startLoading: start(loading),
    finishLoading: finish(loading),
  };
}