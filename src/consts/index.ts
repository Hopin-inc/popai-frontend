import { SelectItem } from "~/types/common";
import { ValueOf } from "~/types/utils";
import { NotionPropertyType } from "~/consts/enum";
import { range } from "~/utils/common";
import { generateTimeListByInterval, getTimingDayBeforeText } from "~/utils/datetime";

export const DAYS_OF_WEEK: SelectItem[] = [
  { id: 0, name: "日" },
  { id: 1, name: "月" },
  { id: 2, name: "火" },
  { id: 3, name: "水" },
  { id: 4, name: "木" },
  { id: 5, name: "金" },
  { id: 6, name: "土" }
];

export const DAYS_BEFORE: SelectItem[] = range(0, 14).map((i) => {
  return {
    id: i,
    name: getTimingDayBeforeText(i)
  };
});

export const TIME_LIST: SelectItem<string>[] = generateTimeListByInterval(15).map((time) => {
  return {
    id: `${time}:00`,
    name: time
  };
});

export const NOTION_PROPERTY_TYPES_WITH_LABELS: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.SELECT,
  NotionPropertyType.MULTI_SELECT,
  NotionPropertyType.STATUS
];

export const NOTION_PROPERTY_TYPES_WITH_CHECKBOX: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.CHECKBOX
];

export const NOTION_PROPERTY_TYPES_FOR_NAME: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.TITLE
];

export const NOTION_PROPERTY_TYPES_FOR_PEOPLE: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.PEOPLE
];

export const NOTION_PROPERTY_TYPES_FOR_DATE: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.DATE
];

export const NOTION_PROPERTY_TYPES_FOR_STATUS: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.CHECKBOX,
  NotionPropertyType.SELECT,
  NotionPropertyType.MULTI_SELECT,
  NotionPropertyType.STATUS
];
