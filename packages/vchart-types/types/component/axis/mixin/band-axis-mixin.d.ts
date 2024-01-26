import type { BandScale } from '@visactor/vscale';
import type { Dict } from '@visactor/vutils';
import type { IOrientType, IPolarOrientType, StringOrNumber } from '../../../typings';
import type { IEvent } from '../../../event/interface';
import type { IAxisLocationCfg } from '../interface';
import { CompilableData } from '../../../compile/data/compilable-data';
export interface BandAxisMixin {
    _orient: IOrientType | IPolarOrientType;
    _option: any;
    _scale: BandScale;
    _scales: BandScale[];
    _spec: any;
    _tick: any;
    _tickData: CompilableData[];
    _defaultBandPosition: number;
    _defaultBandInnerPadding: number;
    _defaultBandOuterPadding: number;
    event: IEvent;
    isSeriesDataEnable: () => boolean;
    collectData: (depth: number, rawData?: boolean) => {
        min: number;
        max: number;
        values: any[];
    }[];
    computeDomain: (data: {
        min: number;
        max: number;
        values: any[];
    }[]) => StringOrNumber[];
    transformScaleDomain: () => void;
    _initTickDataSet: (options: any, index?: number) => any;
    _tickTransformOption: () => any;
    _forceLayout: () => void;
    _getNormalizedValue: (values: any[], length: number) => number;
}
export declare class BandAxisMixin {
    protected _initData(): void;
    protected _rawDomainIndex: {
        [key: string | number | symbol]: number;
    }[];
    dataToPosition(values: any[], cfg?: IAxisLocationCfg): number;
    valueToPosition(value: any): number;
    updateGroupScaleRange(): void;
    getPosition(values: any[]): {
        position: number;
        bandScale: BandScale;
    };
    calcScales(DEFAULT_BAND_INNER_PADDING: number, DEFAULT_BAND_OUTER_PADDING: number): void;
    computeBandDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): StringOrNumber[];
    protected updateScaleDomain(): void;
    protected getLabelItems(length: number): Dict<any>[][];
    protected _updateRawDomain(): void;
    protected _clearRawDomain(): void;
}
