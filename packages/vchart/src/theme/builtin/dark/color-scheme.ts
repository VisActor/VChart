import type { IThemeColorScheme } from '../../color-scheme/interface';
import { dataScheme } from '../../color-scheme/builtin/default';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      /** 背景色 */
      backgroundColor: '#202226',
      /** 图表边框色 */
      borderColor: '#404349',

      /** 主要字色 */
      primaryFontColor: '#fdfdfd',
      /** 次要字色 */
      secondaryFontColor: '#888c93',
      /** 禁用字色 */
      disableFontColor: '#55595f',
      /** 标签字色 */
      labelFontColor: '#bbbdc3',
      /** 标签反转字色 */
      labelReverseFontColor: '#202226',

      /** 轴网格线颜色 */
      axisGridColor: '#404349',
      /** 轴线颜色 */
      axisDomainColor: '#4b4f54',
      /** 轴标签颜色 */
      axisLabelFontColor: '#bbbdc3',

      /** 缩略轴滑块描边颜色 */
      dataZoomHandlerStrokeColor: '#4B4F54',
      /** 缩略轴滑块填充颜色 */
      dataZoomHandlerFillColor: '#202226',
      /** 缩略轴背景区域颜色 */
      dataZoomBackgroundColor: '#404349',
      /** 缩略轴图表区域颜色 */
      dataZoomChartColor: '#55595F',
      /** 缩略轴选择区域颜色 */
      dataZoomSelectedColor: '#4284FF',

      /** 提示信息背景区域颜色 */
      tooltipBackgroundColor: '#404349',
      /** 提示信息阴影颜色 */
      tooltipShadowColor: '#000000'
    }
  }
};
