import type { IBoxPlotMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IGroupMark } from '@visactor/vgrammar-core';
import type { IMarkRaw, IMarkStyle } from './interface';
import { MarkTypeEnum } from './interface/type';
export type IBoxPlotMark = IMarkRaw<IBoxPlotMarkSpec>;
export declare class BoxPlotMark extends BaseMark<IBoxPlotMarkSpec> implements IBoxPlotMark {
    static readonly type = MarkTypeEnum.boxPlot;
    readonly type = MarkTypeEnum.boxPlot;
    protected _getDefaultStyle(): IMarkStyle<IBoxPlotMarkSpec>;
    protected _initProduct(group?: string | IGroupMark): void;
}
export declare const registerBoxPlotMark: () => void;
