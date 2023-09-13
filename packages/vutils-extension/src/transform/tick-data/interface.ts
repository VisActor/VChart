import { ITextGraphicAttribute } from '@visactor/vrender';

type CoordinateType = 'cartesian' | 'polar' | 'geo' | 'none';
type IOrientType = 'left' | 'top' | 'right' | 'bottom' | 'z';
type IPolarOrientType = 'radius' | 'angle';

export interface ITickDataOpt {
  /**
   * 是否进行轴采样
   */
  sampling?: boolean;
  tickCount?: number;
  forceTickCount?: number;
  tickStep?: number;
  tickMode?: 'average' | 'd3' | string;
  noDecimals?: boolean;

  coordinateType: CoordinateType;
  axisOrientType: IOrientType | IPolarOrientType;
  startAngle?: number;

  labelFormatter?: (value: any) => string;
  labelStyle: ITextGraphicAttribute;
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
  labelOffset: number;
}

export interface ITickData {
  index: number;
  value: number | string;
  // label: string;
}
