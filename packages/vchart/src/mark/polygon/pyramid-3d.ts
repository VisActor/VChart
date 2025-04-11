import { Factory } from './../../core/factory';
/* eslint-disable no-duplicate-imports */
import type { IPyramid3dMarkSpec } from '../../typings/visual';
import { MarkTypeEnum } from '../interface/type';
import { BasePolygonMark } from './base-polygon';
import { registerPolygonAnimation } from '../../animation/config';
import type { IPyramid3dMark } from '../interface/mark';
import { registerPyramid3d, registerShadowRoot } from '@visactor/vrender-kits';
import { createPyramid3d } from '@visactor/vrender-core';

export class Pyramid3dMark extends BasePolygonMark<IPyramid3dMarkSpec> implements IPyramid3dMark {
  static readonly type = MarkTypeEnum.pyramid3d;
  readonly type = Pyramid3dMark.type;
}

export const registerPyramid3dMark = () => {
  Factory.registerMark(Pyramid3dMark.type, Pyramid3dMark);
  registerShadowRoot();
  registerPyramid3d();
  registerPolygonAnimation();

  Factory.registerGraphicComponent(MarkTypeEnum.pyramid3d, createPyramid3d);
};
