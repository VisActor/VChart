import type { Maybe } from '@visactor/vutils';
import type { IComponentOption } from '../../interface';
import { ComponentTypeEnum } from '../../interface/type';
import { DataFilterBaseComponent } from '../data-filter-base-component';
import { DataZoom as DataZoomComponent } from '@visactor/vrender-components';
import type { IRectGraphicAttribute, ISymbolGraphicAttribute, IGraphic } from '@visactor/vrender-core';
import type { Datum, ILayoutType } from '../../../typings';
import type { ILinearScale, IBaseScale } from '@visactor/vscale';
import type { IDataZoomSpec } from './interface';
import type { IModelSpecInfo } from '../../../model/interface';
import { DataZoomSpecTransformer } from './data-zoom-transformer';
export declare class DataZoom<T extends IDataZoomSpec = IDataZoomSpec> extends DataFilterBaseComponent<T> {
    static type: ComponentTypeEnum;
    static readonly transformerConstructor: any;
    type: ComponentTypeEnum;
    name: string;
    readonly transformerConstructor: typeof DataZoomSpecTransformer;
    static specKey: string;
    specKey: string;
    layoutZIndex: number;
    layoutLevel: number;
    layoutType: ILayoutType;
    protected _component: DataZoomComponent;
    protected _valueScale: ILinearScale;
    protected _backgroundSize: number;
    protected _middleHandlerSize: number;
    protected _startHandlerSize: number;
    protected _endHandlerSize: number;
    protected _isReverseCache: boolean;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    constructor(spec: T, options: IComponentOption);
    created(): void;
    setAttrFromSpec(): void;
    onLayoutEnd(ctx: any): void;
    protected _initValueScale(): void;
    protected _updateScaleRange(): void;
    protected _computeDomainOfValueScale(): unknown[];
    protected _computeMiddleHandlerSize(): number;
    protected _computeWidth(): number;
    protected _computeHeight(): number;
    protected _isScaleValid(scale: IBaseScale | ILinearScale): boolean;
    protected _dataToPositionX: (datum: Datum) => number;
    protected _dataToPositionX2: (datum: Datum) => number;
    protected _dataToPositionY: (datum: Datum) => number;
    protected _dataToPositionY2: (datum: Datum) => number;
    private _getAttrs;
    protected _createOrUpdateComponent(): void;
    protected _handleChange(start: number, end: number, updateComponent?: boolean, tag?: string): void;
    protected _handleDataCollectionChange(): void;
    protected _getComponentAttrs(): {
        backgroundStyle: IRectGraphicAttribute;
        startHandlerStyle: ISymbolGraphicAttribute;
        middleHandlerStyle: {
            visible: boolean;
            icon: ISymbolGraphicAttribute;
            background: any;
        } | {
            visible: boolean;
            icon?: undefined;
            background?: undefined;
        };
        endHandlerStyle: ISymbolGraphicAttribute;
        startTextStyle: unknown;
        endTextStyle: unknown;
        selectedBackgroundStyle: IRectGraphicAttribute;
        dragMaskStyle: IRectGraphicAttribute;
        backgroundChartStyle: {
            line: any;
            area: any;
        };
        selectedBackgroundChartStyle: {
            line: any;
            area: any;
        };
        disableTriggerEvent: boolean;
    };
    protected _getNeedClearVRenderComponents(): IGraphic[];
}
export declare const registerDataZoom: () => void;
