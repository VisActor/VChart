import type { IEffect } from '../../../model/interface';
import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface/type';
import { CompilableData } from '../../../compile/data/compilable-data';
import type { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import type { ICartesianTimeAxisSpec } from './interface';
export interface CartesianTimeAxis<T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec> extends Pick<LinearAxisMixin, 'valueToPosition'>, CartesianLinearAxis<T> {
}
export declare class CartesianTimeAxis<T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec> extends CartesianLinearAxis<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    static specKey: string;
    protected _layerTickData: CompilableData;
    protected _zero: boolean;
    effect: IEffect;
    setAttrFromSpec(): void;
    protected _initData(): void;
    protected computeData(updateType?: 'range' | 'domain' | 'force'): void;
    protected _getLabelFormatMethod(): any;
    protected getLabelItems(length: number): any[];
    transformScaleDomain(): void;
}
export declare const registerCartesianTimeAxis: () => void;
