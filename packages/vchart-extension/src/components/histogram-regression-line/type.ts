import type { RegressionLineAttrs } from '../regression-line/type';

export interface HistogramRegressionLineAttrs
  extends Omit<RegressionLineAttrs, 'label' | 'color' | 'confidenceInterval'> {
  type: 'kde' | 'ecdf';
}

export interface HistogramRegressionLineSpec extends Partial<Pick<HistogramRegressionLineAttrs, 'type' | 'line'>> {
  visible?: boolean;
}
