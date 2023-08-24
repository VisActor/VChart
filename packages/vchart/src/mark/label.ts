import { MarkTypeEnum, type IMark } from './interface';
import { TextMark } from './text';

export class LabelMark extends TextMark implements ILabelMark {
  static readonly type = MarkTypeEnum.text;
  static readonly constructorType = MarkTypeEnum.label;

  target: IMark;
  getTarget() {
    return this.target;
  }
  setTarget(target: IMark) {
    this.target = target;
  }
}

export interface ILabelMark extends IMark {
  getTarget: () => IMark;
  setTarget: (target: IMark) => void;
}
