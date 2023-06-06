import { ComputedRef, type Ref } from "vue";

interface UseLoading {
  loading: ComputedRef<boolean>;
  startLoading: () => void;
  finishLoading: () => void;
}

export const useLoading = (): UseLoading => {
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
    loading,
    startLoading: start(loadingCount),
    finishLoading: finish(loadingCount),
  };
};
