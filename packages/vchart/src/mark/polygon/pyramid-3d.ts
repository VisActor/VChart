import { Factory } from './../../core/factory';
/* eslint-disable no-duplicate-imports */
import type { IPyramid3dMarkSpec } from '../../typings/visual';
import type { IMarkRaw } from '../interface';
import { MarkTypeEnum } from '../interface/type';
import { BasePolygonMark } from './base-polygon';
import { registerPyramid3dGraphic } from '@visactor/vgrammar-core';
import { registerVGrammarPolygonAnimation } from '../../animation/config';

export type IPyramid3dMark = IMarkRaw<IPyramid3dMarkSpec>;

export class Pyramid3dMark extends BasePolygonMark<IPyramid3dMarkSpec> implements IPyramid3dMark {
  static readonly type = MarkTypeEnum.pyramid3d;
  readonly type = Pyramid3dMark.type;
}

export const registerPyramid3dMark = () => {
  Factory.registerMark(Pyramid3dMark.type, Pyramid3dMark);
  registerPyramid3dGraphic();
  registerVGrammarPolygonAnimation();
};
