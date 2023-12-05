import type { IRegion } from '../../region/interface';
import type { IPoint, IOrientType, ILayoutType, ILayoutRect } from '../../typings';
import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { ITitle, ITitleSpec, ITitleTheme } from './interface';
import type { IGraphic } from '@visactor/vrender-core';
export declare class Title extends BaseComponent<ITitleSpec> implements ITitle {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    layoutType: ILayoutType;
    layoutZIndex: number;
    layoutLevel: number;
    protected _theme: ITitleTheme;
    protected _orient: IOrientType;
    private _titleComponent;
    private _cacheAttrs;
    get orient(): IOrientType;
    constructor(spec: ITitleSpec, options: IComponentOption);
    initLayout(): void;
    static createComponent(spec: any, options: IComponentOption): Title | Title[];
    onRender(ctx: any): void;
    _compareSpec(): {
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
