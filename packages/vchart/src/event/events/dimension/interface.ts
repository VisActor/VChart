import type { BaseEventParams } from '../../interface';
import type { ISeries } from '../../../series/interface';
import type { Datum } from '../../../typings';
import type { AxisComponent } from '../../../component/axis/base-axis';

export enum DimensionEventEnum {
  dimensionHover = 'dimensionHover',
  dimensionClick = 'dimensionClick'
}

export interface IDimensionInfo {
  /** 维度项索引，在连续轴上不存在 */
  index?: number;
  /** 维度项原始值，在离散轴上为维度标签，在连续轴上为数字 */
  value: string;
  /** 维度项所在轴 */
  axis?: AxisComponent;
  /** 维度项对应数据 */
  data: IDimensionData[];
}

export interface IDimensionData {
  /** 图元上的原始数据（考虑到有多个图元的情况，实际为数组类型） */
  datum: Datum[];
  /** 图元所在的系列实例 */
  series: ISeries;
}

export type DimensionEventParams = BaseEventParams & {
  action: 'enter' | 'leave' | 'move' | 'click';
  dimensionInfo: IDimensionInfo[];
};
