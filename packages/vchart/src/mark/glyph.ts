import type { ICommonSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IGlyph, IGlyphGraphicAttribute, IGraphic } from '@visactor/vrender-core';
import { createGlyph } from '@visactor/vrender-core';
import type { IGlyphMark } from './interface/mark';
import type { MarkType } from './interface/type';
import { Factory } from '../core/factory';
import type { Datum } from '../typings/common';
import { registerGlyph, registerShadowRoot } from '@visactor/vrender-kits';
export abstract class GlyphMark<T extends ICommonSpec = ICommonSpec, Cfg = any>
  extends BaseMark<T>
  implements IGlyphMark<T, Cfg>
{
  protected _defaultGlyphAttrs: T;

  protected _subMarks: Record<
    string,
    {
      type: MarkType;
      defaultAttributes?: any;
    }
  >;

  getSubMarks() {
    return this._subMarks;
  }

  protected _glyphConfig: Cfg;

  setGlyphConfig(cfg: Cfg) {
    this._glyphConfig = cfg;
  }

  getGlyphConfig() {
    return this._glyphConfig;
  }

  protected _progressiveChannels: string[];

  getProgressiveChannels() {
    return this._progressiveChannels;
  }

  protected _functionEncoder: (glyphAttrs: any, datum: Datum, g: IGlyph) => Record<string, any>;

  private _onGlyphAttributeUpdate(glyph: IGlyph) {
    return (newAttributes: any) => {
      const subAttrsMap = this._functionEncoder?.(newAttributes, glyph?.context?.data?.[0], glyph);

      glyph.getSubGraphic().forEach(subGraphic => {
        if (subGraphic) {
          subGraphic.setAttributes(subAttrsMap?.[subGraphic.name]);
        }
      });

      return newAttributes;
    };
  }

  createGraphic(attrs: IGlyphGraphicAttribute = {}): IGraphic {
    const glyph = createGlyph(attrs);
    const subMarks = this._subMarks;

    if (subMarks) {
      const subGraphics: IGraphic[] = [];

      Object.keys(subMarks).forEach(name => {
        // glyph 中的子元素会继承glyph 的 x,y，所以子元素手动设置一下，x: 0, y: 0
        const subGraphic = Factory.createGraphicComponent(subMarks[name].type, {
          ...subMarks[name].defaultAttributes
        });

        if (subGraphic) {
          subGraphics.push(subGraphic);

          subGraphic.name = name;
          subGraphic.onBeforeAttributeUpdate = (attrs: any) => {
            return attrs;
          };
        }
      });

      glyph.setSubGraphic(subGraphics);
    }

    glyph.onBeforeAttributeUpdate = this._onGlyphAttributeUpdate(glyph);

    return glyph;
  }

  /** 创建语法元素对象 */
  // protected _initProduct(group?: string | IGroupMark) {
  //   const shaftShape = this.getStyle('shaftShape');
  //   const view = this.getVGrammarView();

  //   // 声明语法元素
  //   const id = this.getProductId();
  //   const glyphType = shaftShape === 'bar' ? BAR_BOX_PLOT_GLYPH_TYPE : BOX_PLOT_GLYPH_TYPE;
  //   const direction = this.getStyle('direction');
  //   this._product = view
  //     .glyph(glyphType, group ?? view.rootMark)
  //     .id(id)
  //     .configureGlyph({ direction });
  //   this._compiledProductId = id;
  // }
}

export const registerGlyphMark = () => {
  Factory.registerGraphicComponent('glyph', createGlyph);
  registerShadowRoot();
  registerGlyph();
};
