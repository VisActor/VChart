import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
import { Brush as BrushComponent } from '@visactor/vrender-components';
import type { Maybe } from '@visactor/vutils';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { IGraphic } from '@visactor/vrender-core';
import type { ISeries } from '../../series/interface';
import type { IElement } from '@visactor/vgrammar-core';
import type { BrushInteractiveRangeAttr, IBrush, IBrushSpec } from './interface';
export declare class Brush<T extends IBrushSpec = IBrushSpec> extends BaseComponent<T> implements IBrush {
    layoutType: 'none';
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static specKey: string;
    specKey: string;
    layoutZIndex: number;
    protected _brushComponents: BrushComponent[];
    protected _relativeRegions: IRegion[];
    protected _linkedSeries: ISeries[];
    private _itemMap;
    private _linkedItemMap;
    protected _inBrushElementsMap: {
        [brushName: string]: {
            [elementKey: string]: IElement;
        };
    };
    protected _outOfBrushElementsMap: {
        [elementKey: string]: IElement;
    };
    protected _linkedInBrushElementsMap: {
        [brushName: string]: {
            [elementKey: string]: IElement;
        };
    };
    protected _linkedOutOfBrushElementsMap: {
        [elementKey: string]: IElement;
    };
    private _needInitOutState;
    private _cacheInteractiveRangeAttrs;
    private _needEnablePickable;
    init(): void;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    created(): void;
    protected _extendDataInBrush(elementsMap: {
        [brushName: string]: {
            [elementKey: string]: IElement;
        };
    }): any[];
    protected _extendDatumOutOfBrush(elementsMap: {
        [elementKey: string]: IElement;
    }): any[];
    protected _getBrushInteractiveAttr(region: IRegion): BrushInteractiveRangeAttr;
    protected _updateBrushComponent(region: IRegion, componentIndex: number): void;
    protected _createBrushComponent(region: IRegion, componentIndex: number): void;
    private _handleBrushChange;
    private _emitEvent;
    private _transformBrushedMarkAttr;
    private _reconfigItem;
    private _reconfigLinkedItem;
    private _isBrushContainItem;
    protected _bindRegions(): void;
    protected _bindLinkedSeries(): void;
    private _initNeedOperatedItem;
    protected _initMarkBrushState(componentIndex: number, stateName: string): void;
    protected initEvent(): void;
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    _compareSpec(spec: T, prevSpec: T): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    onLayoutEnd(ctx: any): void;
    clearGraphic(): void;
    clear(): void;
}
export declare const registerBrush: () => void;
