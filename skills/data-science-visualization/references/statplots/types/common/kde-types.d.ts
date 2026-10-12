export interface KdeEstimationSpec {
    kernel?: 'gaussian' | 'epanechnikov';
    bandwidth?: number | 'scott' | 'silverman';
    standardDeviation?: 'sample' | 'population';
    bandwidthAdjust?: number;
}
export interface KdeSamplingSpec {
    points?: number;
    cut?: number;
}
