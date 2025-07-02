/**
 * @description export all mark modules
 */
import { LineMark, registerLineMark } from './line';
import { SymbolMark, registerSymbolMark } from './symbol';
import { GroupMark, registerGroupMark } from './group';
import { RuleMark, registerRuleMark } from './rule';
import { TextMark, registerTextMark } from './text';
import { AreaMark, registerAreaMark } from './area';
import { RectMark, registerRectMark } from './rect';
import { PathMark, registerPathMark } from './path';
import { ArcMark, BaseArcMark, registerArcMark } from './arc';
import { ComponentMark, registerComponentMark } from './component';
import { RippleMark, registerRippleMark } from './ripple';
import { BaseMark } from './base';
import { PolygonMark, registerPolygonMark } from './polygon/polygon';
import { ImageMark, registerImageMark } from './image';
import { registerMarkFilterTransform } from './transform/filter';
import { registerMarkMapTransform } from './transform/map';
import { BasePolygonMark } from './polygon/base-polygon';
import { MarkTypeEnum } from './interface/type';
import { GlyphMark, registerGlyphMark } from './glyph';

export type {
  IBoxPlotMarkSpec,
  ILineMarkSpec,
  ISymbolMarkSpec,
  IGroupMarkSpec,
  IRuleMarkSpec,
  ITextMarkSpec,
  IAreaMarkSpec,
  IRectMarkSpec,
  IPathMarkSpec,
  IArcMarkSpec,
  ICommonSpec,
  IPolygonMarkSpec,
  ILinkPathMarkSpec,
  IRippleMarkSpec,
  ICellMarkSpec,
  ILiquidMarkSpec,
  ConvertToMarkStyleSpec
} from '../typings/visual';

export type { IMarkRaw, IMark, IMarkStyle } from './interface/common';
export type { ITextMark, ILabelMark, IRectMark, IRuleMark, IImageMark, IGroupMark } from './interface/mark';

export {
  MarkTypeEnum,
  LineMark,
  SymbolMark,
  GroupMark,
  RuleMark,
  TextMark,
  AreaMark,
  RectMark,
  PathMark,
  BaseArcMark,
  ArcMark,
  ComponentMark,
  BasePolygonMark,
  PolygonMark,
  RippleMark,
  ImageMark,
  BaseMark,
  GlyphMark
};

export {
  registerLineMark,
  registerSymbolMark,
  registerGroupMark,
  registerRuleMark,
  registerTextMark,
  registerAreaMark,
  registerRectMark,
  registerPathMark,
  registerArcMark,
  registerPolygonMark,
  registerRippleMark,
  registerImageMark,
  registerComponentMark,
  registerGlyphMark,
  registerMarkMapTransform,
  registerMarkFilterTransform
};

export const registerAllMarks = () => {
  registerGroupMark();
  registerLineMark();
  registerSymbolMark();
  registerRuleMark();
  registerTextMark();
  registerAreaMark();
  registerRectMark();
  registerPathMark();
  registerArcMark();
  registerPolygonMark();
  registerImageMark();
  registerRippleMark();
  registerComponentMark();
  registerGlyphMark();
};
