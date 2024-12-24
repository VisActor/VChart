import type { Maybe } from '../typings';
import type { IGroupMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IGroupMark, IMark, IMarkStyle, MarkType } from './interface';
import { MarkTypeEnum } from './interface/type';
import type { IGroupMark as IVGrammarGroupMark } from '@visactor/vgrammar-core';
import type { IMarkCompileOption } from '../compile/mark';
export declare class GroupMark extends BaseMark<IGroupMarkSpec> implements IGroupMark {
    static readonly type = MarkTypeEnum.group;
    readonly type = MarkTypeEnum.group;
    protected _marks: IMark[];
    getMarks(): IMark[];
    protected _product: Maybe<IVGrammarGroupMark>;
    getProduct: () => Maybe<IVGrammarGroupMark>;
    protected _getDefaultStyle(): IMarkStyle<IGroupMarkSpec>;
    protected isMarkExist(mark: IMark): boolean;
    addMark(mark: IMark): boolean;
    removeMark(mark: IMark): boolean;
    getMarkInType(type: MarkType): IMark[];
    getMarkInId(id: number): IMark;
    getMarkInUserId(id: string | number): IMark;
    getMarkInName(name: string): IMark[];
    protected _compileProduct(option?: IMarkCompileOption): void;
}
export declare const registerGroupMark: () => void;
