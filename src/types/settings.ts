import { SetOptional } from "type-fest";
import { ValueOf } from "~/types/utils";
import { NotionPropertyType, PropertyUsageType } from "~/consts/enum";
import { SelectItem } from "~/types/common";

export type UserConfig = {
  user: SetOptional<User, "id">;
  chatToolUserId: string;
  todoAppUserId: string;
};

export type UserReportingLine = {
  user: User;
  superiorUsers: number[];
}

export type User = {
  id: number;
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
  type: ValueOf<typeof NotionPropertyType>;
  availableOptions?: SelectItem<string>[];
};

export type PropertyUsage = {
  id: string;
  usage: ValueOf<typeof PropertyUsageType>;
  type: ValueOf<typeof NotionPropertyType>;
  options?: string[];
  isChecked?: boolean;
};

export type ConfigCommon = {
  daysOfWeek: number[];
  disabledOnHolidaysJp: boolean;
  excludedDates: string[];
};

export type ConfigDailyReport = {
  enabled: boolean;
  chatToolId: number;
  channel: string;
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
  askPlan: boolean;
  askPlanMilestone?: string;
};
