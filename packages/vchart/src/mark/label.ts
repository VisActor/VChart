import type { IComponentMark } from './component';
import { MarkTypeEnum, type IMark } from './interface';
import { TextMark } from './text';

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
      // TODO: 接入 line/area 图元标签后这里需要改造
      const rule = target.type === 'line' || 'area' ? 'lineData' : target.type;
      this.setRule(rule);
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

export interface ILabelMark extends IMark {
  skipEncode: boolean;

  getRule: () => string;
  setRule: (rule: string) => void;

  getTarget: () => IMark;
  setTarget: (target: IMark) => void;

  getComponent: () => IComponentMark;
  setComponent: (component: IComponentMark) => void;
}
