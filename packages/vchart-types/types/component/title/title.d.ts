import type { IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import type { IPoint, IOrientType, ILayoutType, ILayoutRect } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { ITitle, ITitleSpec } from './interface';
import type { IGraphic } from '@visactor/vrender-core';
import type { Maybe } from '@visactor/vutils';
export declare class Title<T extends ITitleSpec = ITitleSpec> extends BaseComponent<T> implements ITitle {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    static specKey: string;
    specKey: string;
    layoutType: ILayoutType;
    layoutZIndex: number;
    layoutLevel: number;
    protected _orient: IOrientType;
    private _titleComponent;
    private _cacheAttrs;
    get orient(): IOrientType;
    constructor(spec: T, options: IComponentOption);
    initLayout(): void;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    onRender(ctx: any): void;
    _compareSpec(spec: T, prevSpec: T): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    changeRegions(regions: IRegion[]): void;
    update(ctx: IComponentOption): void;
    resize(ctx: IComponentOption): void;
    afterSetLayoutStartPoint(pos: IPoint): void;
    getBoundsInRect(rect: ILayoutRect): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    private _getTitleLayoutRect;
    private _getTitleAttrs;
    private _createOrUpdateTitleComponent;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    clear(): void;
}
export declare const registerTitle: () => void;
