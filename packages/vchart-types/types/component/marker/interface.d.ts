import type { IPadding } from '@visactor/vutils';
import type { SymbolType, IRichTextCharacter } from '@visactor/vrender-core';
import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec, StringOrNumber } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { Datum } from '@visactor/vrender-components';
import type { ICartesianSeries } from '../../series/interface';
import type { IOptionAggrField, IOptionSeries } from '../../data/transforms/aggregation';
export type OffsetPoint = {
    x?: number | string;
    y?: number | string;
};
export type IAggrType = 'sum' | 'average' | 'min' | 'max' | 'variance' | 'standardDeviation' | 'median';
export type IDataPos = StringOrNumber | IAggrType;
export type IDataPosCallback = (relativeSeriesData: Datum[], startRelativeSeriesData: Datum[], endRelativeSeriesData: Datum[], relativeSeries: ICartesianSeries, startRelativeSeries: ICartesianSeries, endRelativeSeries: ICartesianSeries) => StringOrNumber;
export type IDataPointSpec = {
    [key: string]: IDataPos | IDataPosCallback;
    refRelativeSeriesIndex?: number;
    refRelativeSeriesId?: StringOrNumber;
    xFieldIndex?: number;
    xFieldDim?: string;
    yFieldIndex?: number;
    yFieldDim?: string;
};
export type MarkerPositionPoint = {
    x: StringOrNumber;
    y: StringOrNumber;
};
export type ICoordinateOption = {
    x?: IOptionAggrField | (IDataPosCallback | StringOrNumber)[];
    y?: IOptionAggrField | (IDataPosCallback | StringOrNumber)[];
    getRefRelativeSeries?: () => ICartesianSeries;
} & IOptionSeries;
export type IMarkerPositionsSpec = {
    positions: MarkerPositionPoint[];
    regionRelative?: boolean;
};
export type IMarkerLabelWithoutRefSpec = {
    visible?: boolean;
    autoRotate?: boolean;
    minWidth?: number;
    maxWidth?: number;
    labelBackground?: {
        visible?: boolean;
        padding?: IPadding | number[] | number;
        style?: Omit<IRectMarkSpec, 'visible'>;
    };
    type?: 'text' | 'rich' | 'html';
    text?: string | string[] | number | number[] | IRichTextCharacter[];
    formatMethod?: (markData: Datum[], seriesData: Datum[]) => string | string[] | number | number[] | IRichTextCharacter[];
    style?: Omit<ITextMarkSpec, 'visible'>;
    shape?: {
        visible?: boolean;
        style: Omit<ISymbolMarkSpec, 'visible'>;
    };
    space?: number;
    confine?: boolean;
    dx?: number;
    dy?: number;
};
export type IMarkerLabelSpec = IMarkerLabelWithoutRefSpec & IMarkerRef;
export interface IMarkerRef {
    refX?: number;
    refY?: number;
    refAngle?: number;
}
export interface IMarkerCrossSeriesSpec {
    startRelativeSeriesIndex?: number;
    endRelativeSeriesIndex?: number;
    startRelativeSeriesId?: string;
    endRelativeSeriesId?: string;
}
export interface IMarkerSpec extends IComponentSpec {
    relativeSeriesIndex?: number;
    relativeSeriesId?: number | string;
    visible?: boolean;
    interactive?: boolean;
    autoRange?: boolean;
    clip?: boolean;
    name?: string;
}
export interface IMarkerSymbol extends IMarkerRef {
    visible: boolean;
    symbolType?: SymbolType;
    size?: number;
    style?: Omit<ISymbolMarkSpec, 'visible'>;
}
