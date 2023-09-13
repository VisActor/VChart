import type { IThemeColorScheme } from '../../color-scheme/interface';
import { dataScheme } from '../../color-scheme/builtin/default';
import type { BuiltinColorPalette } from '../../color-scheme/builtin/interface';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      /** 背景色 */
      backgroundColor: '#ffffff',
      /** 图表边框色 */
      borderColor: '#e3e5e8',
      /** 默认阴影颜色 */
      shadowColor: '#21252c',

      /** 主要字色 */
      primaryFontColor: '#21252c',
      /** 次要字色 */
      secondaryFontColor: '#606773',
      /** 轴字色 */
      axisFontColor: '#89909d',
      /** 禁用字色 */
      disableFontColor: '#bcc1cb',
      /** 标签反转字色 */
      labelReverseFontColor: '#ffffff',

      /** 轴网格线颜色 */
      axisGridColor: '#f1f2f5',
      /** 轴线颜色 */
      axisDomainColor: '#D9DDE4',
      /** 轴标签颜色 */
      axisLabelFontColor: '#89909d',

      /** 缩略轴滑块描边颜色 */
      dataZoomHandlerStrokeColor: '#AEB5BE',
      /** 缩略轴滑块填充颜色 */
      dataZoomHandlerFillColor: '#ffffff',
      /** 缩略轴背景区域颜色 */
      dataZoomBackgroundColor: '#f1f3f4',
      /** 缩略轴图表区域颜色 */
      dataZoomChartColor: '#c9ced8',
      /** 缩略轴选择区域颜色 */
      dataZoomSelectedColor: '#0040ff',

      /** 滚动条滑块颜色 */
      scrollBarSliderColor: '#000000',

      /** 提示信息背景区域颜色 */
      tooltipBackgroundColor: '#ffffff',

      // 已弃用的语义色值
      /** @deprecated 图表标题颜色 */
      titleFontColor: '#21252c',
      /** @deprecated 标签字色 */
      labelFontColor: '#89909d'
    } as BuiltinColorPalette
  }
};
