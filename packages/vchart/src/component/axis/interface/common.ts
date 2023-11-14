import type { IBaseScale } from '@visactor/vscale';
import type { Datum, IPolarOrientType, StringOrNumber } from '../../../typings';
import type { IComponent } from '../../interface/common';
import type { ICartesianAxisSpec } from '../cartesian/interface';
import type { ITextGraphicAttribute } from '@visactor/vrender-core';

export interface StatisticsDomain {
  domain: any[];
  index: { [key in StringOrNumber]: number };
}

export interface IAxis extends IComponent {
  valueToPosition: (value: any) => number;
  getScale: () => IBaseScale;
  getScales: () => IBaseScale[];
  getOrient: () => ICartesianAxisSpec['orient'] | IPolarOrientType;
  visible: boolean;
}

export interface IAxisItem<T> {
  visible?: boolean;
  style?: Omit<T, 'visible'>;
}

export interface IAxisItemTheme<T> {
  visible?: boolean;
  style?: Omit<T, 'visible'>;
}
export type AxisAnimationPreset = 'groupFadeIn' | 'fadeIn' | 'grow';

export type ITickCallbackOption = {
  axisLength?: number;
  labelStyle?: ITextGraphicAttribute;
};

export type StyleCallback<T> = (value: any, index: number, datum: Datum, data: Datum[]) => T;
export type AxisType = 'linear' | 'ordinal' | 'band' | 'point' | 'time' | 'log' | 'symlog';

export interface IAxisLocationCfg {
  bandPosition?: number;
  datum?: Datum;
}
