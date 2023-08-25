import type { StandardData, DataInfo } from './../data/interface';
import type { IChartSpec } from '@visactor/vchart';

export interface IChartTemp {
  getSpec: (data: StandardData, info: DataInfo, opt?: any) => IChartSpec | null;
  checkDataEnable: (data: StandardData, info: DataInfo, opt?: any) => boolean;
  clear: () => void;
}

export interface IChartTempConstructor {
  new (): IChartTemp;
}
