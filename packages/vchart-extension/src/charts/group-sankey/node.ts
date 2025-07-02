import { createLine, createRect, type IGlyph, type ILineGraphicAttribute } from '@visactor/vrender-core';
import type { Datum, IMarkStyle } from '@visactor/vchart';
import { GlyphMark, registerGlyphMark, Factory } from '@visactor/vchart';
import { isValidNumber } from '@visactor/vutils';
import { registerLine, registerRect } from '@visactor/vrender-kits';
import type { IGroupRectMark } from './interface';

const GROUP_RECT_CHANNELS = ['x', 'y', 'gap', 'groupA', 'groupB', 'width', 'height'];

export class GroupNodeMark
  extends GlyphMark<IGroupRectMark, { direction?: 'horizontal' | 'vertical' }>
  implements IGroupRectMark
{
  static readonly type = 'groupSankeyNode';
  readonly type = GroupNodeMark.type;

  protected _isHorizontal() {
    return this._glyphConfig && this._glyphConfig.direction === 'horizontal';
  }

  setGlyphConfig(cfg: { direction?: 'horizontal' | 'vertical' }): void {
    super.setGlyphConfig(cfg);
    this._subMarks = {
      groupA: { type: 'rect', defaultAttributes: { x: 0, y: 0, width: 0, height: 0 } },
      groupB: { type: 'rect', defaultAttributes: { x: 0, y: 0, width: 0, height: 0 } }
    };
    this._positionChannels = GROUP_RECT_CHANNELS;
    this._channelEncoder = null;
    this._positionEncoder = (glyphAttrs: any, datum: Datum, g: IGlyph) => {
      const {
        x = g.attribute.x,
        y = g.attribute.y,
        width = g.attribute.width,
        height = g.attribute.height,
        groupA = (g.attribute as any).groupA,
        groupB = (g.attribute as any).groupB,
        gap = (g.attribute as any).gap
      } = glyphAttrs;
      const isH = this._isHorizontal();

      const validGap = height;

      const attributes: any = {};

      // if (isH) {
      //   attributes.box = {
      //     x: q1,
      //     x1: q3,
      //     y: y - boxHeight / 2,
      //     y1: y + boxHeight / 2
      //   };
      //   attributes.median = {
      //     points: [
      //       {
      //         x: median,
      //         y: y - boxHeight / 2
      //       },
      //       {
      //         x: median,
      //         y: y + boxHeight / 2
      //       }
      //     ]
      //   };
      //   attributes.shaft = {
      //     points: [
      //       {
      //         x: min,
      //         y: y
      //       },
      //       {
      //         x: max,
      //         y: y
      //       }
      //     ]
      //   };
      //   attributes.max = {
      //     points: [
      //       {
      //         x: max,
      //         y: y - ruleHeight / 2
      //       },
      //       {
      //         x: max,
      //         y: y + ruleHeight / 2
      //       }
      //     ]
      //   };
      //   attributes.min = {
      //     points: [
      //       {
      //         x: min,
      //         y: y - ruleHeight / 2
      //       },
      //       {
      //         x: min,
      //         y: y + ruleHeight / 2
      //       }
      //     ]
      //   };
      // } else {
      //   attributes.box = {
      //     x: x - boxWidth / 2,
      //     x1: x + boxWidth / 2,
      //     y: q1,
      //     y1: q3
      //   };
      //   attributes.median = {
      //     points: [
      //       {
      //         x: x - boxWidth / 2,
      //         y: median
      //       },
      //       {
      //         x: x + boxWidth / 2,
      //         y: median
      //       }
      //     ]
      //   };

      //   attributes.max = {
      //     points: [
      //       {
      //         x: x - ruleWidth / 2,
      //         y: max
      //       },
      //       {
      //         x: x + ruleWidth / 2,
      //         y: max
      //       }
      //     ]
      //   };
      //   attributes.min = {
      //     points: [
      //       {
      //         x: x - ruleWidth / 2,
      //         y: min
      //       },
      //       {
      //         x: x + ruleWidth / 2,
      //         y: min
      //       }
      //     ]
      //   };
      //   attributes.shaft = {
      //     points: [
      //       {
      //         x: x,
      //         y: min
      //       },
      //       {
      //         x: x,
      //         y: max
      //       }
      //     ]
      //   };
      // }

      return attributes;
    };
  }

  protected _getDefaultStyle() {
    const defaultStyle: IMarkStyle<IGroupRectMark> = {
      ...super._getDefaultStyle(),
      gap: 2
    };
    return defaultStyle;
  }
}

export const registerBoxPlotMark = () => {
  registerGlyphMark();
  registerLine();
  registerRect();
  Factory.registerGraphicComponent('line', (attrs: ILineGraphicAttribute) => createLine(attrs));
  Factory.registerGraphicComponent('rect', (attrs: ILineGraphicAttribute) => createRect(attrs));
  Factory.registerMark(GroupNodeMark.type, GroupNodeMark);
};
