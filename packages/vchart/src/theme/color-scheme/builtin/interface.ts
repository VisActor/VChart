import type { IColorSchemeStruct } from '../interface';

export type BuiltinColorPalette = IColorSchemeStruct['palette'] & {
  /** 背景色 */
  backgroundColor: string;
  /** 图表边框色 */
  borderColor: string;
  /** 默认阴影颜色 */
  shadowColor: string;

  /** 主要字色（图表标题、大数字） */
  primaryFontColor: string;
  /** 次要字色（图例、tooltip、数据标签） */
  secondaryFontColor: string;
  /** 轴字色 */
  axisFontColor: string;
  /** 禁用字色（非激活态字色） */
  disableFontColor: string;
  /** 标签反转字色 */
  labelReverseFontColor: string;

  /** 轴网格线颜色 */
  axisGridColor: string;
  /** 轴线颜色 */
  axisDomainColor: string;

  /** 缩略轴滑块描边颜色 */
  dataZoomHandlerStrokeColor: string;
  /** 缩略轴滑块填充颜色 */
  dataZoomHandlerFillColor: string;
  /** 缩略轴背景区域颜色 */
  dataZoomBackgroundColor: string;
  /** 缩略轴图表区域颜色 */
  dataZoomChartColor: string;
  /** 缩略轴选择区域颜色 */
  dataZoomSelectedColor: string;

  /** 滚动条滑块颜色 */
  scrollBarSliderColor: string;

  /** 提示信息背景区域颜色 */
  tooltipBackgroundColor: string;

  /** 标注标签背景颜色 */
  markLabelBackgroundColor: string;
};
