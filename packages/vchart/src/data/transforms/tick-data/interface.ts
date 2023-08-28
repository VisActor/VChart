import type { ITick } from '../../../component/axis';
import type { IPolarAxisSpec } from '../../../component/axis/polar/interface';
import type { CoordinateType, IOrientType, IPolarOrientType, ITextMarkSpec } from '../../../typings';

export interface ITickDataOpt {
  /**
   * 是否进行轴采样
   */
  sampling?: boolean;
  tickCount?: number;
  forceTickCount?: number;
  tickStep?: number;
  tickMode?: ITick['tickMode'];
  noDecimals?: ITick['noDecimals'];

  coordinateType: CoordinateType;
  axisOrientType: IOrientType | IPolarOrientType;
  startAngle?: number;

  labelFormatter?: (value: any) => string;
  labelStyle: ITextMarkSpec;
  labelGap?: number;
}

export interface ICartesianTickDataOpt extends ITickDataOpt {
  axisOrientType: IOrientType;
  labelLastVisible: boolean;
  labelFlush: boolean;
}

export interface IPolarTickDataOpt extends ITickDataOpt {
  axisOrientType: IPolarOrientType;
  getRadius: () => number;
  axisSpec: IPolarAxisSpec;
}

export interface ITickData {
  index: number;
  value: number | string;
  // label: string;
}
