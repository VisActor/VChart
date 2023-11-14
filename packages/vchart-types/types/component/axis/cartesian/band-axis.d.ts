import { BandScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import type { ICartesianBandAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface';
import { BandAxisMixin } from '../mixin/band-axis-mixin';
import type { StringOrNumber } from '../../../typings';
export interface CartesianBandAxis<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec> extends Pick<BandAxisMixin, 'valueToPosition' | 'updateGroupScaleRange' | 'getPosition' | 'calcScales' | 'computeBandDomain'>, CartesianAxis<T> {
}
export declare class CartesianBandAxis<T extends ICartesianBandAxisSpec = ICartesianBandAxisSpec> extends CartesianAxis<T> {
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
    protected initScales(): void;
    protected axisHelper(): {
        isContinuous: boolean;
        dataToPosition: (values: any[]) => number;
        getScale: (depth: number) => BandScale;
        getBandwidth: (depth: number) => number;
        getStatisticsDomain: () => {
            domain: any[];
            index: {
                [x: string]: number;
                [x: number]: number;
            };
        };
        getAxisType: () => ComponentTypeEnum;
        getAxisId: () => number;
        isInverse: () => boolean;
    };
    transformScaleDomain(): void;
    updateFixedWholeLength(): void;
}
export declare const registerCartesianBandAxis: () => void;
