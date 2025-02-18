import { StatusCodes } from "~/utils/status-codes";

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: StatusCodes;
};

export type MenuItem = {
  type: "item";
  title: string;
  disabled: boolean;
  icon?: string;
  to?: string;
  href?: string;
  action?: (...args: any[]) => any;
} | {
  type: "divider";
} | {
  type: "subheader";
  title: string;
};

export type SignUpInfo = {
  name: string;
  agree: boolean;
};

export type EmailSignUpInfo = {
  email: string;
  password: string;
  passwordConfirm: string;
  company: string;
  agree: boolean;
};

export type Account = {
  isRegistered: boolean;
  name: string;
};

export type SelectItem<IdType = number> = {
  id: IdType;
  name: string;
};
