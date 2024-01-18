/**
 * 包含 number / string 比较时的类型转换的 includes 方法
 */
export const includes = (array: (string | number)[], value: string | number) => array.some(item => item == value);
