import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface/type';
import type { IRegion } from '../../region/interface';
import type { IModelInitOption, IModelSpecInfo } from '../../model/interface';
import type { ISeries } from '../../series/interface';
import type { ILabel, IMark as IVGrammarMark } from '@visactor/vgrammar-core';
import type { IComponentMark } from '../../mark/component';
import { BaseLabelComponent } from './base-label';
import type { Maybe } from '@visactor/vutils';
import type { IGroup } from '@visactor/vrender-core';
import type { TransformedLabelSpec } from './interface';
import type { ILabelMark } from '../../mark/label';
import type { ICompilableMark } from '../../compile/mark';
import type { IChartSpecInfo } from '../../chart/interface';
import type { IChartSpec } from '../../typings';
import { LabelSpecTransformer } from './label-transformer';
export interface ILabelInfo {
    baseMark: ICompilableMark;
    labelMark: ILabelMark;
    series: ISeries;
    labelSpec: TransformedLabelSpec;
}
export interface ILabelComponentContext {
    region: IRegion;
    labelInfo: ILabelInfo[];
}
export declare class Label<T extends IChartSpec = any> extends BaseLabelComponent<T> {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static specKey: string;
    specKey: string;
    static readonly transformerConstructor: any;
    readonly transformerConstructor: typeof LabelSpecTransformer;
    layoutZIndex: number;
    protected _labelInfoMap: Map<IRegion, ILabelInfo[]>;
    protected _labelComponentMap: Map<IComponentMark, () => ILabelInfo | ILabelInfo[]>;
    protected _layoutRule: 'series' | 'region';
    constructor(spec: T, options: IComponentOption);
    static getSpecInfo(chartSpec: any, chartSpecInfo: IChartSpecInfo): Maybe<IModelSpecInfo[]>;
    init(option: IModelInitOption): void;
    reInit(spec?: T): void;
    initEvent(): void;
    protected _delegateLabelEvent(component: IGroup): void;
    protected _initTextMark(): void;
    protected _initLabelComponent(): void;
    protected _initTextMarkStyle(): void;
    updateLayoutAttribute(): void;
    protected _updateMultiLabelAttribute(labelInfo: ILabelInfo[], labelComponent: IComponentMark): void;
    protected _updateSingleLabelAttribute(labelInfo: ILabelInfo, labelComponent: IComponentMark): void;
    protected _updateLabelComponentAttribute(component: ILabel, target: IVGrammarMark | IVGrammarMark[], labelInfos: ILabelInfo[]): void;
    compileMarks(): void;
    getVRenderComponents(): any[];
}
export declare const registerLabel: () => void;
