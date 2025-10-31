import { registerPyramid3d, registerShadowRoot, createPyramid3d } from '@visactor/vchart';
import type { IPyramid3dMark, IPyramid3dMarkSpec } from './interface';
import { MarkType3dEnum } from './enum';
import { BasePolygonMark, Factory, registerPolygonAnimation } from '@visactor/vchart';

export class Pyramid3dMark extends BasePolygonMark<IPyramid3dMarkSpec> implements IPyramid3dMark {
  static readonly type = MarkType3dEnum.pyramid3d;
  readonly type = Pyramid3dMark.type;

  protected _getDefaultStyle() {
    const defaultStyle = super._getDefaultStyle();

    defaultStyle.stroke = false;

    return defaultStyle;
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

export const registerPyramid3dMark = () => {
  Factory.registerMark(Pyramid3dMark.type, Pyramid3dMark);
  registerShadowRoot();
  registerPyramid3d();
  registerPolygonAnimation();

  Factory.registerGraphicComponent(MarkType3dEnum.pyramid3d, createPyramid3d);
};
