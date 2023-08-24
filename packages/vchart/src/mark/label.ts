import type { IComponentMark } from './component';
import { MarkTypeEnum, type IMark } from './interface';
import { TextMark } from './text';

export class LabelMark extends TextMark implements ILabelMark {
  static readonly type = MarkTypeEnum.text;
  static readonly constructorType = MarkTypeEnum.label;

  private _target: IMark;
  getTarget() {
    return this._target;
  }
  setTarget(target: IMark) {
    this._target = target;
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
  getTarget: () => IMark;
  setTarget: (target: IMark) => void;

  getComponent: () => IComponentMark;
  setComponent: (component: IComponentMark) => void;
}
