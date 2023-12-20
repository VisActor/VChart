import { Factory } from './../core/factory';
import type { IRuleMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerRuleGraphic } from '@visactor/vgrammar-core';

export type IRuleMark = IMarkRaw<IRuleMarkSpec>;

export class RuleMark extends BaseMark<IRuleMarkSpec> implements IRuleMark {
  static readonly type = MarkTypeEnum.rule;
  readonly type = RuleMark.type;
  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IRuleMarkSpec> = {
      ...super._getDefaultStyle(),
      x1: 0,
      y1: 0
    };
    return defaultStyle;
  }
}

export const registerRuleMark = () => {
  Factory.registerMark(RuleMark.type, RuleMark);
  registerRuleGraphic();
};
