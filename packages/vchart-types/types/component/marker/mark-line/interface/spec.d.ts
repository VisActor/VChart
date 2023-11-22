import type { IComponent } from '../../../interface';
import type { IAggrType, IMarkerPositionsSpec, IDataPointSpec, IMarkerSpec, IMarkerAxisSpec, IDataPos, IDataPosCallback, IMarkerLabelSpec } from '../../interface';
import type { IRegressType } from '../../mark-area/interface';
import type { IMarkLineTheme } from './theme';
import type { ILineMarkSpec, IPoint } from '../../../../typings';
export type IMarkLine = IComponent;
export type IMarkLineSpec = (IMarkerSpec & (IMarkLineXSpec | IMarkLineYSpec | IMarkLineCoordinateSpec | IMarkLinePositionsSpec) & IMarkLineTheme) | IStepMarkLineSpec;
export interface IMarkLineXSpec extends IMarkerAxisSpec {
    x: IDataPos | IDataPosCallback;
}
export interface IMarkLineYSpec extends IMarkerAxisSpec {
    y: IDataPos | IDataPosCallback;
}
export interface IMarkLineAngleSpec extends IMarkerAxisSpec {
    angle: IDataPos | IDataPosCallback;
}
export interface IMarkLineRadiusSpec extends IMarkerAxisSpec {
    radius: IDataPos | IDataPosCallback;
}
export type IMarkLineCoordinateSpec = {
    coordinates: IDataPointSpec[];
    process?: {
        x: IAggrType;
    } | {
        y: IAggrType;
    } | {
        xy: IRegressType;
    };
};
export type IMarkLinePositionsSpec = IMarkerPositionsSpec;
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
});
