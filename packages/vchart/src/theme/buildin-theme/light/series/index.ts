import type { ISeriesTheme } from '../../../../series/interface';
import { area } from './area';
import { bar } from './bar';
import { bar3d } from './bar3d';
import { circularProgress } from './circular-progress';
import { dot } from './dot';
import { funnel } from './funnel';
import { funnel3d } from './funnel3d';
import { gauge } from './gauge';
import { gaugePointer } from './gauge-pointer';
import { line } from './line';
import { linearProgress } from './linear-progress';
import { link } from './link';
import { map } from './map';
import { pie } from './pie';
import { pie3d } from './pie3d';
import { radar } from './radar';
import { scatter } from './scatter';
import { waterfall } from './waterfall';
import { wordCloud } from './word-cloud';
import { wordCloud3d } from './word-cloud3d';
import { treemap } from './treemap';
import { sunburst } from './sunburst';
import { rangeColumn } from './rangeColumn';
import { circlePacking } from './circle-packing';
import { heatmap } from './heatmap';
import { sankey } from './sankey';
import { rose } from './rose';
import { boxPlot } from './box-plot';

export const series: ISeriesTheme = {
  scatter,
  line,
  area,
  bar,
  bar3d,
  pie,
  pie3d,
  map,
  radar,
  dot,
  link,
  wordCloud,
  wordCloud3d,
  funnel,
  funnel3d,
  linearProgress,
  circularProgress,
  waterfall,
  gauge,
  gaugePointer,
  treemap,
  sunburst,
  rangeColumn,
  circlePacking,
  heatmap,
  sankey,
  rose,
  boxPlot
};
