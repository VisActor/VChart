import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
import type { IComponentOption } from '../interface';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec } from '../../typings';
import type { MarkTypeEnum } from '../../mark/interface';
import type { IGraphic } from '@visactor/vrender-core';
export declare class CustomMark extends BaseComponent<any> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    layoutType: 'none';
    layoutZIndex: number;
    layoutLevel: number;
    protected _spec: (ICustomMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | ICustomMarkGroupSpec)[];
    static createComponent(spec: any, options: IComponentOption): CustomMark[];
    created(): void;
    protected initMarks(): void;
    private _createExtensionMark;
    initEvent(): void;
    _compareSpec(): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    changeRegions(regions: IRegion[]): void;
    getVRenderComponents(): IGraphic[];
    onRender(ctx: IModelRenderOption): void;
    private _getMarkAttributeContext;
}
export declare const registerCustomMark: () => void;
