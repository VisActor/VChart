import { Factory } from './../core/factory';
import type { Maybe } from '../typings';
// eslint-disable-next-line no-duplicate-imports
import { warn } from '../util/debug';
import type { IGroupMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMark, IMarkRaw, IMarkStyle, MarkType } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { registerGroupGraphic, type IGroupMark as IVGrammarGroupMark } from '@visactor/vgrammar-core';
import type { IMarkCompileOption } from '../compile/mark';

export interface IGroupMark extends IMarkRaw<IGroupMarkSpec> {
  // groupMark的zIndex只能配在外层，encode里不生效，且无法写成signal
  // {type:'group', zIndex: 100} ✅
  // {type:'group', encode:{enter:{zIndex:{value:100}}}} ❌
  // {type:'group', zIndex: {signal: }} ❌

  addMark: (m: IMark) => boolean;
  removeMark: (m: IMark) => boolean;
  // TODO: 这里可能会出现mark嵌套的问题
  getMarks: () => IMark[];
  getMarkInType: (type: MarkType) => IMark[];
  getMarkInId: (id: number) => IMark | undefined;
  getMarkInName: (name: string) => IMark | undefined;
}

export class GroupMark extends BaseMark<IGroupMarkSpec> implements IGroupMark {
  static readonly type = MarkTypeEnum.group;
  readonly type = GroupMark.type;
  protected _marks: IMark[] = [];
  getMarks(): IMark[] {
    return this._marks;
  }

  protected declare _product: Maybe<IVGrammarGroupMark>;
  declare getProduct: () => Maybe<IVGrammarGroupMark>;

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IGroupMarkSpec> = {
      ...super._getDefaultStyle(),
      clip: false
    };
    return defaultStyle;
  }

  protected isMarkExist(mark: IMark): boolean {
    return this._marks.find(m => m.id === mark.id || m.name === mark.name) !== undefined;
  }

  addMark(mark: IMark): boolean {
    if (this.isMarkExist(mark)) {
      warn('Mark already exists, add mark failed.');
      return false;
    }

    this._marks.push(mark);
    return true;
  }

  removeMark(mark: IMark): boolean {
    const index = this._marks.findIndex(m => m.id === mark.id || m.name === mark.name);
    if (index === -1) {
      warn('Mark does not exists, removeMark failed.');
      return false;
    }
    this._marks.splice(index, 1);
    return true;
  }

  getMarkInType(type: MarkType) {
    return this._marks.filter(m => m.type === type);
  }

  getMarkInId(id: number) {
    return this._marks.find(m => m.id === id);
  }

  getMarkInName(name: string) {
    return this._marks.find(m => m.name === name);
  }

  protected _compileProduct(option?: IMarkCompileOption): void {
    // 编译自身
    super._compileProduct(option);

    // 设置zIndex
    this._product.configure({
      zIndex: this.getZIndex()
    });

    // 编译子元素
    if (!option?.ignoreChildren) {
      this.getMarks().forEach(mark => {
        // TODO: 如果语法元素已创建，先删除再重新指定父结点生成。vgrammar 是否可以动态指定 mark 父结点？
        if (mark.getProduct()) {
          mark.removeProduct();
        }
        mark.compile({ group: this._product });
      });
    }
  }
}

export const registerGroupMark = () => {
  registerGroupGraphic();
  Factory.registerMark(GroupMark.type, GroupMark);
};
