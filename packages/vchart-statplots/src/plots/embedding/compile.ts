import type { EmbeddingPlotSpec } from './types';
import { compileScatter } from '../scatter/compile';
export function compileEmbedding(spec: EmbeddingPlotSpec) {
  const label = (axis: 'x' | 'y', index: number) => {
    const dim = spec.dimensions?.[axis];
    return (
      spec.fieldLabels?.[axis] ??
      `${dim?.name ?? spec.method.toUpperCase() + ' ' + index}${
        dim?.explainedVarianceRatio !== undefined ? ` (${(dim.explainedVarianceRatio * 100).toFixed(1)}%)` : ''
      }`
    );
  };
  return compileScatter({ ...spec, type: 'scatterPlot', fieldLabels: { x: label('x', 1), y: label('y', 2) } });
}
