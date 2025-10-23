import type { RegressionLineAttrs } from '../regression-line/type';

export interface HistogramRegressionLineAttrs extends Omit<RegressionLineAttrs, 'confidenceInterval'> {
  type: 'kde' | 'ecdf';
}

export interface HistogramRegressionLineSpec
  extends Partial<Pick<HistogramRegressionLineAttrs, 'type' | 'line' | 'label' | 'color'>> {
  visible?: boolean;
}
