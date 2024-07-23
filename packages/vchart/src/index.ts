import { VChart } from './vchart-all';

export default VChart;

export * from './core';

// chart model for extension
export * from './chart';
export * from './chart/base';
export * from './series';
export * from './mark';
export * from './component';
export * from './layout';
export * from './env';
export * from './event';
// plugin路径太深，如果直接引用，会导致tree-shaking失效
export * from './plugin/chart';
export * from './plugin/components/tooltip-handler';
export * from './plugin/components/axis-sync';
