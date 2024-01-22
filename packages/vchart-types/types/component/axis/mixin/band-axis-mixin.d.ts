import type { BandScale } from '@visactor/vscale';
import type { StringOrNumber } from '../../../typings';
import type { IEvent } from '../../../event/interface';
import type { IAxisLocationCfg } from '../interface';
export interface BandAxisMixin {
    _scale: BandScale;
    _scales: BandScale[];
    _spec: any;
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
}
export declare class BandAxisMixin {
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
    protected _updateRawDomain(): void;
    protected _clearRawDomain(): void;
}
