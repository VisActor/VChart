import type { Maybe } from '../typings';
import type { IGroupMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMark, IMarkRaw, IMarkStyle, MarkType } from './interface';
import { MarkTypeEnum } from './interface';
import type { IGroupMark as IVGrammarGroupMark } from '@visactor/vgrammar-core';
import type { IMarkCompileOption } from '../compile/mark';
export interface IGroupMark extends IMarkRaw<IGroupMarkSpec> {
  addMark: (m: IMark) => boolean;
  removeMark: (m: IMark) => boolean;
  getMarks: () => IMark[];
  getMarkInType: (type: MarkType) => IMark[];
  getMarkInId: (id: number) => IMark | undefined;
  getMarkInName: (name: string) => IMark | undefined;
}
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
  getMarkInName(name: string): IMark;
  protected _compileProduct(option?: IMarkCompileOption): void;
}
