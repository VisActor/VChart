/**
 * 二分靠近框架，返回数组中第一个大于等于目标值的数的索引
 * @param arr 数组
 * @param compareFn 比较函数，返回(当前值-目标值)
 */
export const binaryFuzzySearch = <T>(arr: T[], compareFn: (value: T) => number) => {
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (compareFn(arr[mid]) >= 0) {
      right = mid; // 第一个大于等于目标值的数
    } else {
      left = mid + 1;
    }
  }
  return left;
};
