import type { IComponent } from '../../../interface';
import type { IMarkerPositionsSpec, IDataPointSpec, IDataPos, IMarkerSpec, IDataPosCallback, IMarkerCrossSeriesSpec, OffsetPoint } from '../../interface';
import type { IMarkAreaTheme } from './theme';
export type IMarkArea = IComponent;
export type IRegressType = 'regression';
export type IMarkAreaSpec = IMarkerSpec & (IMarkAreaXSpec | IMarkAreaYSpec | IMarkAreaXYSpec | IMarkAreaCoordinateSpec | IMarkerPositionsSpec) & IMarkAreaTheme;
export interface IMarkAreaXSpec extends IMarkerCrossSeriesSpec {
    x: IDataPos | IDataPosCallback;
    x1: IDataPos | IDataPosCallback;
}
export interface IMarkAreaYSpec extends IMarkerCrossSeriesSpec {
    y: IDataPos | IDataPosCallback;
    y1: IDataPos | IDataPosCallback;
}
export interface IMarkAreaXYSpec extends IMarkerCrossSeriesSpec {
    x: IDataPos | IDataPosCallback;
    x1: IDataPos | IDataPosCallback;
    y: IDataPos | IDataPosCallback;
    y1: IDataPos | IDataPosCallback;
}
export type IMarkAreaCoordinateSpec = {
    coordinates: IDataPointSpec[];
    coordinatesOffset?: OffsetPoint[];
};
