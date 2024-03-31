import { VChart } from './core';

import { registerLineChart } from './chart/line';
import { registerAreaChart } from './chart/area';
import { registerBar3dChart, registerBarChart } from './chart/bar';
import { registerScatterChart } from './chart/scatter';
import { registerMapChart } from './chart/map';
import { registerPie3dChart, registerPieChart } from './chart/pie';
import { registerRoseChart } from './chart/rose';
import { registerRadarChart } from './chart/radar';
import { registerCommonChart } from './chart/common';
import { registerSequenceChart } from './chart/sequence';
import { registerHistogram3dChart, registerHistogramChart } from './chart/histogram';
import { registerCircularProgressChart } from './chart/progress/circular';
import { registerGaugeChart } from './chart/gauge';
import {
  registerWordCloudChart,
  registerWordCloudShapeChart,
  registerWordCloud3dChart,
  registerWordCloudShape3dChart
} from './chart/word-cloud';
import { registerFunnel3dChart, registerFunnelChart } from './chart/funnel';
import { registerLinearProgressChart } from './chart/progress/linear';
import { registerRangeColumn3dChart, registerRangeColumnChart } from './chart/range-column';
import { registerSunburstChart } from './chart/sunburst';
import { registerCirclePackingChart } from './chart/circle-packing';
import { registerTreemapChart } from './chart/treemap';
import { registerWaterfallChart } from './chart/waterfall';
import { registerBoxplotChart } from './chart/box-plot';
import { registerSankeyChart } from './chart/sankey';
import { registerRangeAreaChart } from './chart/range-area';
import { registerHeatmapChart } from './chart/heatmap';
import { registerCorrelationChart } from './chart/correlation';
import {
  registerCartesianBandAxis,
  registerCartesianLinearAxis,
  registerCartesianLogAxis,
  registerCartesianSymlogAxis,
  registerCartesianTimeAxis
} from './component/axis/cartesian';
import { registerPolarBandAxis, registerPolarLinearAxis } from './component/axis/polar';
import { registerContinuousLegend, registerDiscreteLegend } from './component/legend';
import { registerTooltip } from './component/tooltip';
import { registerCartesianCrossHair, registerPolarCrossHair } from './component/crosshair';
import { registerDataZoom, registerScrollBar } from './component/data-zoom';
import { registerIndicator } from './component/indicator';
import { registerGeoCoordinate } from './component/geo';
import { registerMarkLine } from './component/marker/mark-line';
import { registerTitle } from './component/title';
import { registerMarkArea } from './component/marker/mark-area';
import { registerPlayer } from './component/player';
import { registerLabel } from './component/label';
import { registerTotalLabel } from './component/label/total-label';
import { registerMarkPoint } from './component/marker/mark-point';
import { registerBrush } from './component/brush';
import { registerCustomMark } from './component/custom-mark';
import { registerMapLabel } from './component/map-label';
import { registerGridLayout } from './layout/grid-layout/grid-layout';
import { registerLayout3d } from './layout/layout3d';
import { registerPoptip } from './component/poptip';
import { registerCanvasTooltipHandler, registerDomTooltipHandler, registerFormatPlugin } from './plugin';

import {
  registerElementActive,
  registerElementActiveByLegend,
  registerElementHighlightByLegend,
  registerElementHighlightByName,
  registerElementHighlightByGroup,
  registerElementHighlightByKey
} from './interaction';

const registerCache: (() => void)[] = [];

/**
 * VChartAll用于注册器的隔离
 * @description Tree-shaking 通常只在生产环境启用以提升性能，导致按需加载组件在开发环境未注册的组件因加载了 vchart-all 文件而能正常显示，隐藏了潜在错误，使得开发与生产环境行为不一致。改用懒加载注册器，只有在执行 new VChartAll 时才注册组件，能解决不一致问题。
 */
class VChartAll extends VChart {
  /**
   * 按需注册图表和组件
   * @param comps
   */
  static useRegisters(comps: (() => void)[]): void {
    registerCache.push(...comps);
  }

  /**
   * 注册地图数据
   * @param key 地图名称
   * @param source 地图数据
   * @param option 地图数据配置
   */
  static registerMap: typeof VChart['registerMap'] = (...args) => {
    VChart.useRegisters([registerMapChart]);
    return VChart.registerMap(...args);
  };

  constructor(...args: ConstructorParameters<typeof VChart>) {
    VChart.useRegisters(registerCache);

    // 清空缓存
    registerCache.length = 0;

    super(...args);
  }
}

VChartAll.useRegisters([
  // charts
  registerLineChart,
  registerAreaChart,
  registerBarChart,
  registerScatterChart,
  registerPieChart,
  registerRoseChart,
  registerRadarChart,
  registerHistogramChart,
  registerMapChart,
  registerGaugeChart,
  registerWordCloudChart,
  registerWordCloudShapeChart,
  registerFunnelChart,
  registerWaterfallChart,
  registerBoxplotChart,
  registerCircularProgressChart,
  registerLinearProgressChart,
  registerRangeColumnChart,
  registerRangeAreaChart,
  registerSunburstChart,
  registerCirclePackingChart,
  registerTreemapChart,
  registerSankeyChart,
  registerHeatmapChart,
  registerSequenceChart,
  registerCorrelationChart,
  // 优化vchart-all体积, 默认不注册
  // registerLiquidChart,
  registerCommonChart,

  // 3d charts
  registerBar3dChart,
  registerPie3dChart,
  registerHistogram3dChart,
  registerFunnel3dChart,
  registerRangeColumn3dChart,
  registerWordCloud3dChart,
  registerWordCloudShape3dChart,

  // components
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis,
  registerCartesianLogAxis,
  registerCartesianSymlogAxis,
  registerPolarBandAxis,
  registerPolarLinearAxis,

  registerDiscreteLegend,
  registerContinuousLegend,

  registerTooltip,
  registerCartesianCrossHair,
  registerPolarCrossHair,

  registerDataZoom,
  registerScrollBar,
  registerIndicator,
  registerGeoCoordinate,
  registerMarkPoint,
  registerMarkLine,
  registerMarkArea,
  registerTitle,
  registerPlayer,
  registerLabel,
  registerTotalLabel,
  registerBrush,
  registerCustomMark,
  registerMapLabel,
  registerPoptip,

  // layout
  registerGridLayout,
  registerLayout3d,

  // plugin
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerFormatPlugin,

  // vgrammar interactions,
  registerElementActive,

  registerElementActiveByLegend,
  registerElementHighlightByLegend,

  registerElementHighlightByName,
  registerElementHighlightByGroup,
  registerElementHighlightByKey
]);

export { VChartAll };
