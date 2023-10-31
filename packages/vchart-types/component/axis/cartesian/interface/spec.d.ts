import type { IOrientType, IRectMarkSpec, StringOrNumber } from '../../../../typings';
import type { IBandAxisSpec, ILinearAxisSpec, IGrid, ICommonAxisSpec } from '../../interface';
import type {
  ICartesianDomainLine,
  ICartesianLabel,
  ITimeLayerType,
  ICartesianTitle,
  ICartesianAxisUnit
} from './common';
import type { AxisItemStateStyle } from '@visactor/vrender-components';
export type ICartesianAxisSpec =
  | ICartesianLinearAxisSpec
  | ICartesianBandAxisSpec
  | ICartesianTimeAxisSpec
  | ICartesianLogAxisSpec
  | ICartesianSymlogAxisSpec;
export type ICartesianAxisCommonSpec = ICommonAxisSpec & {
  orient: IOrientType;
  grid?: IGrid;
  subGrid?: IGrid;
  domainLine?: ICartesianDomainLine;
  label?: ICartesianLabel;
  title?: ICartesianTitle;
  autoIndent?: boolean;
  background?: {
    visible: boolean;
    style?: Partial<IRectMarkSpec>;
    state?: AxisItemStateStyle<Partial<IRectMarkSpec>>;
  };
  mode?: '2d' | '3d';
  depth?: number;
  unit?: ICartesianAxisUnit;
};
export interface ILinearAxisSync {
  axisId: StringOrNumber;
  zeroAlign?: boolean;
  tickAlign?: boolean;
}
export type ICartesianLinearAxisSpec = ICartesianAxisCommonSpec &
  ILinearAxisSpec & {
    sync?: ILinearAxisSync;
  };
export type ICartesianBandAxisSpec = ICartesianAxisCommonSpec &
  IBandAxisSpec & {
    bandSize?: number;
    maxBandSize?: number;
    minBandSize?: number;
    autoRegionSize?: boolean;
  };
export type ICartesianTimeAxisSpec = Omit<ICartesianAxisCommonSpec, 'inverse'> & {
  layers?: ITimeLayerType[];
};
export type ICartesianLogAxisSpec = ICartesianLinearAxisSpec & {
  base?: number;
};
export type ICartesianSymlogAxisSpec = ICartesianLinearAxisSpec & {
  constant?: number;
};
