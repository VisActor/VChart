import { isValid, isValidNumber } from '@visactor/vutils';
import type { ICandlestickMark, ICandlestickMarkSpec } from './interface';
// eslint-disable-next-line no-duplicate-imports
import { createLine, createRect, type IGlyph, type ILineGraphicAttribute } from '@visactor/vrender-core';
import { registerLine, registerRect } from '@visactor/vrender-kits';
import type { Datum, IMarkStyle } from '@visactor/vchart';
import { Factory, GlyphMark, registerGlyphMark } from '@visactor/vchart';
import { CandlestickType } from './constants';

const CANDELSICK_CHANNELS = [
  'open',
  'close',
  'high',
  'low',
  'bodySize',
  'bodyFill',
  'bodyStroke',
  'bodyLineWidth',
  'bodyOpacity',
  'bodyFillOpacity',
  'bodyStrokeOpacity',
  'shadowStroke',
  'shadowLineWidth',
  'shadowOpacity'
];

export class CandlestickMark
  extends GlyphMark<ICandlestickMarkSpec, { direction?: 'horizontal' | 'vertical' }>
  implements ICandlestickMark
{
  static readonly type = CandlestickType;
  readonly type = CandlestickMark.type;

  protected _isHorizontal() {
    return this._glyphConfig && this._glyphConfig.direction === 'horizontal';
  }

  setGlyphConfig(cfg: { direction?: 'horizontal' | 'vertical' }): void {
    super.setGlyphConfig(cfg);

    this._subMarks = {
      shadowMax: { type: 'line', defaultAttributes: { x: 0, y: 0 } },
      shadowMin: { type: 'line', defaultAttributes: { x: 0, y: 0 } },
      body: { type: 'rect' }
    };
    this._positionChannels = CANDELSICK_CHANNELS;
    this._channelEncoder = null;
    this._positionEncoder = (glyphAttrs: any, datum: Datum, g: IGlyph) => {
      const gAttribute = g.attribute as ICandlestickMarkSpec;
      const {
        x = g.attribute.x,
        y = g.attribute.y,

        open = gAttribute.open,
        close = gAttribute.close,
        high = gAttribute.high,
        low = gAttribute.low,

        bodySize = gAttribute.bodySize,
        bodyFill = gAttribute.bodyFill,
        bodyStroke = gAttribute.bodyStroke,
        bodyLineWidth = gAttribute.bodyLineWidth,
        bodyOpacity = gAttribute.bodyOpacity,
        bodyFillOpacity = gAttribute.bodyFillOpacity,
        bodyStrokeOpacity = gAttribute.bodyStrokeOpacity,

        shadowStroke = gAttribute.shadowStroke,
        shadowLineWidth = gAttribute.shadowLineWidth,
        shadowOpacity = gAttribute.shadowOpacity
      } = glyphAttrs;
      const isV = !this._isHorizontal();
      const attributes: any = {};
      if (isV) {
        const y = Math.min(open, close);
        const y1 = Math.max(open, close);
        attributes.body = {
          x: x - bodySize / 2,
          x1: x + bodySize / 2,
          y,
          y1
        };
        attributes.shadowMax = {
          points: [
            { x: x, y: high },
            { x, y: y }
          ]
        };
        attributes.shadowMin = {
          points: [
            { x: x, y: y1 },
            { x: x, y: low }
          ]
        };
      } else {
        const x = Math.min(open, close);
        const x1 = Math.max(open, close);
        attributes.body = {
          x,
          x1,
          y: y - bodySize / 2,
          y1: y + bodySize / 2
        };
        attributes.shadowMax = {
          points: [
            { x: low, y },
            { x: x, y }
          ]
        };
        attributes.shadowMin = {
          points: [
            { x: x1, y },
            { x: high, y }
          ]
        };
      }

      isValid(bodyFill) && (attributes.body.fill = bodyFill);
      isValid(bodyStroke) && (attributes.body.stroke = bodyStroke);
      isValidNumber(bodyLineWidth) && (attributes.body.lineWidth = bodyLineWidth);
      isValidNumber(bodyOpacity) && (attributes.body.opacity = bodyOpacity);
      isValidNumber(bodyFillOpacity) && (attributes.body.fillOpacity = bodyFillOpacity);
      isValidNumber(bodyStrokeOpacity) && (attributes.body.strokeOpacity = bodyStrokeOpacity);

      isValid(shadowStroke) && (attributes.shadowMax.stroke = shadowStroke);
      isValidNumber(shadowLineWidth) && (attributes.shadowMax.lineWidth = shadowLineWidth);
      isValidNumber(shadowOpacity) && (attributes.shadowMax.opacity = shadowOpacity);

      isValid(shadowStroke) && (attributes.shadowMin.stroke = shadowStroke);
      isValidNumber(shadowLineWidth) && (attributes.shadowMin.lineWidth = shadowLineWidth);
      isValidNumber(shadowOpacity) && (attributes.shadowMin.opacity = shadowOpacity);

      return attributes;
    };
  }

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<ICandlestickMarkSpec> = {
      ...super._getDefaultStyle(),
      bodyLineWidth: 2,
      shadowLineWidth: 2,
      shadowStroke: 'black'
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
