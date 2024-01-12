import type { Maybe } from '@visactor/vutils';
import { DataView } from '@visactor/vdataset';
import type { IDiscreteLegendSpec } from './interface';
import type { ISeries } from '../../../series/interface';
import type { IModelInitOption, IModelSpecInfo } from '../../../model/interface';
import { ComponentTypeEnum } from '../../interface/type';
import { DiscreteLegend as LegendComponent } from '@visactor/vrender-components';
import { BaseLegend } from '../base-legend';
import type { ILayoutRect } from '../../../typings/layout';
export declare class DiscreteLegend extends BaseLegend<IDiscreteLegendSpec> {
    static specKey: string;
    static type: ComponentTypeEnum;
    type: ComponentTypeEnum;
    name: string;
    static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]>;
    init(option: IModelInitOption): void;
    protected _initLegendData(): DataView;
    protected _getSeriesLegendField(s: ISeries): string;
    protected _initSelectedData(): void;
    private _getLegendDefaultData;
    private _addDefaultTitleText;
    protected _getLegendAttributes(rect: ILayoutRect): any;
    protected _getLegendConstructor(): typeof LegendComponent;
    protected _initEvent(): void;
    private _getLegendItems;
}
export declare const registerDiscreteLegend: () => void;
