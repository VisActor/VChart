import { LinearScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface';
import { PolarAxis } from './axis';
import type { IPolarLinearAxisSpec } from './interface/spec';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { mixin } from '@visactor/vutils';

export interface PolarLinearAxis
  extends Pick<
      LinearAxisMixin,
      'setExtraAttrFromSpec' | 'transformScaleDomain' | 'valueToPosition' | 'computeLinearDomain' | 'setScaleNice'
    >,
    PolarAxis {}

export class PolarLinearAxis extends PolarAxis {
  static type = ComponentTypeEnum.polarLinearAxis;
  type = ComponentTypeEnum.polarLinearAxis;

  protected _zero: boolean = true;
  protected _nice: boolean = true;

  protected _scale = new LinearScale();
  protected declare _groupScales: LinearScale[];

  protected declare _spec: IPolarLinearAxisSpec;

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
