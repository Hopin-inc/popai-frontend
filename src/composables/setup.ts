import { type Ref } from "vue";
import { Feature } from "~/types/settings";
import { ReadonlyArrayRef, ReadonlyRef } from "~/types/utils";

interface UseSetup {
  currentStep: ReadonlyRef<number | null>;
  setupTodoAppId: ReadonlyRef<number | null>;
  setupChatToolId: ReadonlyRef<number | null>;
  setupFeatures: ReadonlyArrayRef<string>;
  setCurrentStep: (step: number | null) => void;
  setSetupTodoAppId: (todoAppId: number | null) => void;
  setSetupChatToolId: (chatToolId: number | null) => void;
  addSetupFeature: (feature: Feature) => void;
  deleteSetupFeature: (feature: Feature) => void;
}

export const useSetup = (): UseSetup => {
  const currentStep = useState<number | null>("currentStep", () => null);
  const setupTodoAppId = useState<number | null>("setupTodoAppId", () => null);
  const setupChatToolId = useState<number | null>("setupChatToolId", () => null);
  const setupFeatures = useState<Feature[]>("setupFeatures", () => []);

  const setCurrentStep = (state: Ref<number | null>) => {
    return (step: number | null) => {
      currentStep.value = step;
    };
  };

  const setSetupTodoAppId = (state: Ref<number | null>) => {
    return (todoAppId: number | null) => {
      setupTodoAppId.value = todoAppId;
    };
  };

  const setSetupChatToolId = (state: Ref<number | null>) => {
    return (chatToolId: number | null) => {
      setupChatToolId.value = chatToolId;
    };
  };

  const addSetupFeature = (state: Ref<Feature[]>) => {
    return (feature: Feature) => {
      if (setupFeatures.value.find(f => f === feature) === undefined) {
        setupFeatures.value.push(feature);
      }
    };
  };

  const deleteSetupFeature = (state: Ref<Feature[]>) => {
    return (feature: Feature) => {
      const index = setupFeatures.value.findIndex(f => f === feature);
      if (index !== -1) {
        setupFeatures.value.splice(index, 1);
      }
    };
  };

  return {
    currentStep: readonly(currentStep),
    setupTodoAppId: readonly(setupTodoAppId),
    setupChatToolId: readonly(setupChatToolId),
    setupFeatures: readonly(setupFeatures),
    setCurrentStep: setCurrentStep(currentStep),
    setSetupTodoAppId: setSetupTodoAppId(setupTodoAppId),
    setSetupChatToolId: setSetupChatToolId(setupChatToolId),
    addSetupFeature: addSetupFeature(setupFeatures),
    deleteSetupFeature: deleteSetupFeature(setupFeatures),
  };
};
