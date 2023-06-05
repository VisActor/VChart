import type { IPolarAxisSpec } from '../../../component/axis/polar/interface';
import type { CoordinateType, IOrientType, IPolarOrientType, ITextMarkSpec } from '../../../typings';

export interface ITickDataOpt {
  tickCount?: number;
  forceTickCount?: number;
  tickStep?: number;

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
  label: string;
}
