import { BuiltinColorPalette, IThemeColorScheme } from '@visactor/vchart-types';
import { dataScheme } from '../common/data-scheme';

export const colorScheme: IThemeColorScheme = {
  default: {
    dataScheme,
    palette: {
      /** 背景色 */
      backgroundColor: 'rgba(255,255,255,1)',
      /** 图表边框色 */
      borderColor: 'rgba(28,31,35,0.08)',
      /** 默认阴影颜色 */
      shadowColor: 'rgba(0,0,0,0.1)',
      /** 鼠标 hover 项背景颜色 */
      hoverBackgroundColor: 'rgba(46,50,56,0.05)',
      /** 滑块类组件背景条填充颜色 */
      sliderRailColor: 'rgba(46,50,56,0.05)',
      /** 滑块类组件滑块填充颜色 */
      sliderHandleColor: 'rgba(255,255,255,1)',
      /** 滑块类组件已选范围填充颜色 */
      sliderTrackColor: 'rgba(0,100,250,1)',
      /** 浮层背景区域颜色 */
      popupBackgroundColor: 'rgba(255,255,255,1)',

      /** 主要字色 */
      primaryFontColor: 'rgba(28,31,35,1)',
      /** 次要字色 */
      secondaryFontColor: 'rgba(28,31,35,0.8)',
      /** 第三字色 */
      tertiaryFontColor: 'rgba(28,31,35,0.62)',
      /** 轴标签字色 */
      axisLabelFontColor: 'rgba(28,31,35,0.62)',
      /** 禁用字色 */
      disableFontColor: 'rgba(28,31,35,0.35)',
      /** 轴高亮标记字色 */
      axisMarkerFontColor: 'rgba(255,255,255,1)',

      /** 轴网格线颜色 */
      axisGridColor: 'rgba(28,31,35,0.08)',
      /** 轴线颜色 */
      axisDomainColor: 'rgba(28,31,35,0.15)',

      /** 缩略轴滑块描边颜色 */
      dataZoomHandleStrokeColor: 'rgba(46,50,56,0.13)',
      /** 缩略轴图表区域颜色 */
      dataZoomChartColor: 'rgba(46,50,56,0.09)',

      /** 播放器控制器填充颜色 */
      playerControllerColor: 'rgba(0,100,250,1)',

      /** 轴高亮标记背景色 */
      axisMarkerBackgroundColor: 'rgba(28,31,35,1)',
      /** 标注标签背景颜色 */
      markLabelBackgroundColor: 'rgba(28,31,35,0.08)',
      /** 标注线颜色 */
      markLineStrokeColor: 'rgba(28,31,35,0.8)',

      /** 危险色 */
      dangerColor: 'rgba(249,57,32,1)',
      /** 警告色 */
      warningColor: 'rgba(252,136,0,1)',
      /** 成功色 */
      successColor: 'rgba(59,179,70,1)',
      /** 信息色 */
      infoColor: 'rgba(0,100,250,1)'
    } as Partial<BuiltinColorPalette>
  }
};
