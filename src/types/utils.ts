import type { Ref } from "vue";

export type ValueOf<T> = T[keyof T];

export type IdOptional<T extends Record<string, any>> = SetOptional<T, "id">;
export type SetOptional<T extends Record<string, any>, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ReadonlyRef<T> = Readonly<Ref<T>>;
export type ReadonlyArrayRef<T> = Readonly<Ref<readonly Readonly<T>[]>>;
