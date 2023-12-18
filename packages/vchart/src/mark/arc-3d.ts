import { Factory } from './../core/factory';
import type { IArc3dMarkSpec } from '../typings';
import { BaseArcMark } from './arc';
import type { IMarkRaw } from './interface';
import { MarkTypeEnum } from './interface/type';
import { registerArc3dGraphic } from '@visactor/vgrammar-core';
import { registerVGrammarArcAnimation } from '../animation/config';

export type IArc3dMark = IMarkRaw<IArc3dMarkSpec>;

export class Arc3dMark extends BaseArcMark<IArc3dMarkSpec> implements IArc3dMark {
  static readonly type = MarkTypeEnum.arc3d;
  readonly type: MarkTypeEnum = Arc3dMark.type;
  protected _support3d?: boolean = true;
}

export const registerArc3dMark = () => {
  registerVGrammarArcAnimation();
  registerArc3dGraphic();
  Factory.registerMark(Arc3dMark.type, Arc3dMark);
};
