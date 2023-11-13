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
      axisDomainColor: '#d9dde4',

      /** 缩略轴滑块描边颜色 */
      dataZoomHandlerStrokeColor: '#aeb5be',
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

      /** 标注标签背景颜色 */
      markLabelBackgroundColor: '#ffc528'
    } as BuiltinColorPalette
  }
};
