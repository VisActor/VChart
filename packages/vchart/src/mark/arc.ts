import { ARC_MIDDLE_ANGLE } from '../constant';
import type { IArcMarkSpec, VisualType, Datum, StateValueType, IArc3dMarkSpec } from '../typings';
import { polarToCartesian } from '../util/math';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle, StyleConvert } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type IArcMark = IMarkRaw<IArcMarkSpec>;
export type IArc3dMark = IMarkRaw<IArc3dMarkSpec>;

export class BaseArcMark<T extends IArcMarkSpec> extends BaseMark<T> implements IMarkRaw<T> {
  readonly type: MarkTypeEnum = ArcMark.type;

  _unCompileChannel = { centerOffset: true };

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<T> = {
      ...super._getDefaultStyle(),
      startAngle: 0,
      endAngle: 0,
      outerRadius: 0,
      innerRadius: 0,
      cornerRadius: 0,
      lineWidth: 0
    };
    return defaultStyle;
  }

  setAttribute<U extends keyof T>(
    attr: U,
    style: StyleConvert<T[U]> | VisualType<T[U]>,
    state: StateValueType = 'normal',
    level: number = 0,
    stateStyle = this.stateStyle
  ) {
    super.setAttribute(attr, style, state, level, stateStyle);
    // centerOffset 在图表侧实现，如果只设置了centerOffset 则自动补充一个与normal一样的 xy
    if (attr === 'centerOffset' && state !== 'normal') {
      if (stateStyle[state].x === undefined) {
        stateStyle[state].x = stateStyle.normal.x;
      }
      if (stateStyle[state].y === undefined) {
        stateStyle[state].y = stateStyle.normal.y;
      }
    }
  }

  protected _computeAttribute<U extends keyof T>(key: U, datum: Datum, state: StateValueType = 'normal', opt: any) {
    const superValue = super._computeAttribute(key, datum, state, opt);
    if (superValue === undefined || (key !== 'x' && key !== 'y')) {
      return superValue;
    }
    // 额外的offset计算
    return this.computeCenter(key, datum, state, opt, superValue);
  }

  protected computeCenter = (
    key: 'x' | 'y',
    datum: Datum,
    states: StateValueType = 'normal',
    opt: any,
    center: number
  ) => {
    const offset = polarToCartesian({
      angle: datum[ARC_MIDDLE_ANGLE],
      radius: this._computeAttribute('centerOffset', datum, states, opt)
    });
    return center + offset[key];
  };
}

export class ArcMark extends BaseArcMark<IArcMarkSpec> implements IArcMark {
  static readonly type = MarkTypeEnum.arc;
  readonly type: MarkTypeEnum = ArcMark.type;
}

export class Arc3dMark extends BaseArcMark<IArc3dMarkSpec> implements IArc3dMark {
  static readonly type = MarkTypeEnum.arc3d;
  readonly type: MarkTypeEnum = Arc3dMark.type;
}
