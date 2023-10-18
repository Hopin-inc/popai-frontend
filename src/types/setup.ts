import { SetupFeatureId } from "~/consts/setup";

export type ISetupFeatureId = typeof SetupFeatureId[keyof typeof SetupFeatureId];

export type ConfigSetup = {
  currentStep: number | null;
  setupTodoAppId: number | null;
  setupChatToolId: number | null;
  setupFeatures: ISetupFeatureId[];
};

export type FeatureCheckBoxData = {
  title: string;
  description: string;
  checked: boolean;
  imgSrc: string;
  feature: ISetupFeatureId;
};
