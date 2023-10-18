export const SetupFeatureId = {
  REMIND: 1, // 遅延のリマインド
  PROSPECT: 2, // 進捗のシェア
} as const;

export const SetupFeatureName = {
  [SetupFeatureId.REMIND]: "遅延のリマインド",
  [SetupFeatureId.PROSPECT]: "進捗のシェア",
} as const;
