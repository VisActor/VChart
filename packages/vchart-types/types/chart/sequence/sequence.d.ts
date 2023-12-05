import { BaseChart } from '../base-chart';
import type { ISequenceChartSpec, ISequenceSeriesSpec } from './interface';
export declare class SequenceChart extends BaseChart {
    static readonly type: string;
    static readonly view: string;
    readonly type: string;
    transformSpec(spec: ISequenceChartSpec): void;
    protected _createSeries(seriesSpec: ISequenceSeriesSpec[]): void;
    addAttrToComponentSpec(componentSpec: any, attr: string, value: any): any;
    private _getSeriesDataLength;
}
export declare const registerSequenceChart: () => void;
