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
import { LinkPathMark, registerLinkPathMark } from './link-path';
import { RippleMark, registerRippleMark } from './ripple';
import { CellMark, registerCellMark } from './cell';
import { GlyphMark, registerGlyphMark } from './glyph';
import { BaseMark } from './base';
import { PolygonMark, registerPolygonMark } from './polygon/polygon';
import { ImageMark, registerImageMark } from './image';
import { LiquidMark, registerLiquidMark } from './liquid';
import { BoxPlotMark, registerBoxPlotMark } from './box-plot';
import { registerMarkFilterTransform } from './transform/filter';
import { registerMarkMapTransform } from './transform/map';
import { BasePolygonMark } from './polygon/base-polygon';
import { MarkTypeEnum } from './interface/type';

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
export type { ITextMark, ILabelMark, IRectMark, IRuleMark, IImageMark, IGroupMark, IGlyphMark } from './interface/mark';

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
  GlyphMark,
  BaseArcMark,
  ArcMark,
  ComponentMark,
  BasePolygonMark,
  PolygonMark,
  RippleMark,
  ImageMark,
  BaseMark
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
  registerGlyphMark,
  registerRippleMark,
  registerImageMark,
  registerComponentMark,
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
};
