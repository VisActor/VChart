import type { IChartTempConstructor } from './interface';
import { BarTemp } from './temps/bar';
export const TempList: { [key: string]: IChartTempConstructor } = {
  bar: BarTemp
};

export function getTemp(key: string) {
  const t = TempList[key];
  if (!t) {
    console.error('can not found temp:', key);
  }
  return new t();
}
