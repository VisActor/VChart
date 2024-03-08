import type { IPolarSeries } from '../../../series';
import type { IHair, IHairRadius } from '../base';
import type { AxisCurrentValueMap, IPolarCrosshairInfo } from '../interface';
export declare const layoutByValue: (series: IPolarSeries, currValueAngle: AxisCurrentValueMap, currValueRadius: AxisCurrentValueMap, angleHair: IHair, radiusHair: IHair, enableRemain?: boolean, cacheAngleCrossHairInfo?: IPolarCrosshairInfo, cacheRadiusCrossHairInfo?: IPolarCrosshairInfo) => {
    angle: IPolarCrosshairInfo;
    radius: IPolarCrosshairInfo;
};
export declare const layoutAngleCrosshair: (angleHair: IHair, crosshairInfo: IPolarCrosshairInfo) => {
    center: import("../../../typings").IPoint;
    innerRadius: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    start?: undefined;
    end?: undefined;
} | {
    start: {
        x: number;
        y: number;
    };
    end: {
        x: number;
        y: number;
    };
    center?: undefined;
    innerRadius?: undefined;
    radius?: undefined;
    startAngle?: undefined;
    endAngle?: undefined;
};
export declare const layoutRadiusCrosshair: (radiusHair: IHairRadius, crosshairInfo: IPolarCrosshairInfo) => {
    center: import("../../../typings").IPoint;
    startAngle: number;
    endAngle: number;
    radius: number;
    sides: number;
};
