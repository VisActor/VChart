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
export type { IRegion } from '../region/interface';

export * from '../typings/spec/common';
export * from '../event/interface';
export * from '../theme/interface';
export * from './interface';

// some constants
export * from '../constant/base';
export * from '../constant/data';

/**
 * spec
 */
export * from '../typings/spec/index';

// tooltip
export * from '../typings/tooltip';

// theme
export * from '../theme/index';

// vrender
export { vglobal } from '@visactor/vrender-core';
