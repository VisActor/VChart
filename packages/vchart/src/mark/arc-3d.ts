import { Factory } from './../core/factory';
import type { IArc3dMarkSpec } from '../typings';
import { BaseArcMark } from './arc';
import type { IArc3dMark } from './interface';
import { MarkTypeEnum } from './interface/type';
import { registerArcAnimation } from '../animation/config';
import { registerArc3d, registerShadowRoot } from '@visactor/vrender-kits';
import { createArc3d } from '@visactor/vrender-core';

export class Arc3dMark extends BaseArcMark<IArc3dMarkSpec> implements IArc3dMark {
  static readonly type = MarkTypeEnum.arc3d;
  readonly type: MarkTypeEnum = Arc3dMark.type;
  protected _support3d?: boolean = true;
}

export const registerArc3dMark = () => {
  registerArcAnimation();
  registerShadowRoot();
  registerArc3d();
  Factory.registerGraphicComponent(MarkTypeEnum.arc3d, createArc3d);
  Factory.registerMark(MarkTypeEnum.arc3d, Arc3dMark);
};
