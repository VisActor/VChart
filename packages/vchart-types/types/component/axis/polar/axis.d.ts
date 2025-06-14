import type { IBaseScale } from '@visactor/vscale';
import type { IPolarAxis, IPolarAxisCommonSpec } from './interface';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import type { IPolarTickDataOpt } from '@visactor/vrender-components';
import type { IPolarSeries } from '../../../series/interface';
import type { IPoint, IPolarOrientType, IPolarPoint, StringOrNumber, ILayoutType } from '../../../typings';
import type { Maybe } from '@visactor/vutils';
import type { IEffect, IModelSpecInfo } from '../../../model/interface';
import { AxisComponent } from '../base-axis';
import type { ITick } from '../interface';
export declare abstract class PolarAxis<T extends IPolarAxisCommonSpec = IPolarAxisCommonSpec> extends AxisComponent<T> implements IPolarAxis {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static specKey: string;
    protected readonly _defaultBandPosition = 0;
    protected readonly _defaultBandInnerPadding = 0;
    protected readonly _defaultBandOuterPadding = 0;
    layoutType: ILayoutType;
    layoutZIndex: number;
    protected _tick: ITick | undefined;
    protected _center: {
        x: string | number;
        y: string | number;
    } | null;
    get center(): {
        x: string | number;
        y: string | number;
    };
    protected _startAngle: number;
    get startAngle(): number;
    protected _endAngle: number;
    get endAngle(): number;
    protected _orient: IPolarOrientType;
    getOrient(): IPolarOrientType;
    protected getDefaultInteractive(): boolean;
    protected _groupScales: IBaseScale[];
    getGroupScales(): IBaseScale[];
    private _axisStyle;
    private _gridStyle;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    static createComponent(specInfo: IModelSpecInfo, options: IComponentOption): IPolarAxis;
    constructor(spec: T, options: IComponentOption);
    effect: IEffect;
    setAttrFromSpec(): void;
    _transformLayoutPosition: (pos: Partial<IPoint>) => Partial<IPoint>;
    protected _tickTransformOption(): IPolarTickDataOpt;
    protected updateScaleRange(): boolean;
    protected collectSeriesField(depth: number, series: IPolarSeries): string | string[];
    protected abstract computeDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): StringOrNumber[];
    protected updateSeriesScale(): void;
    protected getSeriesStatisticsField(s: IPolarSeries): string[];
    protected initGroupScales(): void;
    protected axisHelper(): {
        isContinuous: boolean;
        dataToPosition: (values: any[]) => number;
        coordToPoint: (point: IPolarPoint) => IPoint;
        pointToCoord: (point: IPoint) => IPolarPoint;
        center: () => IPoint;
        layoutRadius: () => number;
        getScale: (depth?: number) => IBaseScale;
        getAxisId: () => number;
        getSpec: () => T;
    };
    positionToData(position: IPoint): number;
    coordToPoint(point: IPolarPoint): IPoint;
    pointToCoord(point: IPoint): IPolarPoint;
    getCenter: () => IPoint;
    getOuterRadius(): number;
    getInnerRadius(): number;
    updateLayoutAttribute(): void;
    protected _getNormalizedValue(values: any[], length: number): number;
    protected getLabelItems(length: number): any[];
    protected _getStartValue(): number;
    private _layoutAngleAxis;
    private _layoutRadiusAxis;
    protected _getRelatedAxis(index: number): IPolarAxis | undefined;
    private _computeLayoutRadius;
    private computeLayoutOuterRadius;
    private computeLayoutInnerRadius;
    private getRefLayoutRect;
    private getRefSeriesRadius;
    private _update;
    invert(value: number): number;
}
