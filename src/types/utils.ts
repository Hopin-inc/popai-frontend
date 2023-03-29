export type ValueOf<T> = T[keyof T];

export type IdOptional<T extends { id: any }> = Omit<T, "id"> & { id?: T["id"] };
