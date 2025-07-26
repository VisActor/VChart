import { registerLine, registerRect } from '@visactor/vrender-kits';
import { GlyphMark, registerGlyphMark, IMarkRaw, IMarkStyle } from '@visactor/vchart';
import { createLine, createRect, type IGlyph, type ILineGraphicAttribute } from '@visactor/vrender-core';
import { Factory, Datum } from '@visactor/vchart';
import type { ICandlestickMarkSpec } from './interface';

export type ICandlestickMark = IMarkRaw<ICandlestickMarkSpec>;
export const CANDLESTICK_MARK_TYPE = 'candlestick';

export class CandlestickMark extends GlyphMark<ICandlestickMarkSpec> implements ICandlestickMark {
  static readonly type = CANDLESTICK_MARK_TYPE;
  readonly type = CandlestickMark.type;

  setGlyphConfig(cfg: any): void {
    super.setGlyphConfig(cfg);
    this._subMarks = {
      box: { type: 'rect' },
      wick: { type: 'line', defaultAttributes: { x: 0, y: 0 } }
    };
    this._positionChannels = ['x', 'boxWidth', 'open', 'close', 'high', 'low'];
    this._channelEncoder = null;
    this._positionEncoder = (glyphAttrs: any, datum: Datum, g: IGlyph) => {
      const {
        x = g.attribute.x,
        boxWidth = (g.attribute as any).boxWidth,
        open = (g.attribute as any).open,
        close = (g.attribute as any).close,
        low = (g.attribute as any).low,
        high = (g.attribute as any).high
      } = glyphAttrs;
      const attributes: any = {};
      attributes.box = {
        x: x - boxWidth / 2,
        x1: x + boxWidth / 2,
        y: Math.min(open, close),
        y1: Math.max(open, close)
      };
      attributes.wick = {
        points: [
          {
            x: x,
            y: low
          },
          {
            x: x,
            y: high
          }
        ]
      };
      return attributes;
    };
  }

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ICandlestickMarkSpec> = {
      ...super._getDefaultStyle(),
      lineWidth: 2,
      boxWidth: 30
    };
    return defaultStyle;
  }
}

export const registerCandlestickMark = () => {
  registerGlyphMark();
  registerLine();
  registerRect();
  Factory.registerGraphicComponent('line', (attrs: ILineGraphicAttribute) => createLine(attrs));
  Factory.registerGraphicComponent('rect', (attrs: ILineGraphicAttribute) => createRect(attrs));
  Factory.registerMark(CandlestickMark.type, CandlestickMark);
};
