import { Factory } from './../core/factory';
import type { Maybe } from '../typings';
// eslint-disable-next-line no-duplicate-imports
import { warn } from '../util/debug';
import type { IGroupMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IGroupMark, IMark, IMarkStyle, MarkType } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { STATE_VALUE_ENUM, type IMarkCompileOption } from '../compile/mark';
import type { IGroup, IGroupGraphicAttribute } from '@visactor/vrender-core';
import { registerGroup, registerShadowRoot } from '@visactor/vrender-kits';
import { isNil } from '@visactor/vutils';

export class GroupMark extends BaseMark<IGroupMarkSpec> implements IGroupMark {
  static readonly type = MarkTypeEnum.group;
  readonly type = GroupMark.type;
  protected _marks: IMark[] = [];
  getMarks(): IMark[] {
    return this._marks;
  }

  protected declare _product: Maybe<IGroup>;
  declare getProduct: () => Maybe<IGroup>;

  protected isMarkExist(mark: IMark): boolean {
    return this._marks.find(m => m.id === mark.id) !== undefined;
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

  getMarkInUserId(id: string | number) {
    let result: IMark | undefined;
    this._marks.forEach(m => {
      if (m.getUserId() === id) {
        result = m;
      }
    });

    if (!result) {
      for (let i = 0; i < this._marks.length; i++) {
        const mark = this._marks[i];
        if (mark.type === 'group') {
          result = (mark as GroupMark).getMarkInUserId(id);
        }
        if (result) {
          break;
        }
      }
    }

    return result;
  }

  getMarkInName(name: string) {
    return this._marks.filter(m => m.name === name);
  }

  protected _compileProduct(option?: IMarkCompileOption): void {
    // 编译自身
    super._compileProduct(option);

    // 设置zIndex
    // this._product.configure({
    //   zIndex: this._markConfig.zIndex
    // });

    // 编译子元素
    this.getMarks().forEach(mark => {
      // TODO: 如果语法元素已创建，先删除再重新指定父结点生成。vgrammar 是否可以动态指定 mark 父结点？
      if (mark.getProduct()) {
        mark.removeProduct();
      }
      mark.compile({ group: this._product });
    });
  }

  getAttrsFromConfig(attrs: IGroupGraphicAttribute = {}) {
    const configAttrs = super.getAttrsFromConfig(attrs);

    if (!isNil(this._markConfig.interactive)) {
      configAttrs.pickable = this._markConfig.interactive;
    }
    return attrs;
  }

  protected _renderSelf() {
    const { [STATE_VALUE_ENUM.STATE_NORMAL]: normalStyle } = this.stateStyle;
    const attrs: any = {};

    Object.keys(normalStyle).forEach(key => {
      if (this._unCompileChannel[key]) {
        return;
      }

      attrs[key] = this._computeAttribute(key, 'normal')({});
    });

    this._product?.setAttributes(this.getAttrsFromConfig(attrs));
  }

  render(): void {
    if (this._isCommited) {
      this._renderSelf();
    }
    this.uncommit();

    this.getMarks().forEach(mark => {
      mark.render();
    });
  }
}

export const registerGroupMark = () => {
  registerShadowRoot();
  registerGroup();
  Factory.registerMark(GroupMark.type, GroupMark);
};
