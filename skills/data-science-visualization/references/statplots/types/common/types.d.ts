export type Interval = {
    kind: 'confidence' | 'prediction' | 'credible';
    level: number;
} | {
    kind: 'standardError' | 'standardDeviation';
    multiplier: number;
} | {
    kind: 'range';
};
export type HexColor = string;
export type CategoricalColorList = HexColor[];
export type SequentialColorList = HexColor[];
export type DivergingColorList = HexColor[];
export interface StatPlotColors {
    categorical?: 'colorblind' | 'deep' | 'vchart' | CategoricalColorList;
    sequential?: 'viridis' | 'cividis' | SequentialColorList;
    diverging?: 'RdBu_r' | DivergingColorList;
}
export interface BaseSpec {
    title?: string;
    description?: string;
    theme?: 'light' | 'dark';
    colors?: StatPlotColors;
}
export interface SeriesRow {
    series?: string;
}
export interface StatPlotIssue {
    code: 'SCHEMA_ERROR' | 'INVALID_RANGE' | 'INVALID_ORDER' | 'DUPLICATE_KEY' | 'INCONSISTENT_SERIES' | 'UNSUPPORTED_COMBINATION';
    path: string;
    message: string;
}
export type ValidationResult = {
    valid: true;
    errors: [];
} | {
    valid: false;
    errors: StatPlotIssue[];
};
