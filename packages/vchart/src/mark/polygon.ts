import { isNil } from '@visactor/vutils';
import type { StateValueType } from '../typings';
import type { ICommonSpec, IPolygonMarkSpec, IPyramid3dMarkSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IMarkRaw, IMarkStyle, MarkInputStyle } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { MarkTypeEnum } from './interface';

export type IPolygonMark = IMarkRaw<IPolygonMarkSpec>;
export type IPyramid3dMark = IMarkRaw<IPyramid3dMarkSpec>;

class BasePolygonMark<T extends ICommonSpec> extends BaseMark<T> {
  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<T> = {
      ...super._getDefaultStyle(),
      points: []
    };
    return defaultStyle;
  }

  /**
   * @override 兼容下 polygon 的 borderRadius
   * 由外部series调用，设置markStyle的接口（如果由 IModel 派生类调用，请使用 IModel.setMarkStyle）
   * @param style
   * @param level
   * @param state
   */
  setStyle<U extends keyof T>(
    style: Partial<IMarkStyle<T>>,
    state: StateValueType = 'normal',
    level: number = 0,
    stateStyle = this.stateStyle
  ): void {
    if (isNil(style)) {
      return;
    }
    style = this._filterStyle(style, state, level, stateStyle);

    if (stateStyle[state] === undefined) {
      stateStyle[state] = {};
    }

    const isUserLevel = this.isUserLevel(level);

    Object.keys(style).forEach((attr: string) => {
      let attrStyle = style[attr] as MarkInputStyle<T[U]>;
      if (isNil(attrStyle)) {
        return;
      }

      attrStyle = this._filterAttribute(attr as any, attrStyle, state, level, isUserLevel, stateStyle);

      // borderRadius todo: vrender 改造好后使用注释的语句
      // this.setAttribute((attr === 'borderRadius' ? 'cornerRadius' : attr) as any, attrStyle, state, level, stateStyle);
      this.setAttribute((attr === 'cornerRadius' ? 'borderRadius' : attr) as any, attrStyle, state, level, stateStyle);
    });
  }
}

export class PolygonMark extends BasePolygonMark<IPolygonMarkSpec> implements IPolygonMark {
  static readonly type = MarkTypeEnum.polygon;
  readonly type = PolygonMark.type;
}

export class Pyramid3dMark extends BasePolygonMark<IPyramid3dMarkSpec> implements IPyramid3dMark {
  static readonly type = MarkTypeEnum.pyramid3d;
  readonly type = Pyramid3dMark.type;
}
