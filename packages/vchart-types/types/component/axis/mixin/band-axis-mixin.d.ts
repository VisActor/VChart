import type { BandScale } from '@visactor/vscale';
import type { StringOrNumber } from '../../../typings';
import type { IEvent } from '../../../event/interface';
export interface BandAxisMixin {
    _scale: BandScale;
    _scales: BandScale[];
    _spec: any;
    event: IEvent;
    isSeriesDataEnable: () => boolean;
    computeStatisticsDomain: () => void;
    collectData: (depth: number) => {
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
}
