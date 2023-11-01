/**
 * @description The core module of VChart, containing the necessary interfaces for using VChart.
 */

import { VChart } from './vchart';
import { Factory } from './factory';

export { VChart, Factory };

// export the version
export const version = __VERSION__;

// export necessary types
export type { IVChart } from './interface';
export type { IStateSpec, StateValueType } from '../compile/mark';

export * from '../typings/spec/common';
export * from '../event/interface';
export * from '../theme/interface';

/**
 * spec
 */
export * from '../typings/spec/index';

// theme
export * from '../theme/index';

// vrender
export { vglobal } from '@visactor/vrender-core';
