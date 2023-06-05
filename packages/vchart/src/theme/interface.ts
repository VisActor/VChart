import type { ILayoutPaddingSpec } from '../model/interface';
import type { IDataZoomTheme, IScrollBarTheme } from '../component/data-zoom';
import type { ITooltipTheme } from '../component/tooltip/interface';
import type { IDiscreteLegendTheme } from '../component/legend/discrete/interface';
import type { IMarkLineTheme } from '../component/marker/mark-line/interface';
import type { ISeriesTheme } from '../series/interface';
import type { ICrosshairTheme } from '../component/crosshair/interface';
import type { IMarkTheme } from '../typings/spec';
import type {
  IArcMarkSpec,
  IAreaMarkSpec,
  ILineMarkSpec,
  IRectMarkSpec,
  ISymbolMarkSpec,
  ITextMarkSpec
} from '../typings';
import type { ICartesianAxisTheme } from '../component/axis/cartesian/interface';
import type { IPolarAxisTheme } from '../component/axis/polar/interface';
import type { ComponentTypeEnum } from '../component/interface';
import type { IIndicatorTheme } from '../component/indicator/interface';
import type { MarkTypeEnum } from '../mark/interface';
import type { IThemeColorScheme } from './color-scheme/interface';
import type { IColorLegendTheme, ISizeLegendTheme } from '../component/legend/continuous';
import type { IMarkAreaTheme } from '../component/marker/mark-area/interface';
import type { IPlayerTheme } from '../component/player';
import type { IMarkPointTheme } from '../component/marker/mark-point/interface';
import type { IBrushTheme } from '../component/brush/interface';

export interface ITheme {
  /** 主题命名 */
  name?: string;

  /** 图表层级的样式属性 */
  backgroundColor?: string;
  padding?: ILayoutPaddingSpec;

  /** 全局样式属性 */
  mark?: IGlobalMarkTheme;

  /** 全局色板 */
  colorScheme?: IThemeColorScheme;

  /** 系列 */
  series?: ISeriesTheme;

  /** 组件 */
  [ComponentTypeEnum.cartesianAxis]?: ICartesianAxisTheme;
  [ComponentTypeEnum.polarAxis]?: IPolarAxisTheme;
  [ComponentTypeEnum.discreteLegend]?: IDiscreteLegendTheme;
  [ComponentTypeEnum.colorLegend]?: IColorLegendTheme;
  [ComponentTypeEnum.sizeLegend]?: ISizeLegendTheme;
  [ComponentTypeEnum.markLine]?: IMarkLineTheme;
  [ComponentTypeEnum.markArea]?: IMarkAreaTheme;
  [ComponentTypeEnum.markPoint]?: IMarkPointTheme;
  [ComponentTypeEnum.tooltip]?: ITooltipTheme;
  [ComponentTypeEnum.crosshair]?: ICrosshairTheme;
  [ComponentTypeEnum.dataZoom]?: IDataZoomTheme;
  [ComponentTypeEnum.scrollBar]?: IScrollBarTheme;
  [ComponentTypeEnum.indicator]?: IIndicatorTheme;
  [ComponentTypeEnum.player]?: IPlayerTheme;
  [ComponentTypeEnum.brush]?: IBrushTheme;
}

export interface IGlobalMarkTheme {
  [MarkTypeEnum.line]?: Partial<IMarkTheme<ILineMarkSpec>>;
  [MarkTypeEnum.symbol]?: Partial<IMarkTheme<ISymbolMarkSpec>>;
  [MarkTypeEnum.area]?: Partial<IMarkTheme<IAreaMarkSpec>>;
  [MarkTypeEnum.rect]?: Partial<IMarkTheme<IRectMarkSpec>>;
  [MarkTypeEnum.arc]?: Partial<IMarkTheme<IArcMarkSpec>>;
  [MarkTypeEnum.text]?: Partial<IMarkTheme<ITextMarkSpec>>;
}
