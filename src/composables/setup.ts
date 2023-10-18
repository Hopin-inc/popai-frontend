import { type Ref } from "vue";
import { ISetupFeatureId, ConfigSetup } from "~/types/setup";
import { ReadonlyRef } from "~/types/utils";
import { ChatToolId, ChatToolName, TodoAppId, TodoAppName } from "~/consts/enum";
import { ExternalServiceLogos } from "~/consts/images";
import { getSetupConfig, updateSetupConfig } from "~/apis/config";

interface UseSetup {
  currentStep: ReadonlyRef<number | null>;
  setCurrentStep: (step: number | null) => void;

  setupTodoAppId: ReadonlyRef<number | null>;
  setupTodoAppName: ComputedRef<string>;
  setupTodoAppIconSrc: ComputedRef<string>;
  setSetupTodoAppId: (todoAppId: number) => void;

  setupChatToolId: ReadonlyRef<number | null>;
  setupChatToolName: ComputedRef<string>;
  setupChatToolIconSrc: ComputedRef<string>;
  setSetupChatToolId: (todoAppId: number) => void;

  setupFeatures: Ref<ISetupFeatureId[]>;
  addSetupFeature: (feature: ISetupFeatureId) => void;
  deleteSetupFeature: (feature: ISetupFeatureId) => void;

  fetchConfigSetup: () => Promise<void>;
}

export const useSetup = (): UseSetup => {
  const currentStep = useState<number | null>("currentStep", () => null);
  const setupTodoAppId = useState<number | null>("setupTodoAppId", () => null);
  const setupChatToolId = useState<number | null>("setupChatToolId", () => null);
  const setupFeatures = useState<ISetupFeatureId[]>("setupFeatures", () => []);

  const fetchConfigSetup = async () => {
    const data = await getSetupConfig();
    if (data) {
      currentStep.value = data.currentStep;
      setupTodoAppId.value = data.setupTodoAppId;
      setupChatToolId.value = data.setupChatToolId;
      setupFeatures.value = data.setupFeatures;
    }
  };

  const updateConfigSetup = async () => {
    await updateSetupConfig({
      currentStep: currentStep.value,
      setupTodoAppId: setupTodoAppId.value,
      setupChatToolId: setupChatToolId.value,
      setupFeatures: setupFeatures.value,
    });
  };

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

  const setCurrentStep = async (step: number | null) => {
    if (currentStep.value === step) { return; }
    currentStep.value = step;
    await updateConfigSetup();
  };

  const setSetupTodoAppId = async (todoAppId: number) => {
    if (setupTodoAppId.value === todoAppId) { return; }
    setupTodoAppId.value = todoAppId;
    await updateConfigSetup();
  };

  const setSetupChatToolId = async (chatToolId: number) => {
    if (setupChatToolId.value === chatToolId) { return; }
    setupChatToolId.value = chatToolId;
    await updateConfigSetup();
  };

  const addSetupFeature = async (feature: ISetupFeatureId) => {
    if (setupFeatures.value.find(f => f === feature) === undefined) {
      setupFeatures.value.push(feature);
    } else {
      return;
    }
    await updateConfigSetup();
  };

  const deleteSetupFeature = (feature: ISetupFeatureId) => {
    const index = setupFeatures.value.findIndex(f => f === feature);
    if (index !== -1) {
      setupFeatures.value.splice(index, 1);
    }
  };

  return {
    currentStep: readonly(currentStep),
    setCurrentStep,

    setupTodoAppId,
    setupTodoAppName,
    setSetupTodoAppId,
    setupTodoAppIconSrc,

    setupChatToolId,
    setupChatToolName,
    setSetupChatToolId,
    setupChatToolIconSrc,

    setupFeatures,
    addSetupFeature,
    deleteSetupFeature,

    fetchConfigSetup,
  };
};
