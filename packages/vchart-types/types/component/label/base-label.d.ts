import { BaseComponent } from '../base/base-component';
import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelRenderOption } from '../../model/interface';
import type { ILabelSpec } from './interface';
import type { IGraphic } from '@visactor/vrender-core';
import type { IComponentMark } from '../../mark/interface/mark';
import type { ICompilableMark } from '../../compile/mark/interface';
import type { IMark } from '../../mark/interface/common';
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
    _getDataLabelType(baseMark: ICompilableMark, type?: string): string;
    _setTransformOfComponent(labelComponent: IComponentMark, baseMark: IMark | IMark[]): void;
    onRender(ctx: IModelRenderOption): void;
    changeRegions(regions: IRegion[]): void;
    protected _getNeedClearVRenderComponents(): IGraphic[];
}
