export type AccountInfo = {
  organization: string;
  name: string;
};

export type AccountInfoInit = AccountInfo & {
  uid: string;
  email: string;
};