import { CartesianSeries } from '../../cartesian/cartesian';
import type { SeriesMarkMap } from '../../interface';
import { SeriesTypeEnum } from '../../interface/type';
import type { ILinearProgressSeriesSpec } from './interface';
import type { IMark } from '../../../mark/interface';
export declare class LinearProgressSeries<T extends ILinearProgressSeriesSpec = ILinearProgressSeriesSpec> extends CartesianSeries<T> {
    static readonly type: string;
    type: SeriesTypeEnum;
    static readonly mark: SeriesMarkMap;
    private _progressMark;
    private _trackMark;
    initMark(): void;
    initMarkStyle(): void;
    private _initProgressMark;
    private _initProgressMarkStyle;
    private _defaultProgressCustomShape;
    private _initTrackMark;
    private _initTrackMarkStyle;
    initInteraction(): void;
    initAnimation(): void;
    protected initTooltip(): void;
    getActiveMarks(): IMark[];
}
export declare const registerLinearProgressSeries: () => void;
