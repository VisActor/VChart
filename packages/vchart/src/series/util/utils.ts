import { SeriesTypeEnum } from '../interface';

/**
 * 将相对数值转换为绝对数值
 * @param originValue 原始值（相对值或绝对值）
 * @param total 总体值
 * @returns 实际绝对数值
 */
export const getActualNumValue = (originValue: number | string, total: number): number => {
  const originNumValue = Number(originValue);
  const originStrValue = originValue.toString();
  if (isNaN(originNumValue) && originStrValue[originStrValue.length - 1] === '%') {
    return total * (Number(originStrValue.slice(0, originStrValue.length - 1)) / 100);
  }
  return originNumValue;
};

export function isPolarAxisSeries(type: string) {
  return ([SeriesTypeEnum.rose, SeriesTypeEnum.radar, SeriesTypeEnum.circularProgress] as string[]).includes(type);
}
