/**
 * @description The core module of VChart, containing the necessary interfaces for using VChart.
 */

import { VChart } from './vchart';
import { Factory } from './factory';
import { darkTheme, registerTheme } from '../theme/builtin';
import { darkMobileTheme } from '../theme/builtin/dark-mobile';
import { lightMobileTheme } from '../theme/builtin/light-mobile';

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
registerTheme(darkTheme.name, darkTheme);
registerTheme(lightMobileTheme.name, lightMobileTheme);
registerTheme(darkMobileTheme.name, darkMobileTheme);
// vrender
export { vglobal } from '@visactor/vrender-core';
