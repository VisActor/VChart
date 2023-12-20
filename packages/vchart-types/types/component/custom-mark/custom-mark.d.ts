import { BaseComponent } from '../base/base-component';
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { EnableMarkType, ICustomMarkGroupSpec, ICustomMarkSpec } from '../../typings';
import type { MarkTypeEnum } from '../../mark/interface';
import type { Maybe } from '@visactor/vutils';
import type { IGraphic } from '@visactor/vrender-core';
export declare class CustomMark<T = any> extends BaseComponent<any> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    static specKey: string;
    specKey: string;
    layoutType: 'none';
    layoutZIndex: number;
    layoutLevel: number;
    protected _spec: (ICustomMarkSpec<Exclude<EnableMarkType, MarkTypeEnum.group>> | ICustomMarkGroupSpec)[];
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    created(): void;
    protected initMarks(): void;
    private _createExtensionMark;
    initEvent(): void;
    _compareSpec(spec: T, prevSpec: T): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    changeRegions(regions: IRegion[]): void;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    onRender(ctx: IModelRenderOption): void;
    private _getMarkAttributeContext;
}
export declare const registerCustomMark: () => void;
