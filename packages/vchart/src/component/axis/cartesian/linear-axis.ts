import type { LogScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { LinearScale } from '@visactor/vscale';
import { CartesianAxis } from './axis';
import { isValid, isValidNumber, last, mixin } from '@visactor/vutils';
import type { IAxisHelper, ICartesianLinearAxisSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import { LinearAxisMixin } from '../mixin/linear-axis-mixin';
import { Factory } from '../../../core/factory';
import { registerAxis } from '../base-axis';
import { registerLineAxis, registerLineGrid } from '@visactor/vgrammar-core';
import { registerDataSetInstanceTransform } from '../../../data/register';
import type { ICartesianTickDataOpt } from '@visactor/vrender-components';
import { continuousTicks } from '@visactor/vrender-components';
import { isXAxis, isZAxis } from './util';
import { combineDomains, isPercent } from '../../../util';

export interface CartesianLinearAxis<T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec>
  extends Pick<
      LinearAxisMixin,
      | 'setExtraAttrFromSpec'
      | 'computeLinearDomain'
      | 'valueToPosition'
      | 'setScaleNice'
      | '_domain'
      | 'transformScaleDomain'
      | 'setExtendDomain'
      | '_break'
    >,
    CartesianAxis<T> {}

export class CartesianLinearAxis<
  T extends ICartesianLinearAxisSpec = ICartesianLinearAxisSpec
> extends CartesianAxis<T> {
  static type = ComponentTypeEnum.cartesianLinearAxis;
  type = ComponentTypeEnum.cartesianLinearAxis;

  static specKey = 'axes';

  protected _zero: boolean = true;
  protected _nice: boolean = true;
  protected _extend: { [key: string]: number } = {};

  protected _scale: LinearScale | LogScale = new LinearScale();
  protected declare _scales: LinearScale[] | LogScale[];

  setAttrFromSpec(): void {
    super.setAttrFromSpec();
    this.setExtraAttrFromSpec();
    const tickTransform = this._tickData?.[0]
      ?.getDataView()
      .transformsArr.find(t => t.type === this.registerTicksTransform());
    tickTransform && (tickTransform.options = this._tickTransformOption());
  }

  /**
   * @override
   */
  protected initScales() {
    super.initScales();
    const range = [0, 1];
    if (isValid(this._domain?.min)) {
      range[0] = this._domain.min;
    }
    if (isValid(this._domain?.max)) {
      range[1] = this._domain.max;
    }
    this._scale.domain(range);
    // this.setScaleNice();
  }

  protected _tickTransformOption() {
    return {
      ...super._tickTransformOption(),
      breakData: this._spec.breaks?.length ? () => this._break : null
    } as ICartesianTickDataOpt;
  }

  protected _getUpdateAttribute(ignoreGrid: boolean) {
    const attrs = super._getUpdateAttribute(ignoreGrid);

    // get axis break configuration
    if (!isZAxis(this._orient) && this._break?.breaks?.length) {
      const { width, height } = this.getLayoutRect();
      const isX = isXAxis(this._orient);
      const axisLength = isX ? width : height;

      attrs.breaks = this._break.breaks.map(obj => {
        const { range, breakSymbol, gap = 6 } = obj;
        const position = this.valueToPosition((range[0] + range[1]) / 2);
        const ratio = position / axisLength;

        let gapRatio;
        if (isPercent(gap)) {
          gapRatio = Number(gap.substring(0, gap.length - 1)) / 100;
        } else {
          gapRatio = (gap as number) / axisLength;
        }
        const symbolAngle = isValidNumber(breakSymbol?.angle) ? breakSymbol.angle : isX ? 60 : 15;

        return {
          range: [ratio - gapRatio / 2, ratio + gapRatio / 2],
          breakSymbol: {
            visible: true,
            ...breakSymbol,
            angle: (symbolAngle * Math.PI) / 180
          },
          rawRange: range
        };
      });
    }

    return attrs;
  }

  protected getNewScaleRange() {
    let newRange = super.getNewScaleRange();
    if (this._spec.breaks?.length && this._break?.scope) {
      // get axis breaks
      newRange = combineDomains(this._break.scope).map(val => newRange[0] + (last(newRange) - newRange[0]) * val);
    }

    return newRange;
  }

  protected computeDomain(data: { min: number; max: number; values: any[] }[]): number[] {
    return this.computeLinearDomain(data);
  }

  protected axisHelper() {
    const helper: IAxisHelper = super.axisHelper();
    helper.setExtendDomain = this.setExtendDomain.bind(this);
    helper.valueToPosition = this.valueToPosition.bind(this);
    return helper;
  }

  protected registerTicksTransform() {
    const name = `${this.type}-ticks`;
    registerDataSetInstanceTransform(this._option.dataSet, name, continuousTicks);

    return name;
  }
}

mixin(CartesianLinearAxis, LinearAxisMixin);

export const registerCartesianLinearAxis = () => {
  registerLineAxis();
  registerLineGrid();
  registerAxis();
  Factory.registerComponent(CartesianLinearAxis.type, CartesianLinearAxis);
};
