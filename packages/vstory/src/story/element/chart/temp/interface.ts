import { IElementChartSpec } from './../../dsl-interface';
import type { StandardData, DataInfo } from './../data/interface';
import type { ISpec } from '@visactor/vchart';
import type { IVisactorTemp } from '../../visactor/interface';
import { ElementChart } from '../element';

export interface IChartTemp extends IVisactorTemp {
  type: string;
  /**
   * 根据数据得到原始 vchartSpec
   * @param data 数据
   * @param info 数据信息
   * @param opt 透传参数
   * @returns
   */
  getSpec: (data: StandardData, info: DataInfo, ctx: { chart: ElementChart }, opt?: any) => ISpec | null;

  // 对 spec 进行后处理
  transformSpec: (rawSpec: ISpec, config: IElementChartSpec['config'], ctx: { chart: ElementChart }) => ISpec;

  processingVChart: (ctx: { chart: ElementChart }) => void;

  getChartType: () => string;
  checkDataEnable: (data: StandardData, info: DataInfo, opt?: any) => boolean;
  checkSpecialValueEnable: (v: any) => boolean;
  getTempInfo?: () => any;
  clear: () => void;
}

export interface IChartTempConstructor {
  type: string;
  new (): IChartTemp;
}
