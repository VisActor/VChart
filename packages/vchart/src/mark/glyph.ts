import type { ICommonSpec } from '../typings/visual';
import { BaseMark } from './base/base-mark';
import type { IGlyph, IGlyphGraphicAttribute, IGraphic } from '@visactor/vrender-core';
import { createGlyph } from '@visactor/vrender-core';
import type { IGlyphMark } from './interface/mark';
import type { MarkType } from './interface/type';
import { Factory } from '../core/factory';
import type { Datum } from '../typings/common';
import { registerGlyph, registerShadowRoot } from '@visactor/vrender-kits';
import type { IMarkGraphic } from './interface/common';
import { DiffState } from './interface/enum';
import { merge } from '@visactor/vutils';
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

  protected _positionChannels: string[];

  getPositionChannels() {
    return this._positionChannels;
  }

  protected _positionEncoder: (glyphAttrs: any, datum: Datum, g: IGlyph) => Record<string, any>;

  protected _channelEncoder: Record<string, (channelValue: any) => Record<string, any>>;

  private _onGlyphAttributeUpdate(glyph: IGlyph) {
    return (newAttributes: any) => {
      const positionChannels = this.getPositionChannels();
      let subAttrsMap =
        positionChannels && this._positionEncoder && Object.keys(newAttributes).some(k => positionChannels.includes(k))
          ? this._positionEncoder(newAttributes, glyph?.context?.data?.[0], glyph)
          : null;

      if (this._channelEncoder) {
        Object.keys(this._channelEncoder).forEach(channel => {
          if (channel in newAttributes) {
            const channelAttrsMap = this._channelEncoder[channel](newAttributes[channel]);

            subAttrsMap = subAttrsMap ? merge(subAttrsMap, channelAttrsMap) : channelAttrsMap;
          }
        });
      }

      if (subAttrsMap) {
        glyph.getSubGraphic().forEach(subGraphic => {
          if (subGraphic && subAttrsMap[subGraphic.name]) {
            subGraphic.setAttributes(subAttrsMap[subGraphic.name]);
          }
        });
      }

      return newAttributes;
    };
  }

  protected _setStateOfGraphic = (g: IMarkGraphic) => {
    g.clearStates();
    g.stateProxy = null;

    if (g.context.diffState === DiffState.enter || g.context.diffState === DiffState.update) {
      g.glyphStateProxy = (stateName: string, nexStates: string[]) => {
        const glyphAttrs = {
          attributes: {
            ...this._runEncoderOfGraphic(this._encoderOfState?.[stateName], g),
            ...(g.runtimeStateCache ? g.runtimeStateCache[stateName] : null)
          }
        };

        // 更新缓存
        if (!g.glyphStates) {
          g.glyphStates = { [stateName]: glyphAttrs };
        } else if (!g.glyphStates[stateName]) {
          g.glyphStates[stateName] = glyphAttrs;
        }

        return glyphAttrs;
      };

      g.useStates(g.context.states);
    }
  };

  protected _createGraphic(attrs: IGlyphGraphicAttribute = {}): IGraphic {
    const glyph = createGlyph(attrs);
    glyph.onBeforeAttributeUpdate = this._onGlyphAttributeUpdate(glyph);
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

    (glyph as any).onBeforeAttributeUpdate(attrs);

    return glyph;
  }
}

export const registerGlyphMark = () => {
  Factory.registerGraphicComponent('glyph', createGlyph);
  registerShadowRoot();
  registerGlyph();
};
