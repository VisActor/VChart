import { WaterfallSeries } from './series/waterfall/waterfall';
import { BoxPlotMark } from './mark/box-plot';
import { BoxPlotSeries } from './series/box-plot/box-plot';
import { BoxPlotChart } from './chart/box-plot/box-plot';
import { GridLayout } from './layout/grid-layout/grid-layout';
import { Layout } from './layout/index';
import { Layout3d } from './layout/layout3d';
import { VChart } from './core/vchart';
import { DataZoom } from './component/data-zoom/data-zoom';
import { Bar3dChart, BarChart } from './chart/bar/bar';
import { Histogram3dChart, HistogramChart } from './chart/histogram/histogram';
import { RangeColumn3dChart, RangeColumnChart } from './chart/range-column';
import { ScrollBar } from './component/data-zoom/scroll-bar';
import { RangeAreaChart } from './chart/range-area';
import { LineMark } from './mark/line';
import { SymbolMark } from './mark/symbol';
import { GroupMark } from './mark/group';
import { RuleMark } from './mark/rule';
import { TextMark } from './mark/text';
import { AreaMark } from './mark/area';
import { Rect3dMark, RectMark } from './mark/rect';
import { PathMark } from './mark/path';
import { Arc3dMark, ArcMark } from './mark/arc';
import { Factory } from './core/factory';
import { Region } from './region/region';
import { LineSeries } from './series/line/line';
import { Bar3dSeries, BarSeries } from './series/bar/bar';
import { LineChart } from './chart/line/line';
import { AreaChart } from './chart/area/area';
import { RangeColumn3dSeries, RangeColumnSeries } from './series/range-column/rangeColumn';
import { RangeAreaSeries } from './series/range-area/range-area';
import {
  CartesianAxis,
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis
} from './component/axis/cartesian/index';
import { PolarAxis } from './component/axis/polar';
import { PolarBandAxis } from './component/axis/polar/band-axis';
import { PolarLinearAxis } from './component/axis/polar/linear-axis';
import { DiscreteLegend } from './component/legend/discrete/legend';
import { ContinuousLegend } from './component/legend/continuous';
import { Indicator } from './component/indicator/indicator';
import { Title } from './component/title';
import { MapSeries } from './series/map/map';
import { MapChart } from './chart/map/map';
import { GeoCoordinate } from './component/geo/geo-coordinate';
import { CartesianCrossHair } from './component/crosshair/cartesian';
import { PolarCrossHair } from './component/crosshair/polar';
import { Player } from './component/player';

import { CommonChart } from './chart/common/common';
import { Pie3dSeries, PieSeries } from './series/pie/pie';
import { Pie3dChart, PieChart } from './chart/pie/pie';
import { ScatterChart } from './chart/scatter/scatter';
import { ScatterSeries } from './series/scatter/scatter';
import { RoseChart } from './chart/rose/rose';
import { RadarChart } from './chart/radar/radar';
import { RoseSeries } from './series/rose/rose';
import { RadarSeries } from './series/radar/radar';
import { AreaSeries } from './series/area/area';
import { MarkLine } from './component/marker/mark-line/mark-line';
import { MarkArea } from './component/marker/mark-area/mark-area';
import { MarkPoint } from './component/marker/mark-point/mark-point';
import { Tooltip } from './component/tooltip';
import { Label } from './component/label';
import { SequenceChart } from './chart/sequence/sequence';
import { DotSeries } from './series/dot/dot';
import { LinkSeries } from './series/link/link';
import { CircularProgressSeries } from './series/progress/circular/circular';
import { CircularProgressChart } from './chart/progress/circular/circular';
import { ComponentMark } from './mark/component';
import { LinearProgressSeries } from './series/progress/linear/linear';
import { LinearProgressChart } from './chart/progress/linear/linear';
import { WordCloud3dSeries, WordCloudSeries } from './series/word-cloud/word-cloud';
import { WordCloud3dChart, WordCloudChart } from './chart/word-cloud/word-cloud';
import { Funnel3dChart, FunnelChart } from './chart/funnel/funnel';
import { Funnel3dSeries, FunnelSeries } from './series/funnel/funnel';
import { PolygonMark, Pyramid3dMark } from './mark/polygon';
import { SunburstSeries } from './series/sunburst/sunburst';
import { SunburstChart } from './chart/sunburst';
import { CirclePackingSeries } from './series/circle-packing/circle-packing';
import { CirclePackingChart } from './chart/circle-packing';
import { SankeySeries } from './series/sankey/sankey';
import { SankeyChart } from './chart/sankey';
import { LinkPathMark } from './mark/linkPath';
import { TreeMapSeries } from './series/treemap/treemap';
import { TreeMapChart } from './chart/treemap';
import { WaterfallChart } from './chart/waterfall';
import { GaugePointerSeries, GaugeSeries } from './series/gauge';
import { ProgressArcMark } from './mark/progress-arc';
import { GaugeChart } from './chart/gauge/gauge';
import { CustomMark } from './component/custom-mark';
import { Brush } from './component/brush';
import { MapLabelComponent } from './component/map-label';
import { CellMark } from './mark/cell';
import { HeatmapSeries } from './series/heatmap/heatmap';
import { HeatmapChart } from './chart/heatmap';

// charts
VChart.useChart([
  AreaChart,
  LineChart,
  BarChart,
  Bar3dChart,
  ScatterChart,
  MapChart,
  PieChart,
  Pie3dChart,
  RoseChart,
  RadarChart,
  CommonChart,
  SequenceChart,
  HistogramChart,
  Histogram3dChart,
  CircularProgressChart,
  WordCloudChart,
  WordCloud3dChart,
  FunnelChart,
  Funnel3dChart,
  LinearProgressChart,
  RangeColumnChart,
  RangeColumn3dChart,
  SunburstChart,
  CirclePackingChart,
  TreeMapChart,
  WaterfallChart,
  BoxPlotChart,
  SankeyChart,
  GaugeChart,
  RangeAreaChart,
  HeatmapChart
]);

// series
VChart.useSeries([
  LineSeries,
  AreaSeries,
  BarSeries,
  Bar3dSeries,
  ScatterSeries,
  MapSeries,
  PieSeries,
  Pie3dSeries,
  RoseSeries,
  RadarSeries,
  DotSeries,
  LinkSeries,
  CircularProgressSeries,
  WordCloud3dSeries,
  WordCloudSeries,
  FunnelSeries,
  Funnel3dSeries,
  LinearProgressSeries,
  RangeColumnSeries,
  RangeColumn3dSeries,
  TreeMapSeries,
  SunburstSeries,
  CirclePackingSeries,
  WaterfallSeries,
  BoxPlotSeries,
  SankeySeries,
  GaugePointerSeries,
  GaugeSeries,
  RangeAreaSeries,
  HeatmapSeries
]);

// marks
VChart.useMark([
  SymbolMark,
  LineMark,
  RuleMark,
  TextMark,
  AreaMark,
  RectMark,
  Rect3dMark,
  PathMark,
  ArcMark,
  Arc3dMark,
  GroupMark,
  PolygonMark,
  Pyramid3dMark,
  BoxPlotMark,
  LinkPathMark,
  ProgressArcMark,
  CellMark
]);
// component marks
VChart.useMark([ComponentMark]);

// components
VChart.useComponent([
  CartesianAxis as any,
  CartesianLinearAxis,
  CartesianBandAxis,
  CartesianTimeAxis,
  PolarAxis as any,
  PolarBandAxis,
  PolarLinearAxis,
  DiscreteLegend,
  ContinuousLegend,
  Tooltip,
  CartesianCrossHair,
  PolarCrossHair,
  DataZoom,
  ScrollBar,
  Indicator,
  GeoCoordinate,
  MarkLine,
  Title,
  MarkArea,
  Player,
  Label,
  MarkPoint,
  Brush,
  CustomMark,
  MapLabelComponent
]);

// region
Factory.registerRegion('region', Region as any);

// layout
Factory.registerLayout('base', Layout as any);
Factory.registerLayout('grid', GridLayout as any);
Factory.registerLayout('layout3d', Layout3d as any);

export { VChart };
