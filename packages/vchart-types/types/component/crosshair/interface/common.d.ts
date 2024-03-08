import type { StringOrNumber } from '../../../typings';
import type { IAxis } from '../../axis';
export type AxisCurrentValueMap = Map<number, {
    value: StringOrNumber;
    axis: IAxis;
    [key: string]: any;
}>;
