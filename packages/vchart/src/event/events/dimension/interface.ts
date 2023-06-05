import type { BaseEventParams } from '../../interface';
import type { ISeries } from '../../../series/interface';
import type { Datum } from '../../../typings';
import type { AxisComponent } from '../../../component/axis/base-axis';

export enum DimensionEventEnum {
  dimensionHover = 'dimensionHover',
  dimensionClick = 'dimensionClick'
}

export interface IDimensionInfo {
  /** 维度项索引 */
  index?: number;
  /** 维度项标题 */
  value: string;
  /** 维度项所在轴 */
  axis?: AxisComponent;
  /** 维度项对应数据 */
  data: IDimensionData[];
}

export interface IDimensionData {
  datum: Datum[];
  series: ISeries;
}

export type DimensionEventParams = BaseEventParams & {
  action: 'enter' | 'leave' | 'move' | 'click';
  dimensionInfo: IDimensionInfo[];
};
