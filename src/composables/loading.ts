import { type Ref } from "vue";

export const useLoading = () => {
  const loadingCount = useState<number>("loading", () => 0);
  const loading = computed(() => !!loadingCount.value);

  const start = (state: Ref<number>) => {
    return () => {
      state.value++;
    };
  };

  const finish = (state: Ref<number>) => {
    return () => {
      state.value--;
    };
  };

  return {
    loading: loading,
    startLoading: start(loadingCount),
    finishLoading: finish(loadingCount),
  };
};
