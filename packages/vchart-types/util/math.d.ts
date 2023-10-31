import type { IBoundsLike } from '@visactor/vutils';
import type { IPoint, IPolarPoint, Quadrant } from '../typings';
import { isNumberClose, isGreater, isLess } from '@visactor/vutils';
import { normalizeAngle, angleLabelOrientAttribute } from '@visactor/vutils-extension';
export declare const isClose: typeof isNumberClose;
export { isGreater, isLess, normalizeAngle, angleLabelOrientAttribute };
export declare function polarToCartesian(point: IPolarPoint): IPoint;
export declare function computeQuadrant(angle: number): Quadrant;
export declare function normalizeStartEndAngle(start: number | null, end: number | null): {
    startAngle: number;
    endAngle: number;
};
export declare function outOfBounds(bounds: IBoundsLike, x: number, y: number): boolean;
export declare function min(data: any[], field?: string): number;
export declare function max(data: any[], field?: string): number;
export declare function sum(data: any[], field?: string): number;
export declare function average(data: any[], field?: string): number;
export declare function variance(data: any[], field?: string): number;
export declare function standardDeviation(data: any[], field?: string): number;
export declare function median(data: any[], field?: string): number;
export declare function regression(data: any[], fieldX?: string, fieldY?: string): any[];
export declare function radiusLabelOrientAttribute(angle: number): {
    align: "left" | "right" | "center";
    baseline: "top" | "bottom" | "middle";
};
export declare function vectorAngle(v1: IPoint, v2: IPoint): number;
export declare function distance(p1: IPoint, p2?: IPoint): number;
