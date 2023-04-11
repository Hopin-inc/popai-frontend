import { Dayjs } from "dayjs";
import { range } from "~/utils/common";
import { $dayjs } from "~/plugins/dayjs";

export const generateTimeListByInterval = (
  intervalMinutes: number,
  from?: Dayjs,
  to?: Dayjs,
  fmt: string = "HH:mm",
): string[] => {
  if (!from) {
    from = $dayjs().set("hour", 0).set("minute", 0).set("second", 0);
  }
  if (!to) {
    to = $dayjs().set("hour", 0).set("minute", 0).set("second", 0).add(1, "day");
  }
  const n = Math.floor(to?.diff(from, "minute", false) / intervalMinutes);
  return range(n)
    .map(i => from?.add(i * intervalMinutes, "minute").format(fmt) ?? "")
    .filter(v => v !== "");
};

export const getTimingDayAfterText = (days: number): string => {
  switch (days) {
    case 0:
      return "当日";
    case 1:
      return "翌日";
    default:
      return `${ days }日後`;
  }
};

export const getTimingDayBeforeText = (days: number): string => {
  switch (days) {
    case 0:
      return "当日";
    case 1:
      return "前日";
    default:
      return `${ days }日前`;
  }
};

export const getTimingDayText = (daysAfter: number): string => {
  return daysAfter >= 0 ? getTimingDayAfterText(daysAfter) : getTimingDayBeforeText(-daysAfter);
};
