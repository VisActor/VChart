import { Factory } from './../core/factory';
import { ARC_MIDDLE_ANGLE } from '../constant';
import type { IArcMarkSpec, Datum, StateValueType } from '../typings';
import { polarToCartesian } from '../util/math';
import type { ExChannelCall } from './base/base-mark';
// eslint-disable-next-line no-duplicate-imports
import { BaseMark } from './base/base-mark';
import type { IMarkOption, IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerArcGraphic } from '@visactor/vgrammar-core';
import { registerVGrammarArcAnimation } from '../animation/config';
import { isValid } from '@visactor/vutils';

export type IArcMark = IMarkRaw<IArcMarkSpec>;

export class BaseArcMark<T extends IArcMarkSpec> extends BaseMark<T> implements IMarkRaw<T> {
  readonly type: MarkTypeEnum = ArcMark.type;

  _unCompileChannel = { centerOffset: true, radiusOffset: true };

  constructor(name: string, option: IMarkOption) {
    super(name, option);

    // because of set object.function, this setting should be write after object init
    this._computeExChannel.x = this.computeCenter as ExChannelCall;
    this._computeExChannel.y = this.computeCenter as ExChannelCall;
    this._computeExChannel.outerRadius = this.computeOuterRadius as ExChannelCall;

    this._extensionChannel.centerOffset = ['x', 'y'];
    this._extensionChannel.radiusOffset = ['outerRadius'];
  }

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<T> = {
      ...super._getDefaultStyle(),
      startAngle: 0,
      endAngle: 0,
      outerRadius: 0,
      innerRadius: 0,
      cornerRadius: 0,
      lineWidth: 0,
      innerPadding: 0,
      outerPadding: 0
    };
    return defaultStyle;
  }

  protected computeOuterRadius = (
    key: string,
    datum: Datum,
    states: StateValueType = 'normal',
    opt: any,
    superValue: number
  ): number => {
    const offset = (this.getAttribute('radiusOffset', datum, states, opt) as number) ?? 0;
    return superValue + offset;
  };

  protected computeCenter = (
    key: 'x' | 'y',
    datum: Datum,
    states: StateValueType = 'normal',
    opt: any,
    center: number
  ) => {
    const offset = polarToCartesian({
      angle: datum[ARC_MIDDLE_ANGLE],
      radius: this.getAttribute('centerOffset', datum, states, opt) as number
    });
    return center + offset[key];
  };

  protected _filterStyle(
    style: Partial<IMarkStyle<T>>,
    state: StateValueType,
    level: number,
    stateStyle = this.stateStyle
  ) {
    const { innerPadding, outerPadding } = style;

    // padding 符号取反
    if (isValid(innerPadding)) {
      return {
        ...style,
        innerPadding: -innerPadding
      };
    }

    if (isValid(outerPadding)) {
      return {
        ...style,
        outerPadding: -outerPadding
      };
    }

    return style;
  }
}

export class ArcMark extends BaseArcMark<IArcMarkSpec> implements IArcMark {
  static readonly type = MarkTypeEnum.arc;
  readonly type: MarkTypeEnum = ArcMark.type;
}

export const registerArcMark = () => {
  registerArcGraphic();
  registerVGrammarArcAnimation();
  Factory.registerMark(ArcMark.type, ArcMark);
};
