import type { IThemeColorScheme } from '../../color-scheme/interface';
import { dataScheme } from '../../color-scheme/builtin/default';
import type { BuiltinColorPalette } from '../../color-scheme/builtin/interface';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      /** 背景色 */
      backgroundColor: '#202226',
      /** 图表边框色 */
      borderColor: '#404349',
      /** 默认阴影颜色 */
      shadowColor: '#000000',

      /** 主要字色 */
      primaryFontColor: '#fdfdfd',
      /** 次要字色 */
      secondaryFontColor: '#888c93',
      /** 轴字色 */
      axisFontColor: '#bbbdc3',
      /** 禁用字色 */
      disableFontColor: '#55595f',
      /** 标签反转字色 */
      labelReverseFontColor: '#202226',

      /** 轴网格线颜色 */
      axisGridColor: '#404349',
      /** 轴线颜色 */
      axisDomainColor: '#4b4f54',

      /** 缩略轴滑块描边颜色 */
      dataZoomHandlerStrokeColor: '#888c93',
      /** 缩略轴滑块填充颜色 */
      dataZoomHandlerFillColor: '#202226',
      /** 缩略轴背景区域颜色 */
      dataZoomBackgroundColor: '#404349',
      /** 缩略轴图表区域颜色 */
      dataZoomChartColor: '#55595F',
      /** 缩略轴选择区域颜色 */
      dataZoomSelectedColor: '#4284FF',

      /** 滚动条滑块颜色 */
      scrollBarSliderColor: '#ffffff',

      /** 提示信息背景区域颜色 */
      tooltipBackgroundColor: '#404349',

      /** 标注标签背景颜色 */
      markLabelBackgroundColor: '#f0bd30'
    } as BuiltinColorPalette
  }
};
