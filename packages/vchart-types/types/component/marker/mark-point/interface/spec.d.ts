import type { IComponent } from '../../../interface';
import type { IDataPointSpec, IDataPos, IDataPosCallback, IMarkerSpec, IMarkerSymbol, MarkerPositionPoint, OffsetPoint } from '../../interface';
import type { IMarkPointTheme } from './theme';
export type IMarkPoint = IComponent;
export type IMarkPointSpec = IMarkerSpec & (IMarkPointXYSpec | IMarkPointCoordinateSpec | IMarkPointPositionsSpec) & IMarkPointTheme<IMarkerSymbol>;
export type IMarkPointXYSpec = {
    y: IDataPos | IDataPosCallback;
    x: IDataPos | IDataPosCallback;
};
export type IMarkPointCoordinateSpec = {
    coordinates: IDataPointSpec;
    coordinatesOffset?: OffsetPoint;
};
export type IMarkPointPositionsSpec = {
    position: MarkerPositionPoint;
    regionRelative?: boolean;
};
