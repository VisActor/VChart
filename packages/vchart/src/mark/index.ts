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
import { Rect3dMark, registerRect3dMark } from './rect-3d';
import { PathMark, registerPathMark } from './path';
import { ArcMark, registerArcMark } from './arc';
import { Arc3dMark, registerArc3dMark } from './arc-3d';
import { ComponentMark, registerComponentMark } from './component';
import { LinkPathMark, registerLinkPathMark } from './link-path';
import { RippleMark, registerRippleMark } from './ripple';
import { CellMark, registerCellMark } from './cell';
import { BaseMark } from './base';
import { PolygonMark, registerPolygonMark } from './polygon/polygon';
import { Pyramid3dMark, registerPyramid3dMark } from './polygon/pyramid-3d';
import { ImageMark, registerImageMark } from './image';
import { LiquidMark, registerLiquidMark } from './liquid';
import { BoxPlotMark, registerBoxPlotMark } from './box-plot';

export type {
  IBoxPlotMarkSpec,
  ILineMarkSpec,
  ISymbolMarkSpec,
  IGroupMarkSpec,
  IRuleMarkSpec,
  ITextMarkSpec,
  IAreaMarkSpec,
  IRect3dMarkSpec,
  IRectMarkSpec,
  IPathMarkSpec,
  IArcMarkSpec,
  IArc3dMarkSpec,
  ICommonSpec,
  IPolygonMarkSpec,
  IPyramid3dMarkSpec,
  ILinkPathMarkSpec,
  IRippleMarkSpec,
  ICellMarkSpec,
  ILiquidMarkSpec,
  ConvertToMarkStyleSpec
} from '../typings/visual';

export {
  BoxPlotMark,
  LineMark,
  SymbolMark,
  GroupMark,
  RuleMark,
  TextMark,
  AreaMark,
  Rect3dMark,
  RectMark,
  PathMark,
  Arc3dMark,
  ArcMark,
  ComponentMark,
  PolygonMark,
  Pyramid3dMark,
  LinkPathMark,
  RippleMark,
  CellMark,
  ImageMark,
  LiquidMark,
  BaseMark
};

export {
  registerBoxPlotMark,
  registerLineMark,
  registerSymbolMark,
  registerGroupMark,
  registerRuleMark,
  registerTextMark,
  registerAreaMark,
  registerRectMark,
  registerRect3dMark,
  registerPathMark,
  registerArcMark,
  registerArc3dMark,
  registerPolygonMark,
  registerPyramid3dMark,
  registerLinkPathMark,
  registerRippleMark,
  registerCellMark,
  registerImageMark,
  registerComponentMark,
  registerLiquidMark
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
  registerArc3dMark();
  registerRect3dMark();
  registerPyramid3dMark();
};
