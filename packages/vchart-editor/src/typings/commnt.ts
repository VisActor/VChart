export type Include<T> = {
  [K in keyof T]: T[K];
} & {
  [K in Exclude<string, keyof T>]: unknown;
};
