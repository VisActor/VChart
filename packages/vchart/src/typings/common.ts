/**
 * @description 一些通用的工具类型
 */
// 数据 object
// @todo 将对数据的定义统一
export type Datum = {
  [key: string]: any;
};

export type StringOrNumber = string | number;

export type MaybeArray<T> = T | Array<T>;

export type Maybe<T> = T | undefined | null;

export type Quadrant = 1 | 2 | 3 | 4;
