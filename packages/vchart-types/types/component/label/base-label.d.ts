import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import type { ILabelSpec } from './interface';
import type { IGraphic, IGroup } from '@visactor/vrender-core';
export declare abstract class BaseLabelComponent<T = any> extends BaseComponent<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    layoutType: 'none';
    layoutZIndex: number;
    constructor(spec: T, options: IComponentOption);
    protected _interactiveConfig(labelSpec: ILabelSpec): {
        hover: boolean;
        select: boolean;
        state: {
            hover?: Partial<import("../../typings").IComposedTextMarkSpec>;
            hover_reverse?: Partial<import("../../typings").IComposedTextMarkSpec>;
            selected?: Partial<import("../../typings").IComposedTextMarkSpec>;
            selected_reverse?: Partial<import("../../typings").IComposedTextMarkSpec>;
        };
    };
    _compareSpec(spec: T, prevSpec: T): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    protected _getNeedClearVRenderComponents(): IGraphic[];
    protected _delegateLabelEvent(component: IGroup): void;
}
