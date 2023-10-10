import type { IPointLike } from '@visactor/vutils';
import type { IComponent } from '../../../interface';
import type { IDataPointSpec, IMarkerSpec } from '../../interface';
import type { IMarkPointTheme } from './theme';
export type IMarkPoint = IComponent;
export type IMarkPointSpec = IMarkerSpec & (IMarkPointCoordinateSpec | IMarkPointPositionsSpec) & IMarkPointTheme;
export type IMarkPointCoordinateSpec = {
  coordinates: IDataPointSpec;
  relativeRelativeSeriesIndex?: number;
  relativeRelativeSeriesId?: string;
};
export type IMarkPointPositionsSpec = {
  position: IPointLike;
};
