import { LinearScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface';
import { PolarAxis } from './axis';
import type { IPolarLinearAxisSpec } from './interface/spec';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
export interface PolarLinearAxis<T extends IPolarLinearAxisSpec = IPolarLinearAxisSpec>
  extends Pick<
      LinearAxisMixin,
      'setExtraAttrFromSpec' | 'transformScaleDomain' | 'valueToPosition' | 'computeLinearDomain' | 'setScaleNice'
    >,
    PolarAxis<T> {}
export declare class PolarLinearAxis<T extends IPolarLinearAxisSpec = IPolarLinearAxisSpec> extends PolarAxis<T> {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  protected _zero: boolean;
  protected _nice: boolean;
  protected _scale: LinearScale;
  protected _groupScales: LinearScale[];
  setAttrFromSpec(): void;
  protected initScales(): void;
  protected computeDomain(
    data: {
      min: number;
      max: number;
      values: any[];
    }[]
  ): number[];
}
