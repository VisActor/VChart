import type { IPadding, IPointLike } from '@visactor/vutils';
import type { SymbolType } from '@visactor/vrender-core';
import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec, StringOrNumber } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { Datum } from '@visactor/vrender-components';
export type IAggrType = 'sum' | 'average' | 'min' | 'max' | 'variance' | 'standardDeviation' | 'median';
export type IDataPos = string | number | IAggrType;
export type IDataPosCallback = (relativeSeriesData: any, startRelativeSeriesData: any, endRelativeSeriesData: any) => IDataPos;
export type IDataPointSpec = {
    [key: string]: IDataPos;
    refRelativeSeriesIndex?: number;
    refRelativeSeriesId?: StringOrNumber;
};
export type IMarkerPositionsSpec = {
    positions: IPointLike[];
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
    text?: string | string[] | number | number[];
    formatMethod?: (markData: Datum[], seriesData: Datum[]) => string | string[] | number | number[];
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
export interface IMarkerAxisSpec {
    startRelativeSeriesIndex?: number;
    endRelativeSeriesIndex?: number;
    startRelativeSeriesId?: string;
    endRelativeSeriesId?: string;
    relativeRelativeSeriesIndex?: number;
}
export interface IMarkerSpec extends IComponentSpec {
    relativeSeriesIndex?: number;
    relativeSeriesId?: number | string;
    visible?: boolean;
    interactive?: boolean;
    autoRange?: boolean;
    clip?: boolean;
}
export interface IMarkerSymbol extends IMarkerRef {
    visible?: boolean;
    symbolType?: SymbolType;
    size?: number;
    style?: Omit<ISymbolMarkSpec, 'visible'>;
}
