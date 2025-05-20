import { registerArc3d, registerShadowRoot } from '@visactor/vrender-kits';
import { createArc3d } from '@visactor/vrender-core';
import { BaseArcMark, Factory, registerArcAnimation } from '@visactor/vchart';
import { MarkType3dEnum } from './enum';
import type { IArc3dMark, IArc3dMarkSpec } from './interface';

export class Arc3dMark extends BaseArcMark<IArc3dMarkSpec> implements IArc3dMark {
  static readonly type = MarkType3dEnum.arc3d;
  readonly type = Arc3dMark.type;

  setDataLabelType() {
    return 'arc';
  }

  constructor(name: string, option: any) {
    super(name, option);

    this._markConfig.support3d = true;
  }

  setMarkConfig(config: any) {
    super.setMarkConfig(config);

    this._markConfig.support3d = true;
  }
}

export const registerArc3dMark = () => {
  registerArcAnimation();
  registerShadowRoot();
  registerArc3d();
  Factory.registerGraphicComponent(MarkType3dEnum.arc3d, createArc3d);
  Factory.registerMark(MarkType3dEnum.arc3d, Arc3dMark);
};
