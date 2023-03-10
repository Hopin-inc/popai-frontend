import { SelectItem } from "~/types";
import { ValueOf } from "~/types/utils";
import { NotionPropertyType } from "~/consts/enum";

export const DAYS_OF_WEEK: SelectItem[] = [
  { id: 0, name: "日" },
  { id: 1, name: "月" },
  { id: 2, name: "火" },
  { id: 3, name: "水" },
  { id: 4, name: "木" },
  { id: 5, name: "金" },
  { id: 6, name: "土" }
];

export const DAYS_BEFORE: SelectItem[] = [
  { id: 0, name: "当日" },
  { id: 1, name: "前日" },
  { id: 2, name: "2日前" },
  { id: 3, name: "3日前" },
  { id: 4, name: "4日前" },
  { id: 5, name: "5日前" },
  { id: 6, name: "6日前" },
  { id: 7, name: "7日前" },
  { id: 8, name: "8日前" },
  { id: 9, name: "9日前" },
  { id: 10, name: "10日前" },
  { id: 11, name: "11日前" },
  { id: 12, name: "12日前" },
  { id: 13, name: "13日前" },
  { id: 14, name: "14日前" },
];

export const NOTION_PROPERTY_TYPES_WITH_LABELS: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.SELECT,
  NotionPropertyType.MULTI_SELECT,
  NotionPropertyType.STATUS,
];

export const NOTION_PROPERTY_TYPES_FOR_NAME: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.TITLE,
];

export const NOTION_PROPERTY_TYPES_FOR_PEOPLE: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.PEOPLE,
];

export const NOTION_PROPERTY_TYPES_FOR_DATE: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.DATE,
];

export const NOTION_PROPERTY_TYPES_FOR_STATUS: ValueOf<typeof NotionPropertyType>[] = [
  NotionPropertyType.CHECKBOX,
  NotionPropertyType.SELECT,
  NotionPropertyType.MULTI_SELECT,
  NotionPropertyType.STATUS,
];
