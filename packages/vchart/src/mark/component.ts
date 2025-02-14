import { Factory } from './../core/factory';
import type { ICommonSpec } from '../typings';
import { BaseMark } from './base/base-mark';
import type { IComponentMark, IMarkOption, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import type { IGraphic, IGroupGraphicAttribute } from '@visactor/vrender-core';
import { STATE_VALUE_ENUM } from '../compile/mark/interface';
import { isNil } from '@visactor/vutils';

export class ComponentMark extends BaseMark<ICommonSpec> implements IComponentMark {
  static readonly type = MarkTypeEnum.component;
  type: string = 'component';

  private _componentType: string;
  private _component: IGraphic;
  private _mode: '2d' | '3d';

  constructor(name: string, option: IMarkOption) {
    super(name, option);
    // 这里需要将 type 指定为具体的组件名称，即调用 vgrammar 的 registerComponent API 注册的组件名称
    this._componentType = option.componentType;

    this._mode = option.mode;
  }

  protected _getDefaultStyle(): IMarkStyle<ICommonSpec> {
    return {};
  }

  getComponent() {
    return this._component;
  }

  getAttrsFromConfig(attrs: IGroupGraphicAttribute = {}) {
    const configAttrs = super.getAttrsFromConfig(attrs);

    if (!isNil(this._markConfig.interactive)) {
      configAttrs.pickable = this._markConfig.interactive;
    }
    return attrs;
  }

  protected _attributesTransform: (attrs: any) => any;
  setAttributeTransform(t: (attrs: any) => any) {
    this._attributesTransform = t;
  }

  render(): void {
    if (!this._isCommited) {
      return;
    }

    const { [STATE_VALUE_ENUM.STATE_NORMAL]: normalStyle } = this.stateStyle;
    let attrs = this.getAttrsFromConfig({ ...normalStyle } as unknown as IGroupGraphicAttribute);

    if (this._attributesTransform) {
      attrs = this._attributesTransform(attrs);
    }

    if (!this._component) {
      this._component = Factory.createGraphicComponent(this._componentType, attrs, {
        mode: this._mode,
        skipDefault: this._markConfig.skipTheme
      });
      this._product.appendChild(this._component);
    } else {
      this._component.setAttributes(attrs as any);
    }

    this.uncommit();
  }

  /** 创建语法元素对象 */
  // protected _initProduct(group?: string | IGroupMark) {
  //   const view = this.getVGrammarView();

  //   // 声明语法元素
  //   const id = this.getProductId();
  //   this._product = view
  //     .mark(GrammarMarkType.component, group ?? view.rootMark, { componentType: this._componentType, mode: this._mode })
  //     .id(id);
  //   this._compiledProductId = id;
  // }
}

export const registerComponentMark = () => {
  Factory.registerMark(ComponentMark.type, ComponentMark);
};
