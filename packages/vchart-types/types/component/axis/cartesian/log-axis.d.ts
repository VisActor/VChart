import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface/type';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { LogScale } from '@visactor/vscale';
import type { ICartesianLogAxisSpec } from './interface';
export interface CartesianLogAxis<T extends ICartesianLogAxisSpec = ICartesianLogAxisSpec> extends Pick<LinearAxisMixin, 'valueToPosition' | 'dataToPosition'>, CartesianLinearAxis<T> {
}
export declare class CartesianLogAxis<T extends ICartesianLogAxisSpec = ICartesianLogAxisSpec> extends CartesianLinearAxis<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    protected _zero: boolean;
    protected _scale: LogScale;
    protected _scales: LogScale[];
    protected initScales(): void;
    transformScaleDomain(): void;
}
export declare const registerCartesianLogAxis: () => void;
