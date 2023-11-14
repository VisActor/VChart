import type { IComponent } from '../../../interface';
import type { IMarkerPositionsSpec, IDataPointSpec, IDataPos, IMarkerSpec, IMarkerAxisSpec, IDataPosCallback } from '../../interface';
import type { IMarkAreaTheme } from './theme';
export type IMarkArea = IComponent;
export type IRegressType = 'regression';
export type IMarkAreaSpec = IMarkerSpec & (IMarkAreaXSpec | IMarkAreaYSpec | IMarkAreaCoordinateSpec | IMarkAreaPositionsSpec) & IMarkAreaTheme;
export interface IMarkAreaXSpec extends IMarkerAxisSpec {
    x: IDataPos | IDataPosCallback;
    x1: IDataPos | IDataPosCallback;
}
export interface IMarkAreaYSpec extends IMarkerAxisSpec {
    y: IDataPos | IDataPosCallback;
    y1: IDataPos | IDataPosCallback;
}
export interface IMarkAreaAngleSpec extends IMarkerAxisSpec {
    startAngle: IDataPos | IDataPosCallback;
    endAngle: IDataPos | IDataPosCallback;
}
export interface IMarkAreaRadiusSpec extends IMarkerAxisSpec {
    startRadius: IDataPos | IDataPosCallback;
    endRadius: IDataPos | IDataPosCallback;
}
export type IMarkAreaCoordinateSpec = {
    coordinates: IDataPointSpec[];
};
export type IMarkAreaPositionsSpec = IMarkerPositionsSpec;
