import type { EmbeddingPlotSpec } from './types';
import { checkSeries, checkUnique, checkRange, issue } from '../../common/validation';
export function validateEmbedding(spec: EmbeddingPlotSpec) {
  const errors = [...checkSeries(spec.data), ...checkUnique(spec.data, row => row.id)];
  if (spec.dimensions) {
    for (const axis of ['x', 'y'] as const) {
      const ratio = spec.dimensions[axis].explainedVarianceRatio;
      if (ratio !== undefined) {
        errors.push(...checkRange(ratio, `/dimensions/${axis}/explainedVarianceRatio`, 0, 1));
        if (spec.method !== 'pca') {
          errors.push(
            issue('UNSUPPORTED_COMBINATION', `/dimensions/${axis}/explainedVarianceRatio`, '只有 PCA 可以显示解释率')
          );
        }
      }
    }
    const sum = (spec.dimensions.x.explainedVarianceRatio ?? 0) + (spec.dimensions.y.explainedVarianceRatio ?? 0);
    if (sum > 1 + 1e-10) {
      errors.push(issue('INVALID_RANGE', '/dimensions', '两个维度的解释率之和不能超过 1'));
    }
  }
  return errors;
}
