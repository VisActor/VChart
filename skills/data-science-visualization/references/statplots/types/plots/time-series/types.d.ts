import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
import type { SampleErrorBar } from '../../common/sample-estimate-types';
export interface TimeSeriesObservation extends SeriesRow {
    time: string;
    value: number | null;
}
export interface TimeSeriesEstimate extends TimeSeriesObservation {
    lower?: number;
    upper?: number;
}
export type TimeSeriesPlotRow = TimeSeriesEstimate;
interface TimeSeriesBase extends BaseSpec {
    type: 'timeSeriesPlot';
    fieldLabels?: {
        time?: string;
        value?: string;
    };
}
interface TimeSeriesObservationsBase extends TimeSeriesBase {
    input: 'observations';
    data: TimeSeriesObservation[];
}
export type TimeSeriesObservationsSpec = TimeSeriesObservationsBase & ({
    estimator?: 'mean' | 'median';
    errorBar?: SampleErrorBar;
} | {
    estimator: false;
    errorBar?: false;
});
export interface TimeSeriesEstimatesSpec extends TimeSeriesBase {
    input: 'estimates';
    data: TimeSeriesEstimate[];
    interval?: Interval;
}
export type TimeSeriesPlotSpec = TimeSeriesObservationsSpec | TimeSeriesEstimatesSpec;
export {};
