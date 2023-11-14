import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { IPolarCrosshairSpec } from './interface';
import type { IPolarAxis } from '../axis/polar/interface';
import type { IPoint, StringOrNumber } from '../../typings';
import type { IHair } from './base';
import { BaseCrossHair } from './base';
import type { IGraphic } from '@visactor/vrender-core';
type IBound = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
type IAxisInfo = Map<number, IBound & {
    axis: IPolarAxis;
}>;
export declare class PolarCrossHair<T extends IPolarCrosshairSpec = IPolarCrosshairSpec> extends BaseCrossHair<T> {
    static specKey: string;
    specKey: string;
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    currValueX: Map<number, {
        v: StringOrNumber;
        axis: IPolarAxis;
        [key: string]: any;
    }>;
    currValueY: Map<number, {
        v: StringOrNumber;
        axis: IPolarAxis;
        [key: string]: any;
    }>;
    xHair: IHair | undefined;
    yHair: (IHair & {
        smooth: boolean;
    }) | undefined;
    private _cacheXCrossHairInfo;
    private _cacheYCrossHairInfo;
    private _radiusCrosshair;
    private _radiusLabelCrosshair;
    private _angleCrosshair;
    private _angleLabelCrosshair;
    static createComponent(spec: any, options: IComponentOption): PolarCrossHair<any> | PolarCrossHair<IPolarCrosshairSpec>[];
    constructor(spec: T, options: IComponentOption);
    protected _showDefaultCrosshair(): void;
    hide(): void;
    findAllAxisContains(relativeX: number, relativeY: number): {
        xAxisMap: Map<number, {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        } & {
            axis: IPolarAxis;
        }>;
        yAxisMap: Map<number, {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        } & {
            axis: IPolarAxis;
        }>;
    };
    getAllAxisValues(axisMap: IAxisInfo, point: IPoint, currValue: Map<number, {
        v: StringOrNumber;
        axis: IPolarAxis;
        [key: string]: any;
    }>): boolean;
    protected _layoutCrosshair(relativeX: number, relativeY: number): void;
    private layoutByValue;
    private _layoutVertical;
    private _layoutHorizontal;
    protected _parseFieldInfo(): void;
    private _updateCrosshairLabel;
    getVRenderComponents(): IGraphic[];
}
export declare const registerPolarCrossHair: () => void;
export {};
