import type { IBoundsLike } from '@visactor/vutils';
import type { IEffect, IModelInitOption } from '../../../model/interface';
import type { ICartesianSeries } from '../../../series/interface';
import type { IRegion } from '../../../region/interface';
import type { ICartesianAxisCommonSpec, IAxisHelper, ICartesianAxisCommonTheme } from './interface';
import type { IOrientType } from '../../../typings/space';
import type { IBaseScale } from '@visactor/vscale';
import type { StringOrNumber } from '../../../typings/common';
import type { IPoint } from '../../../typings/coordinate';
import type { ILayoutRect, ILayoutType } from '../../../typings/layout';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import type { IAxis, ITick } from '../interface';
import type { DataSet } from '@visactor/vdataset';
import { AxisComponent } from '../base-axis';
import type { IGraphic } from '@visactor/vrender-core';
export declare abstract class CartesianAxis<T extends ICartesianAxisCommonSpec = ICartesianAxisCommonSpec> extends AxisComponent<T> implements IAxis {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    protected readonly _defaultBandPosition = 0.5;
    protected readonly _defaultBandInnerPadding = 0.1;
    protected readonly _defaultBandOuterPadding = 0.3;
    directionStr?: 'l2r' | 'r2l' | 't2b' | 'b2t';
    layoutType: ILayoutType;
    layoutZIndex: number;
    layoutLevel: number;
    protected _dataSet: DataSet;
    layout3dBox?: {
        width: number;
        height: number;
        length: number;
    };
    protected _orient: IOrientType;
    getOrient(): IOrientType;
    protected _scales: IBaseScale[];
    getScales(): IBaseScale[];
    protected _theme: ICartesianAxisCommonTheme;
    protected _statisticsDomain: {
        domain: any[];
        index: {
            [key in StringOrNumber]: number;
        };
    };
    getStatisticsDomain(): {
        domain: any[];
        index: {
            [x: string]: number;
            [x: number]: number;
        };
    };
    protected _tick: ITick | undefined;
    private _axisStyle;
    private _latestBounds;
    private _verticalLimitSize;
    private _unitText;
    protected _layoutCache: {
        width: number;
        height: number;
        _lastComputeOutBounds: IBoundsLike;
    };
    constructor(spec: T, options: IComponentOption);
    static createAxis(spec: any, options: IComponentOption, isHorizontal?: boolean): IAxis;
    static createComponent(spec: any, options: IComponentOption): IAxis | IAxis[];
    initLayout(): void;
    setLayout3dBox(box3d: {
        width: number;
        height: number;
        length: number;
    }): void;
    effect: IEffect;
    protected abstract computeDomain(data: {
        min: number;
        max: number;
        values: any[];
    }[]): StringOrNumber[];
    abstract valueToPosition(value: any): number;
    protected updateScaleRange(): boolean;
    init(option: IModelInitOption): void;
    setAttrFromSpec(): void;
    protected getSeriesStatisticsField(s: ICartesianSeries): string[];
    protected _initTickData(sampling: boolean): void;
    protected _initData(): void;
    protected axisHelper(): IAxisHelper;
    afterCompile(): void;
    onLayoutEnd(ctx: any): void;
    onRender(ctx: any): void;
    changeRegions(regions: IRegion[]): void;
    update(ctx: IComponentOption): void;
    resize(ctx: IComponentOption): void;
    protected collectScale(): IBaseScale[];
    protected collectData(depth?: number): {
        min: number;
        max: number;
        values: any[];
    }[];
    protected updateSeriesScale(): void;
    _transformLayoutPosition: (pos: Partial<IPoint>) => {
        x: number;
        y: number;
    };
    _transformLayoutRect: (result: ILayoutRect) => ILayoutRect;
    getBoundsInRect(rect: ILayoutRect): IBoundsLike;
    updateLayoutAttribute(): void;
    private _getTitleLimit;
    private _getUpdateAttribute;
    protected initEvent(): void;
    private _fixAxisOnZero;
    protected _layoutCacheProcessing(rect: ILayoutRect): ILayoutRect;
    _clearLayoutCache(): void;
    onDataUpdate(): void;
    protected _transformSpec(): void;
    private _appendAxisUnit;
    getVRenderComponents(): IGraphic[];
}
