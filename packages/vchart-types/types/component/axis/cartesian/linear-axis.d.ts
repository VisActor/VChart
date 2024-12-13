import type { LogScale } from '@visactor/vscale';
import { LinearScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import type { IAxisHelper, ICartesianLinearAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import type { ICartesianTickDataOpt } from '@visactor/vrender-components';
export interface CartesianLinearAxis<T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec> extends Pick<LinearAxisMixin, 'setExtraAttrFromSpec' | 'computeLinearDomain' | 'valueToPosition' | 'setScaleNice' | '_domain' | 'transformScaleDomain' | 'setExtendDomain' | '_break'>, CartesianAxis<T> {
}
export declare class CartesianLinearAxis<T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec> extends CartesianAxis<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    static specKey: string;
    protected _zero: boolean;
    protected _nice: boolean;
    protected _extend: {
        [key: string]: number;
    };
    protected _scale: LinearScale | LogScale;
    protected _scales: LinearScale[] | LogScale[];
    setAttrFromSpec(): void;
    protected initScales(): void;
    protected _tickTransformOption(): ICartesianTickDataOpt;
    protected _getUpdateAttribute(ignoreGrid: boolean): any;
    protected getNewScaleRange(): number[];
    protected computeDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): number[];
    protected axisHelper(): IAxisHelper;
    protected registerTicksTransform(): string;
}
export declare const registerCartesianLinearAxis: () => void;
