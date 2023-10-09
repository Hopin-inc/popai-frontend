import { type Ref } from "vue";
import { Feature } from "~/types/settings";
import { ReadonlyArrayRef, ReadonlyRef } from "~/types/utils";
import { ChatToolId, ChatToolName, TodoAppId, TodoAppName } from "~/consts/enum";
import { ExternalServiceLogos } from "~/consts/images";

interface UseSetup {
  currentStep: ReadonlyRef<number | null>;
  setCurrentStep: (step: number | null) => void;

  setupTodoAppId: ReadonlyRef<number>;
  setupTodoAppName: ComputedRef<string>;
  setupTodoAppIconSrc: ComputedRef<string>;
  setSetupTodoAppId: (todoAppId: number) => void;

  setupChatToolId: ReadonlyRef<number>;
  setupChatToolName: ComputedRef<string>;
  setupChatToolIconSrc: ComputedRef<string>;
  setSetupChatToolId: (todoAppId: number) => void;

  setupFeatures: ReadonlyArrayRef<string>;
  addSetupFeature: (feature: Feature) => void;
  deleteSetupFeature: (feature: Feature) => void;
}

export const useSetup = (): UseSetup => {
  const currentStep = useState<number | null>("currentStep", () => null);
  // TODO デフォルトを未選択に戻す
  const setupTodoAppId = useState<number>("setupTodoAppId", () => 3);
  const setupChatToolId = useState<number>("setupChatToolId", () => 2);
  const setupFeatures = useState<Feature[]>("setupFeatures", () => []);

  const setupTodoAppName = computed(() => {
    switch (setupTodoAppId.value) {
      case TodoAppId.NOTION:
      case TodoAppId.BACKLOG:
      case TodoAppId.SPREADSHEET:
        return TodoAppName[setupTodoAppId.value];
      default:
        return "";
    }
  });
  const setupChatToolName = computed(() => {
    switch (setupChatToolId.value) {
      case ChatToolId.SLACK:
      case ChatToolId.LINEWORKS:
        return ChatToolName[setupChatToolId.value];
      default:
        return "";
    }
  });

  const setupTodoAppIconSrc = computed(() => {
    switch (setupTodoAppId.value) {
      case TodoAppId.NOTION:
        return ExternalServiceLogos.NOTION;
      case TodoAppId.BACKLOG:
        return ExternalServiceLogos.BACKLOG;
      case TodoAppId.SPREADSHEET:
        return ExternalServiceLogos.SPREADSHEET;
      default:
        return "";
    }
  });
  const setupChatToolIconSrc = computed(() => {
    switch (setupChatToolId.value) {
      case ChatToolId.SLACK:
        return ExternalServiceLogos.SLACK;
      case ChatToolId.LINEWORKS:
        return ExternalServiceLogos.LINEWORKS;
      default:
        return "";
    }
  });

  const setCurrentStep = (state: Ref<number | null>) => {
    return (step: number | null) => {
      currentStep.value = step;
    };
  };

  const setSetupTodoAppId = (todoAppId: number) => {
    setupTodoAppId.value = todoAppId;
  };

  const setSetupChatToolId = (chatToolId: number) => {
    setupChatToolId.value = chatToolId;
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
    setCurrentStep: setCurrentStep(currentStep),

    setupTodoAppId,
    setupTodoAppName,
    setSetupTodoAppId,
    setupTodoAppIconSrc,

    setupChatToolId,
    setupChatToolName,
    setSetupChatToolId,
    setupChatToolIconSrc,

    setupFeatures: readonly(setupFeatures),
    addSetupFeature: addSetupFeature(setupFeatures),
    deleteSetupFeature: deleteSetupFeature(setupFeatures),
  };
};
