import type { ILineMarkSpec } from '../typings/visual';
import { BaseLineMark } from './base/base-line';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
export type ILineMark = IMarkRaw<ILineMarkSpec>;
export declare class LineMark extends BaseLineMark<ILineMarkSpec> implements ILineMark {
    static readonly type = MarkTypeEnum.line;
    readonly type = MarkTypeEnum.line;
    protected _getDefaultStyle(): IMarkStyle<ILineMarkSpec>;
    protected _getIgnoreAttributes(): string[];
}
