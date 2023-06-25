/* eslint-disable no-duplicate-imports */
/**
 * @description export all mark modules
 */
import { BoxPlotMark } from '../mark/box-plot';
import { LineMark } from '../mark/line';
import { SymbolMark } from '../mark/symbol';
import { GroupMark } from '../mark/group';
import { RuleMark } from '../mark/rule';
import { TextMark } from '../mark/text';
import { AreaMark } from '../mark/area';
import { Rect3dMark, RectMark } from '../mark/rect';
import { PathMark } from '../mark/path';
import { Arc3dMark, ArcMark } from '../mark/arc';
import { ComponentMark } from '../mark/component';
import { PolygonMark, Pyramid3dMark } from '../mark/polygon';
import { LinkPathMark } from '../mark/linkPath';
import { ProgressArcMark } from '../mark/progress-arc';
import { CellMark } from '../mark/cell';
import { BaseMark } from '../mark/base';

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
  IProgressArcMarkSpec,
  ConvertToMarkStyleSpec,
  ICellMarkSpec
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
  ProgressArcMark,
  CellMark,
  BaseMark
};
