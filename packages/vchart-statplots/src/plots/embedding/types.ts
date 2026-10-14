import type { BaseSpec, SeriesRow } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface EmbeddingPlotRow extends SeriesRow {
  id: string;
  x: number;
  y: number;
}
export interface EmbeddingPlotSpec extends BaseSpec {
  type: 'embeddingPlot';
  data: EmbeddingPlotRow[];
  /** 外部计算方法或结果类型说明；本包不重新拟合或估计。 */
  method: 'pca' | 'tsne' | 'umap';
  dimensions?: {
    x: { name: string; explainedVarianceRatio?: number };
    y: { name: string; explainedVarianceRatio?: number };
  };
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { x?: string; y?: string };
}
