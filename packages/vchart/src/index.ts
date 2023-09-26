import { VChart } from './vchart-all';
export default VChart;

export * from './core';

// chart
// TODO: bundle should I export all registerMethod ?
export * from './chart';
export * from './series';
export * from './mark';
export * from './component';
export * from './layout';
/**
 * spec
 */
export * from './typings/spec/index';

// theme
export { ThemeManager } from './theme/index';

// vrender
export { vglobal } from '@visactor/vrender';
