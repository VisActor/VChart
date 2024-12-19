import { registerTextGraphic } from '@visactor/vgrammar-core';
import { Factory } from './../core/factory';
import type { IMark } from './interface/common';
import { MarkTypeEnum } from './interface/type';
import { TextMark } from './text';
import type { ILabelMark } from './interface/mark';

export class LabelMark extends TextMark implements ILabelMark {
  static readonly type = MarkTypeEnum.text;
  static readonly constructorType = MarkTypeEnum.label;

  skipEncode = false;

  private _rule: string;
  getRule() {
    return this._rule;
  }
  setRule(rule: string) {
    this._rule = rule;
  }

  private _target: IMark;
  getTarget() {
    return this._target;
  }
  setTarget(target: IMark) {
    this._target = target;
    if (!this._rule) {
      this.setRule(target.type);
    }
  }

  private _component: IMark;
  getComponent() {
    return this._component;
  }
  setComponent(component: IMark) {
    this._component = component;
  }
}

export const registerLabelMark = () => {
  Factory.registerMark(LabelMark.constructorType, LabelMark);
  registerTextGraphic();
};
