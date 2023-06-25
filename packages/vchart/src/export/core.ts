/**
 * @description VChart 的核心模块，包含 VChart 使用必须要的接口。
 * The core module of VChart, containing the necessary interfaces for using VChart.
 */

import { VChart } from '../core/vchart';
import { Factory } from '../core/factory';
import { Region } from '../region/region';
import { Layout } from '../layout/index';
import { GroupMark } from '../mark/group';
import { ComponentMark } from '../mark/component';

// register groupMark and componentMark
VChart.useMark([ComponentMark, GroupMark]);

// install region module
Factory.registerRegion('region', Region as any);

// install layout module
Factory.registerLayout('base', Layout as any);

export { VChart, Factory };

// export the version
export const version = __VERSION__;

// export necessary types
export type { IVChart } from '../core/interface';
// the event types
export * from '../event/interface';
export * from '../typings/spec/common';
export type { IStateSpec, StateValueType } from '../compile/mark';
export * from '../theme/interface';
