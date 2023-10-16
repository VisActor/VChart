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

// the event types
export * from '../event/interface';
export * from '../typings/spec/common';
export * from '../theme/interface';
export * from '../constant';
export type { IStateSpec, StateValueType } from '../compile/mark';
