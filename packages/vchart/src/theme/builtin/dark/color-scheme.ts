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
      shadowColor: 'rgba(0,0,0,0.1)',
      /** 鼠标 hover 项背景颜色 */
      hoverBackgroundColor: '#404349',
      /** 滑块类组件背景条填充颜色 */
      sliderRailColor: '#404349',
      /** 滑块类组件滑块填充颜色 */
      sliderHandleColor: '#202226',
      /** 滑块类组件已选范围填充颜色 */
      sliderTrackColor: '#4284FF',
      /** 浮层背景区域颜色 */
      popupBackgroundColor: '#404349',

      /** 主要字色 */
      primaryFontColor: '#fdfdfd',
      /** 次要字色 */
      secondaryFontColor: '#bbbdc3',
      /** 第三字色 */
      tertiaryFontColor: '#888c93',
      /** 轴标签字色 */
      axisLabelFontColor: '#888c93',
      /** 禁用字色 */
      disableFontColor: '#55595f',
      /** 轴高亮标记字色 */
      axisMarkerFontColor: '#202226',

      /** 轴网格线颜色 */
      axisGridColor: '#404349',
      /** 轴线颜色 */
      axisDomainColor: '#4b4f54',

      /** 缩略轴滑块描边颜色 */
      dataZoomHandleStrokeColor: '#bbbdc3',
      /** 缩略轴图表区域颜色 */
      dataZoomChartColor: '#55595F',

      /** 播放器控制器填充颜色 */
      playerControllerColor: '#4284FF',

      /** 滚动条滑块颜色 */
      scrollBarSliderColor: '#ffffff',

      /** 轴高亮标记背景色 */
      axisMarkerBackgroundColor: '#fdfdfd',
      /** 标注标签背景颜色 */
      markLabelBackgroundColor: '#404349',
      /** 标注线颜色 */
      markLineStrokeColor: '#bbbdc3'
    } as BuiltinColorPalette
  }
};
