import type { IRuleMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface';
export type IRuleMark = IMarkRaw<IRuleMarkSpec>;
export declare class RuleMark extends BaseMark<IRuleMarkSpec> implements IRuleMark {
  static readonly type = MarkTypeEnum.rule;
  readonly type = MarkTypeEnum.rule;
  protected _getDefaultStyle(): IMarkStyle<IRuleMarkSpec>;
}
