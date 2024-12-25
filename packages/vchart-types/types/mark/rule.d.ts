import type { IRuleMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkStyle, IRuleMark } from './interface';
import { MarkTypeEnum } from './interface/type';
export declare class RuleMark extends BaseMark<IRuleMarkSpec> implements IRuleMark {
    static readonly type = MarkTypeEnum.rule;
    readonly type = MarkTypeEnum.rule;
    protected _getDefaultStyle(): IMarkStyle<IRuleMarkSpec>;
}
export declare const registerRuleMark: () => void;
