import { SeriesTypeEnum } from '../interface';

export function isPolarAxisSeries(type: string) {
  return ([SeriesTypeEnum.rose, SeriesTypeEnum.radar, SeriesTypeEnum.circularProgress] as string[]).includes(type);
}
