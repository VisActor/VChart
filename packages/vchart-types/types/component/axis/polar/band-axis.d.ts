import { BandScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface/type';
import { PolarAxis } from './axis';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
import type { IPolarBandAxisSpec } from './interface';
export interface PolarBandAxis<T extends IPolarBandAxisSpec = IPolarBandAxisSpec> extends Pick<BandAxisMixin, 'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'>, PolarAxis<T> {
}
export declare class PolarBandAxis<T extends IPolarBandAxisSpec = IPolarBandAxisSpec> extends PolarAxis<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    protected _scale: BandScale;
    protected _scales: BandScale[];
    protected computeDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): StringOrNumber[];
    protected updateScaleRange(): boolean;
    protected axisHelper(): {
        getBandwidth: (depth: number) => number;
        isContinuous: boolean;
        dataToPosition: (values: any[]) => number;
        coordToPoint: (point: import("../../../typings").IPolarPoint) => import("../../../typings").IPoint;
        pointToCoord: (point: import("../../../typings").IPoint) => import("../../../typings").IPolarPoint;
        center: () => import("../../../typings").IPoint;
        getScale: (depth: number) => import("@visactor/vscale").IBaseScale;
        getAxisId: () => number;
    };
    protected initScales(): void;
    transformScaleDomain(): void;
}
export declare const registerPolarBandAxis: () => void;
