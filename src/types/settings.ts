import { SetOptional } from "type-fest";
import { SelectItem } from "~/types/common";
import { SetupFeatureId } from "~/consts/setup";

export type UserConfig = {
  user: SetOptional<User, "id">;
  chatToolUserId: string;
  todoAppUserId: string;
};

export type UserReportingLine = {
  user: User;
  superiorUsers: string[];
}

export type User = {
  id: string;
  name: string;
};

export type ChatToolInfo = {
  chatToolId: number;
  teamId: string;
};

export type TodoAppInfo = {
  todoAppId: number;
  workspaceId: string;
};

export type Property = {
  id: string;
  name: string;
  type: number;
  availableOptions?: SelectItem<string>[];
};

export type PropertyUsage = {
  id: number;
  property: string;
  usage: number;
  type: number;
  options?: string[];
  isChecked?: boolean;
};

export type PropertyConfig = {
  id: number | null;
  property: string | null;
} & PropertyConfigOptions & PropertyConfigCheckbox;
type PropertyConfigOptions<RequireOptions extends boolean = boolean> = RequireOptions extends true ? {
  requireOptions: RequireOptions;
  options: string[];
  get availableOptions(): SelectItem<string>[];
} : {
  requireOptions: RequireOptions;
};

export type PropertyConfigCheckbox<RequireCheckbox extends boolean = boolean> = RequireCheckbox extends true ? {
  requireCheckbox: RequireCheckbox;
  isChecked: boolean;
} : {
  requireCheckbox: RequireCheckbox;
};

export type ConfigCommon = {
  daysOfWeek: number[];
  disabledOnHolidaysJp: boolean;
  excludedDates: string[];
};

export type ConfigFeatures = {
  projects: boolean;
  todos: boolean;
};

export type ConfigDailyReport = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
  documentToolId: number;
  database: string;
  timings: ConfigDailyReportTiming[];
};

export type ConfigDailyReportTiming = {
  time: string;
  enablePending: boolean;
};

export type ConfigNotify = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
};

export type ConfigProspect = {
  type: number;
  enabled: boolean;
  chatToolId: number;
  channel: string;
  from: number;
  to: number;
  fromDaysBefore: number;
  beginOfWeek: number;
  frequency: number;
  frequencyDaysBefore: number[];
  timings: ConfigProspectTiming[];
};

export type ConfigProspectTiming = {
  time: string;
  type: number;
  mode: number;
};

export type BoardConfig = {
  boardId: string | null;
  projectRule: number | null;
};

export type ConfigStatus = {
  todoApp: boolean;
  users: boolean;
  projects: {
    enabled: boolean;
    isValid: boolean;
  };
  todos: {
    enabled: boolean;
    isValid: boolean;
  };
};

export type LinkToolBtnData = {
  id: number;
  toolName: string;
  selected: boolean;
  iconSrc: string;
};

export type SettingExpansionPanelData = {
  step: number;
  title: string;
  description: string;
  iconSrc: string;
  hasNextButton: boolean;
  hasBackButton: boolean;
  isOpen: boolean;
  isDone: boolean;
};

export type RadioCardData = {
  captionBeforeTitle: string;
  title: string;
  description: string;
  selected: boolean;
  frequencyType: number;
};

export type RadioImageCardData = {
  captionBeforeTitle: string;
  title: string;
  description: string;
  selected: boolean;
  imgSrc: string;
};

export type SettingStepperData = {
  step: number;
  title: string;
};

export type DayToConfirmProgress = {
  day: string;
  selected: boolean;
};

export type AccountRow = {
  index: number;
  todoAppUserId: string;
  chatToolUserId: string;
};

export type BacklogSpaceId = {
  id: string;
  domain: string;
};

export type MemberConfig = {
  user: Omit<User, "id"> & Partial<Pick<User, "id">>;
  chatToolUserId: string | null;
  todoAppUserId: string | null;
  new: boolean;
  index: number;
};

export type ReportingLine = {
  user: User;
  superiorUsers: string[];
};

export type InstallLineworksInfo = {
  client_id: string;
  client_secret: string;
  service_account: string;
  secret_key: string;
};
