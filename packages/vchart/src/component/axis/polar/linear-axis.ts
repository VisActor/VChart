import { LinearScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface';
import { PolarAxis } from './axis';
import type { IPolarLinearAxisSpec } from './interface/spec';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { mixin } from '@visactor/vutils';

export interface PolarLinearAxis<T extends IPolarLinearAxisSpec = IPolarLinearAxisSpec>
  extends Pick<
      LinearAxisMixin,
      'setExtraAttrFromSpec' | 'transformScaleDomain' | 'valueToPosition' | 'computeLinearDomain' | 'setScaleNice'
    >,
    PolarAxis<T> {}

export class PolarLinearAxis<T extends IPolarLinearAxisSpec = IPolarLinearAxisSpec> extends PolarAxis<T> {
  static type = ComponentTypeEnum.polarLinearAxis;
  type = ComponentTypeEnum.polarLinearAxis;

  protected _zero: boolean = true;
  protected _nice: boolean = true;

  protected _scale = new LinearScale();
  protected declare _groupScales: LinearScale[];

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setExtraAttrFromSpec();
  }

  protected initScales() {
    super.initScales();
    this.setScaleNice();
  }

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): number[] {
    return this.computeLinearDomain(data);
  }
}

mixin(PolarLinearAxis, LinearAxisMixin);
