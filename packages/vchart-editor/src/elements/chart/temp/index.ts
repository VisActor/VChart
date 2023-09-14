import type { IChartTempConstructor } from './interface';
import { BarTemp } from './temps/bar';
import { LineTemp } from './temps/line';
export const TempList: { [key: string]: IChartTempConstructor } = {
  bar: BarTemp,
  line: LineTemp
};

export function getTemp(key: string) {
  const t = TempList[key];
  if (!t) {
    console.error('can not found temp:', key);
  }
  return new t();
}
