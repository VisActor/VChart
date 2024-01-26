import type { ILiquidMarkSpec } from '../typings';
import type { IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
import { BaseMark } from './base';
import type { ILiquidMark } from '../series/liquid/liquid';
import type { IGroupMark } from '@visactor/vgrammar-core';
export declare class LiquidMark extends BaseMark<ILiquidMarkSpec> implements ILiquidMark {
    static readonly type = MarkTypeEnum.liquid;
    readonly type = MarkTypeEnum.liquid;
    protected _getDefaultStyle(): IMarkStyle<ILiquidMarkSpec>;
    protected _initProduct(group?: string | IGroupMark): void;
}
export declare const registerLiquidMark: () => void;
