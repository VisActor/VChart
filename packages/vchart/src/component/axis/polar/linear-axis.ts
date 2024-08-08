import { LinearScale } from '@visactor/vscale';
import { ComponentTypeEnum } from '../../interface/type';
import { PolarAxis } from './axis';
import type { IPolarLinearAxisSpec } from './interface/spec';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { mixin } from '@visactor/vutils';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';
import type { IPolarAxisHelper } from './interface';
import { registerLineAxis, registerLineGrid, registerCircleAxis, registerCircleGrid } from '@visactor/vgrammar-core';
import { continuousTicks } from '@visactor/vrender-components';
import { registerDataSetInstanceTransform } from '../../../data/register';

export interface PolarLinearAxis<T extends IPolarLinearAxisSpec = IPolarLinearAxisSpec>
  extends Pick<
      LinearAxisMixin,
      | 'setExtraAttrFromSpec'
      | 'transformScaleDomain'
      | 'valueToPosition'
      | 'computeLinearDomain'
      | 'setScaleNice'
      | 'setExtendDomain'
    >,
    PolarAxis<T> {}

export class PolarLinearAxis<T extends IPolarLinearAxisSpec = IPolarLinearAxisSpec> extends PolarAxis<T> {
  static type = ComponentTypeEnum.polarLinearAxis;
  type = ComponentTypeEnum.polarLinearAxis;

  static specKey = 'axes';

  protected _zero: boolean = true;
  protected _nice: boolean = true;
  protected _extend: { [key: string]: number } = {};

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

  protected axisHelper() {
    const helper: IPolarAxisHelper = super.axisHelper();
    helper.setExtendDomain = this.setExtendDomain.bind(this);
    return helper as any;
  }

  protected registerTicksTransform() {
    const name = `${this.type}-ticks`;
    registerDataSetInstanceTransform(this._option.dataSet, name, continuousTicks);

    return name;
  }
}

mixin(PolarLinearAxis, LinearAxisMixin);

export const registerPolarLinearAxis = () => {
  registerLineAxis();
  registerLineGrid();
  registerCircleAxis();
  registerCircleGrid();
  registerAxis();
  Factory.registerComponent(PolarLinearAxis.type, PolarLinearAxis);
};
