import type { BaseEventParams } from '../../interface';
import type { ISeries } from '../../../series/interface';
import type { Datum } from '../../../typings';
import type { AxisComponent } from '../../../component/axis/base-axis';
export declare enum DimensionEventEnum {
    dimensionHover = "dimensionHover",
    dimensionClick = "dimensionClick"
}
export interface IDimensionInfo {
    index?: number;
    value: string | number;
    axis?: AxisComponent;
    data: IDimensionData[];
}
export interface IDimensionData {
    datum: Datum[];
    series: ISeries;
    key?: string;
}
export type DimensionEventParams = BaseEventParams & {
    action: 'enter' | 'leave' | 'move' | 'click';
    dimensionInfo: IDimensionInfo[];
};
