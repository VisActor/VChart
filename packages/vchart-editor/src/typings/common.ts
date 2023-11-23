export type Include<T> = {
  [K in keyof T]: T[K];
} & {
  [K in Exclude<string, keyof T>]: unknown;
};

export type FormatConfig = {
  prefix?: string;
  postfix?: string;
  unit?: number;
  fixed?: number | 'auto';
  content?: 'value' | 'abs' | 'percentage' | 'value(percentage)' | 'percentage(value)' | 'CAGR';
  separator?: boolean;
};
