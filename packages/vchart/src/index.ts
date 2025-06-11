import { VChart } from './vchart-all';

export default VChart;

export * from './core';

// chart model for extension
export * from './chart';
export * from './chart/base';
export * from './chart/cartesian';
export * from './chart/common';
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
export * from './plugin/other';
export * from './plugin/base/base-plugin';
export * from './vrender-tools';
// util
export * from './util/data';
export * from './util/spec/transform';
export * from './util/mark';
export * from './util/region';

// base component model for extension
export * from './component/base';
export * from './compile/data/compilable-data';
export * from './animation';
export * from './interaction';
