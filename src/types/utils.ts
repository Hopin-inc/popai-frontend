import type { Ref } from "vue";

export type ValueOf<T> = T[keyof T];

export type IdOptional<T extends Record<string, any>> = SetOptional<T, "id">;
export type SetOptional<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Exclusive<
  T extends Record<PropertyKey, unknown>,
  U extends Record<PropertyKey, unknown>,
> = (T & { [k in Exclude<keyof U, keyof T>]?: never })
  | (U & { [k in Exclude<keyof T, keyof U>]?: never });
export type ReadonlyRef<T> = Readonly<Ref<T>>;
export type ReadonlyArrayRef<T> = Readonly<Ref<readonly Readonly<T>[]>>;
