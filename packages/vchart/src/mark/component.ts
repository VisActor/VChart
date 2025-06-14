import { Factory } from './../core/factory';
import type { ICommonSpec } from '../typings';
import { BaseMark } from './base/base-mark';
import type { IComponentMark, IMarkOption, IMarkStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface/type';
import type { IGraphic, IGroupGraphicAttribute } from '@visactor/vrender-core';
import { isNil } from '@visactor/vutils';
import { HOOK_EVENT } from '../constant/event';

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
  clearComponent() {
    if (this._component) {
      if (this._component.parent) {
        this._component.parent.removeChild(this._component);
      }

      this._component = null;
    }
  }

  protected _getAttrsFromConfig(attrs: IGroupGraphicAttribute = {}) {
    const configAttrs = super._getAttrsFromConfig(attrs);

    if (!isNil(this._markConfig.interactive)) {
      configAttrs.pickable = this._markConfig.interactive;
    }
    return attrs;
  }

  protected _attributesTransform: (attrs: any) => any;
  setAttributeTransform(t: (attrs: any) => any) {
    this._attributesTransform = t;
  }

  renderInner() {
    const style = this._simpleStyle ?? this.getAttributesOfState({});

    let attrs = this._getAttrsFromConfig(style as unknown as IGroupGraphicAttribute);

    if (this._attributesTransform) {
      attrs = this._attributesTransform(attrs);
    }

    if (this._animationConfig) {
      attrs = {
        ...attrs,
        animation: true,
        animationAppear: this._animationConfig.appear
          ? Array.isArray(this._animationConfig.appear)
            ? this._animationConfig.appear[0]
            : this._animationConfig.appear
          : undefined,
        animationEnter: this._animationConfig.enter
          ? Array.isArray(this._animationConfig.enter)
            ? this._animationConfig.enter[0]
            : this._animationConfig.enter
          : undefined,
        animationUpdate: this._animationConfig.update
          ? Array.isArray(this._animationConfig.update)
            ? this._animationConfig.update[0]
            : this._animationConfig.update
          : undefined,
        animationExit: this._animationConfig.exit
          ? Array.isArray(this._animationConfig.exit)
            ? this._animationConfig.exit[0]
            : this._animationConfig.exit
          : undefined
      } as any;
    }

    if (!this._component) {
      this._component = Factory.createGraphicComponent(this._componentType, attrs, {
        mode: this._mode,
        skipDefault: this._markConfig.skipTheme
      });
      this._component && this._product.appendChild(this._component);
    } else {
      this._component.setAttributes(attrs as any);
    }

    if (this._component) {
      this._component.context = this._getCommonContext();
    }

    if (this._markConfig.support3d && this._product) {
      this._product.setMode('3d');
    }

    this.model.event.emit(HOOK_EVENT.AFTER_ELEMENT_ENCODE, {
      mark: this,
      model: this.model
    });
    this.needClear = true;
  }

  release() {
    super.release();
    this.removeProduct();
  }
}

export const registerComponentMark = () => {
  Factory.registerMark(ComponentMark.type, ComponentMark);
};
