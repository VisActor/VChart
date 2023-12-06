import type { Dict, IBoundsLike } from '@visactor/vutils';
import type { IModelLayoutOption, IModelRenderOption } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base/base-component';
import type { IPadding, Maybe, StringOrNumber } from '../../typings';
import type { IComponentOption } from '../interface';
import type { ICrossHair, CrossHairTrigger, ICartesianCrosshairSpec, IPolarCrosshairSpec, ICrosshairTheme, ICrosshairCategoryFieldSpec } from './interface';
import type { IAxis } from '../axis/interface';
export type IBound = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};
export type IAxisInfo<T> = Map<number, IBound & {
    axis: T;
}>;
export interface IHair {
    visible: boolean;
    type: 'rect' | 'line';
    style?: Dict<any>;
    label?: {
        visible: boolean;
        formatMethod?: (text: StringOrNumber | string[], position: string) => string | string[];
        textStyle?: Dict<any>;
        minWidth?: number;
        maxWidth?: number;
        padding?: IPadding | number | number[];
        panel?: Dict<any>;
        zIndex?: number;
    };
}
export declare abstract class BaseCrossHair<T extends ICartesianCrosshairSpec | IPolarCrosshairSpec> extends BaseComponent<T> implements ICrossHair {
    layoutType: 'none';
    gridZIndex: number;
    labelZIndex: number;
    trigger: CrossHairTrigger;
    enable: boolean;
    showDefault: boolean;
    triggerOff: CrossHairTrigger | 'none';
    protected _theme: Maybe<ICrosshairTheme>;
    get enableRemain(): boolean;
    private _limitBounds;
    constructor(spec: T, options: IComponentOption);
    protected abstract _showDefaultCrosshairBySpec(): void;
    protected abstract _layoutCrosshair(x: number, y: number): void;
    protected abstract _parseFieldInfo(): void;
    abstract hide(): void;
    protected _getLimitBounds(): IBoundsLike;
    protected _showDefaultCrosshair(): void;
    setAttrFromSpec(): void;
    created(): void;
    _compareSpec(): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    protected _initEvent(): void;
    private _registerEvent;
    private _eventOff;
    updateLayoutAttribute(): void;
    private _handleEvent;
    private _getTriggerEvent;
    protected _getAxisInfoByField<T = IAxis>(field: 'x' | 'y' | 'category' | 'value'): IAxisInfo<T>;
    changeRegions(regions: IRegion[]): void;
    onLayoutEnd(ctx: IModelLayoutOption): void;
    onRender(ctx: IModelRenderOption): void;
    protected _releaseEvent(): void;
    protected _firstSeries<T>(): T | null;
    protected _parseCrosshairSpec(): void;
    protected _parseField(field: ICrosshairCategoryFieldSpec, fieldName: string): any;
    protected _filterAxisByPoint<T>(axisMap: IAxisInfo<T>, relativeX: number, relativeY: number): IAxisInfo<T>;
}
