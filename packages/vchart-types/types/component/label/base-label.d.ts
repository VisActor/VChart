import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import type { ILabelSpec } from './interface';
import type { IGraphic } from '@visactor/vrender-core';
import type { ILayoutType } from '../../typings/layout';
export declare abstract class BaseLabelComponent<T extends ILabelSpec = ILabelSpec> extends BaseComponent<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    layoutType: ILayoutType;
    layoutZIndex: number;
    constructor(spec: T, options: IComponentOption);
    protected _interactiveConfig(labelSpec: ILabelSpec): {
        hover: boolean;
        select: boolean;
        state: {
            hover?: Partial<import("../..").ITextMarkSpec>;
            hover_reverse?: Partial<import("../..").ITextMarkSpec>;
            selected?: Partial<import("../..").ITextMarkSpec>;
            selected_reverse?: Partial<import("../..").ITextMarkSpec>;
        };
    } | {
        hover: boolean;
        select: boolean;
    };
    _compareSpec(): {
        change: boolean;
        reMake: boolean;
        reRender: boolean;
        reSize: boolean;
        reCompile: boolean;
    };
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    getVRenderComponents(): IGraphic[];
}
