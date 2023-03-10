import { SetOptional } from "type-fest";

export type UserConfig = {
  user: SetOptional<User, "id">;
  chatToolUserId: string;
  todoAppUserId: string;
};

export type User = {
  id: number;
  name: string;
};