import { Factory } from './../core/factory';
import type { Maybe } from '../typings';
// eslint-disable-next-line no-duplicate-imports
import { log, warn } from '../util/debug';
import type { IGroupMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { AnimationStateValues, IGroupMark, IMark, IMarkGraphic, MarkType } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import { type IMarkCompileOption } from '../compile/mark';
import type { IGroup, IGroupGraphicAttribute } from '@visactor/vrender-core';
import { registerGroup, registerShadowRoot } from '@visactor/vrender-kits';
import { isNil } from '@visactor/vutils';
import { traverseGroupMark } from '../compile/util';
import { LayoutState } from '../compile/interface';

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
    traverseGroupMark(
      this,
      m => {
        result = m;
      },
      m => m.getUserId() === id,
      null,
      true
    );

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
      mark.compile({ group: this._product });
    });
  }

  protected _getAttrsFromConfig(attrs: IGroupGraphicAttribute = {}) {
    const configAttrs = super._getAttrsFromConfig(attrs);

    if (!isNil(this._markConfig.interactive)) {
      configAttrs.pickable = this._markConfig.interactive;
    }
    return attrs;
  }

  getGraphics(): IMarkGraphic[] {
    return [this._product as unknown as IMarkGraphic];
  }

  renderInner() {
    if (!this._product) {
      return;
    }

    const style = this._simpleStyle ?? this.getAttributesOfState({});

    this._product.context = { ...this._product.context, ...this._getCommonContext() };
    this._product.setAttributes(this._getAttrsFromConfig(style));
    this.needClear = true;
  }

  render(): void {
    if (this._isCommited) {
      log(`render mark: ${this.getProductId()}, type is ${this.type}`);
      this.renderInner();
      this.uncommit();
    }

    this.getMarks().forEach(mark => {
      mark.render();
    });
  }

  updateAnimationState(callback: (g: IMarkGraphic) => AnimationStateValues) {
    this.getGraphics().forEach(g => {
      if (g) {
        g.context = { ...g.context, animationState: callback(g) };
      }
    });
    this.getMarks().forEach(mark => {
      mark.updateAnimationState(callback);
    });
  }

  release() {
    super.release();
    this.removeProduct();
  }
}

export const registerGroupMark = () => {
  registerShadowRoot();
  registerGroup();
  Factory.registerMark(GroupMark.type, GroupMark);
};
