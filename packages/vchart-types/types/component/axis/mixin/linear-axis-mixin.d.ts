import type { LinearScale } from '@visactor/vscale';
import type { IAxisLocationCfg, ITick } from '../interface';
import type { IEvent } from '../../../event/interface';
export declare const e10: number;
export declare const e5: number;
export declare const e2: number;
export interface LinearAxisMixin {
    _scale: LinearScale;
    _scales: LinearScale[];
    _spec: any;
    _nice: boolean;
    _zero: boolean;
    _domain: {
        min?: number;
        max?: number;
    };
    _expand?: {
        max?: number;
        min?: number;
    };
    _tick: ITick | undefined;
    isSeriesDataEnable: any;
    computeDomain: any;
    collectData: any;
    event: IEvent;
}
export declare class LinearAxisMixin {
    protected _extend: {
        [key: string]: number;
    };
    setExtraAttrFromSpec(): void;
    transformScaleDomain(): void;
    setLinearScaleNice(): void;
    setLogScaleNice(): void;
    setScaleNice(): void;
    dataToPosition(values: any[], cfg?: IAxisLocationCfg): number;
    valueToPosition(value: any): number;
    computeLinearDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): number[];
    protected expandDomain(domain: number[]): void;
    protected niceDomain(domain: number[]): number[];
    protected includeZero(domain: number[]): void;
    setExtendDomain(key: string, value: number | undefined): void;
    protected extendDomain(domain: number[]): void;
    getDomainSpec(): {
        min?: number;
        max?: number;
    };
    protected setDomainMinMax(domain: number[]): void;
    setZero(zero: boolean): void;
    protected updateScaleDomain(): void;
    protected updateScaleDomainByModel(domain?: number[]): void;
}
