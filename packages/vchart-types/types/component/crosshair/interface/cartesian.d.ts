import type { StringOrNumber } from '../../../typings';
import type { IAxis } from '../../axis';
export interface ICrosshairInfoX {
    height: number;
    leftPos: number;
    rightPos: number;
    topPos: number;
    x: number;
    bottom: {
        visible: boolean;
        text: StringOrNumber;
        dx: number;
        dy: number;
    };
    top: {
        visible: boolean;
        text: StringOrNumber;
        dx: number;
        dy: number;
    };
    visible: boolean;
    _isCache?: boolean;
    axis: IAxis;
}
export interface ICrosshairInfoY {
    width: number;
    leftPos: number;
    topPos: number;
    bottomPos: number;
    y: number;
    left: {
        visible: boolean;
        text: StringOrNumber;
        dx: number;
        dy: number;
    };
    right: {
        visible: boolean;
        text: StringOrNumber;
        dx: number;
        dy: number;
    };
    visible: boolean;
    _isCache?: boolean;
    axis: IAxis;
}
