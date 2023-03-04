export type MenuItem = {
  type: "item";
  title: string;
  icon?: string;
  href?: string;
  action?: Function;
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
}

export type Account = {
  organization: string;
  name: string;
  email: string;
  idToken: string;
};