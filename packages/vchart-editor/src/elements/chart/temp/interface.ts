import type { StandardData, DataInfo } from './../data/interface';
import type { ISpec } from '@visactor/vchart';

export interface IChartTemp {
  type: string;
  getSpec: (data: StandardData, info: DataInfo, opt?: any) => ISpec | null;
  checkDataEnable: (data: StandardData, info: DataInfo, opt?: any) => boolean;
  clear: () => void;
}

export interface IChartTempConstructor {
  new (): IChartTemp;
}
