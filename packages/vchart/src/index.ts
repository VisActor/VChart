import { VChart } from './vchart-all';
export default VChart;
// // 导出版本号
// export const version = __VERSION__;

// export type { IVChart } from './core/interface';
// export * from './event/interface';

export * from './export/core';

// chart
export * from './export/chart';

// /*
//  * chart
//  */
// export * from './chart';

/*
 * series
 */
// export type { ISeries } from './series/interface';
// export { LineSeries } from './series/line/line';
// export { BarSeries } from './series/bar/bar';
// export { AreaSeries } from './series/area/area';
// export { ScatterSeries } from './series/scatter/scatter';
// export { PieSeries } from './series/pie/pie';
// export { RadarSeries } from './series/radar/radar';
// export { RoseSeries } from './series/rose/rose';
// export { DotSeries } from './series/dot/dot';
// export { LinkSeries } from './series/link/link';
// export { CircularProgressSeries } from './series/progress/circular';
// export { LinearProgressSeries } from './series/progress/linear';
// export { FunnelSeries } from './series/funnel/funnel';
// export { RangeColumnSeries } from './series/range-column/rangeColumn';
// export { RangeAreaSeries } from './series/range-area/range-area';
// export { SankeySeries } from './series/sankey/sankey';
// export { HeatmapSeries } from './series/heatmap/heatmap';
export * from './export/series';
export * from './export/mark';
export * from './export/component';
export * from './export/layout';

// /*
//  * component
//  */
// // cartesian
// export * from './component/axis/cartesian/index';
// // polar
// export * from './component/axis/polar/index';
// // map label
// export * from './component/map-label/index';

/**
//  * layout
//  */
// export * from './layout/index';
// export * from './layout/grid-layout/grid-layout';

/**
 * spec
 */
export * from './typings/spec/index';

// theme
export { ThemeManager } from './theme/index';

// const
// export * from './const/index';
