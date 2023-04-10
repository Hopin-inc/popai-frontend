import { StatusCodes } from "~/utils/status-codes";

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: StatusCodes;
};

export type MenuItem = {
  type: "item";
  title: string;
  icon?: string;
  href?: string;
  action?: (...args: any[]) => any;
} | {
  type: "divider";
} | {
  type: "subheader";
  title: string;
};

export type LoginInfo = {
  email: string;
  password: string;
};

export type SignUpInfo = LoginInfo & {
  passwordConfirm: string;
  organization: string;
  name: string;
  agree: boolean;
};

export type Account = {
  organization: string;
  name: string;
};

export type SelectItem<IdType = number> = {
  id: IdType;
  name: string;
};
