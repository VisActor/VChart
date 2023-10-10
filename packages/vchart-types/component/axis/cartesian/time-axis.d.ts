import type { IEffect } from '../../../model/interface';
import { CartesianLinearAxis } from './linear-axis';
import { ComponentTypeEnum } from '../../interface';
import { CompilableData } from '../../../compile/data';
import type { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import type { ICartesianTimeAxisSpec } from './interface';
export interface CartesianTimeAxis<T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec>
  extends Pick<LinearAxisMixin, 'valueToPosition' | 'dataToPosition'>,
    CartesianLinearAxis<T> {}
export declare class CartesianTimeAxis<
  T extends ICartesianTimeAxisSpec = ICartesianTimeAxisSpec
> extends CartesianLinearAxis<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  protected _layerTickData: CompilableData;
  protected _zero: boolean;
  effect: IEffect;
  setAttrFromSpec(): void;
  protected _initData(): void;
  protected computeData(): void;
  protected getLabelFormatMethod(): any;
  protected getLabelItems(length: number): any[];
  transformScaleDomain(): void;
}
