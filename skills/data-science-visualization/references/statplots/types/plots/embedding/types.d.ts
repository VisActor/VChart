import type { BaseSpec, SeriesRow } from '../../common/types';
export interface EmbeddingPlotRow extends SeriesRow {
    id: string;
    x: number;
    y: number;
}
export interface EmbeddingPlotSpec extends BaseSpec {
    type: 'embeddingPlot';
    data: EmbeddingPlotRow[];
    method: 'pca' | 'tsne' | 'umap';
    dimensions?: {
        x: {
            name: string;
            explainedVarianceRatio?: number;
        };
        y: {
            name: string;
            explainedVarianceRatio?: number;
        };
    };
    fieldLabels?: {
        x?: string;
        y?: string;
    };
}
