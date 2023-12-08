import type { IComponent } from '../../../interface';
import type { IAggrType, IMarkerPositionsSpec, IDataPointSpec, IMarkerSpec, IDataPos, IDataPosCallback, IMarkerLabelSpec, IMarkerCrossSeriesSpec, OffsetPoint } from '../../interface';
import type { IRegressType } from '../../mark-area/interface';
import type { IMarkLineTheme } from './theme';
import type { ILineMarkSpec, IPoint } from '../../../../typings';
export type IMarkLine = IComponent;
export type IMarkLineSpec = (IMarkerSpec & (IMarkLineXSpec | IMarkLineYSpec | IMarkLineXYSpec | IMarkLineXYY1Spec | IMarkLineYXX1Spec | IMarkLineCoordinateSpec | IMarkerPositionsSpec) & IMarkLineTheme) | IStepMarkLineSpec;
export interface IMarkLineXSpec extends IMarkerCrossSeriesSpec {
    x: IDataPos | IDataPosCallback;
}
export interface IMarkLineXYY1Spec extends IMarkerCrossSeriesSpec {
    x: IDataPos | IDataPosCallback;
    y: IDataPos | IDataPosCallback;
    y1: IDataPos | IDataPosCallback;
}
export interface IMarkLineYSpec extends IMarkerCrossSeriesSpec {
    y: IDataPos | IDataPosCallback;
}
export interface IMarkLineYXX1Spec extends IMarkerCrossSeriesSpec {
    y: IDataPos | IDataPosCallback;
    x: IDataPos | IDataPosCallback;
    x1: IDataPos | IDataPosCallback;
}
export interface IMarkLineXYSpec extends IMarkerCrossSeriesSpec {
    x: IDataPos | IDataPosCallback;
    y: IDataPos | IDataPosCallback;
    x1: IDataPos | IDataPosCallback;
    y1: IDataPos | IDataPosCallback;
}
export type IMarkLineCoordinateSpec = {
    coordinates: IDataPointSpec[];
    coordinatesOffset?: OffsetPoint[];
    process?: {
        x: IAggrType;
    } | {
        y: IAggrType;
    } | {
        xy: IRegressType;
    };
};
export type IStepMarkLineSpec = IMarkerSpec & {
    type: 'type-step';
    connectDirection: 'top' | 'bottom' | 'left' | 'right';
    expandDistance?: number | string;
    label?: IMarkerLabelSpec;
    line?: {
        multiSegment?: boolean;
        mainSegmentIndex?: number;
        style?: ILineMarkSpec | ILineMarkSpec[];
    };
} & Omit<IMarkLineTheme, 'label' | 'line'> & ({
    coordinates: [IDataPointSpec, IDataPointSpec];
    process?: {
        x: IAggrType;
    } | {
        y: IAggrType;
    } | {
        xy: IRegressType;
    };
} | {
    positions: [IPoint, IPoint];
    regionRelative?: boolean;
});
