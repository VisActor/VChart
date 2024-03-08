import type { ICartesianSeries } from '../../../series';
import type { ILayoutPoint } from '../../../typings';
import type { IHair } from '../base';
import type { AxisCurrentValueMap, ICrosshairInfoX, ICrosshairInfoY } from '../interface';
export declare const layoutByValue: (tag: number, series: ICartesianSeries, layoutStartPoint: ILayoutPoint, currValueX: AxisCurrentValueMap, currValueY: AxisCurrentValueMap, xHair: IHair, yHair: IHair, enableRemain?: boolean, cacheXCrossHairInfo?: ICrosshairInfoX, cacheYCrossHairInfo?: ICrosshairInfoY) => {
    x: ICrosshairInfoX;
    y: ICrosshairInfoY;
    offsetWidth: number;
    offsetHeight: number;
    bandWidth: number;
    bandHeight: number;
};
export declare const layoutVerticalCrosshair: (xHair: IHair, crosshairInfo: ICrosshairInfoX, bandWidth: number, offsetWidth: number) => {
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    };
};
export declare const layoutHorizontalCrosshair: (yHair: IHair, crosshairInfo: ICrosshairInfoY, bandHeight: number, offsetHeight: number) => {
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    };
};
