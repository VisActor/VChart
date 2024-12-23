import type { DataView } from '@visactor/vdataset';
import { LineLikeSeriesMixin } from '../mixin/line-mixin';
import { CartesianSeries } from '../cartesian/cartesian';
import type { Datum } from '../../typings';
import type { SeriesMarkMap } from '../interface';
import { SeriesTypeEnum } from '../interface/type';
import type { IAreaSeriesSpec } from './interface';
import type { IMark, IAreaMark } from '../../mark/interface';
import { AreaSeriesSpecTransformer } from './area-transformer';
export interface AreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec> extends Pick<LineLikeSeriesMixin, 'initLineMark' | 'initSymbolMark' | 'initLabelMarkStyle' | 'initLineMarkStyle' | 'initSymbolMarkStyle' | 'encodeDefined' | '_lineMark' | '_symbolMark' | 'addSamplingCompile' | 'addOverlapCompile' | 'reCompileSampling' | 'initLineLabelMarkStyle'>, CartesianSeries<T> {
}
export declare class AreaSeries<T extends IAreaSeriesSpec = IAreaSeriesSpec> extends CartesianSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    static readonly transformerConstructor: any;
    readonly transformerConstructor: typeof AreaSeriesSpecTransformer;
    protected _areaMark: IAreaMark;
    protected _sortDataByAxis: boolean;
    initMark(): void;
    initMarkStyle(): void;
    initAreaMarkStyle(): void;
    initAnimation(): void;
    protected _isAreaVisible(): boolean;
    protected _isLineVisible(): boolean;
    protected initTooltip(): void;
    viewDataStatisticsUpdate(d: DataView): void;
    compile(): void;
    getDefaultShapeType(): string;
    getActiveMarks(): IMark[];
    onLayoutEnd(ctx: any): void;
    getSeriesStyle(datum: Datum): (attribute: string) => any;
}
export declare const registerAreaSeries: () => void;
