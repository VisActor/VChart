import { ComponentTypeEnum } from '../interface/type';
import type { MarkType } from '../../mark/interface';
import type { ISeries } from '../../series/interface';
import { BaseLabelComponent } from './base-label';
import type { IModelInitOption, IModelSpecInfo } from '../../model/interface';
import type { Maybe } from '../../typings';
import type { IChartSpecInfo } from '../../chart/interface';
export declare class TotalLabel extends BaseLabelComponent {
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static specKey: string;
    specKey: string;
    layoutZIndex: number;
    private _textMark?;
    private _baseMark?;
    static getSpecInfo(chartSpec: any, chartSpecInfo?: IChartSpecInfo): Maybe<IModelSpecInfo[]>;
    init(option: IModelInitOption): void;
    protected _initTextMark(): void;
    _initTextMarkStyle(): void;
    protected _initLabelComponent(): void;
    updateLayoutAttribute(): void;
    compileMarks(): void;
    getVRenderComponents(): any[];
    protected _getSeries(): ISeries;
}
export declare function totalLabelPosition(series: ISeries, type: MarkType): string;
export declare const registerTotalLabel: () => void;
