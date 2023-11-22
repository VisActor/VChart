import type { SegmentAttributes, AxisLabelOverlap } from '@visactor/vrender-components';
import type { IBaseScale } from '@visactor/vscale';
import type { IAxis, IAxisLocationCfg, IDomainLine, ILabel, ITickCallbackOption, ITitle } from '../../interface';
import type { ITextMarkSpec, StringOrNumber } from '../../../../typings';
export type ICartesianDomainLineSpec = {
    startSymbol?: SegmentAttributes['startSymbol'];
    endSymbol?: SegmentAttributes['endSymbol'];
    onZero?: boolean;
    onZeroAxisIndex?: number;
    onZeroAxisId?: StringOrNumber;
};
export type ICartesianDomainLine = IDomainLine & ICartesianDomainLineSpec;
export type ICartesianTitle = ITitle & {
    autoRotate?: boolean;
    inside?: boolean;
};
export type ICartesianLabel = ILabel & {
    flush?: boolean;
    lastVisible?: boolean | null;
    containerAlign?: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle';
} & AxisLabelOverlap;
export interface ILinearAxis extends IAxis {
    readonly zero: boolean;
    readonly nice: boolean;
    setExtendDomain: (key: string, value: number | undefined) => void;
}
export interface IAxisHelper {
    isContinuous: boolean;
    dataToPosition: (values: any[], cfg?: IAxisLocationCfg) => number;
    valueToPosition?: (value: any, cfg?: IAxisLocationCfg) => number;
    getScale?: (depth: number) => IBaseScale;
    getBandwidth?: (depth: number) => number;
    setExtendDomain?: (key: string, value: number | undefined) => void;
    getAxisType: () => string;
    getAxisId: () => number;
    isInverse: () => boolean;
    getFields?: () => string[];
}
export interface ITimeLayerType {
    tickStep?: number;
    timeFormat?: string;
    timeFormatMode?: 'utc' | 'local';
    tickCount?: number | ((option: ITickCallbackOption) => number);
    forceTickCount?: number;
}
export type ICartesianAxisUnit = {
    visible: boolean;
    text?: string | number | number[] | string[];
    style?: ITextMarkSpec;
};
