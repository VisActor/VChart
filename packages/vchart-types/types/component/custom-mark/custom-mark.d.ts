import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec, ILayoutRect } from '../../typings';
import type { Maybe } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
import type { IModelMarkAttributeContext } from '../../compile/mark/interface';
export declare class CustomMark extends BaseComponent<ICustomMarkSpec<EnableMarkType>> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    static specKey: string;
    specKey: string;
    layoutType: 'none';
    layoutZIndex: number;
    layoutLevel: number;
    protected _spec: ICustomMarkSpec<Exclude<EnableMarkType, 'group'>> | ICustomMarkGroupSpec;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    created(): void;
    protected _markAttributeContext: IModelMarkAttributeContext;
    getMarkAttributeContext(): IModelMarkAttributeContext;
    protected _buildMarkAttributeContext(): void;
    protected initMarks(): void;
    private _createExtensionMark;
    initEvent(): void;
    _compareSpec(spec: ICustomMarkSpec<EnableMarkType>, prevSpec: ICustomMarkSpec<EnableMarkType>): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    changeRegions(regions: IRegion[]): void;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    onRender(ctx: IModelRenderOption): void;
    afterCompile(): void;
    private _getMarkAttributeContext;
    private _getLayoutRect;
    getBoundsInRect(rect: ILayoutRect): {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
}
export declare const registerCustomMark: () => void;
