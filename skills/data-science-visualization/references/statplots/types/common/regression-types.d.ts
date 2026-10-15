import type { SeriesRow } from './types';
export interface RegressionObservation extends SeriesRow {
    x: number;
    y: number;
    id?: string;
}
export interface LinearRegressionOptions {
    method: 'linear';
}
export interface PolynomialRegressionOptions {
    method: 'polynomial';
    degree: number;
}
export interface LowessRegressionOptions {
    method: 'lowess';
    span?: number;
    iterations?: number;
    delta?: number;
}
export type RegressionOptions = LinearRegressionOptions | PolynomialRegressionOptions | LowessRegressionOptions;
export type RegressionConfidence = false | {
    kind: 'confidence';
    level?: number;
    resamples?: number;
    seed?: number;
};
