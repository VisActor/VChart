import { VChart } from './vchart-all';
import { initAllEnv } from '@visactor/vrender-kits';

initAllEnv();
export default VChart;

export * from './core';

// chart
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
export { vglobal } from '@visactor/vrender-core';
