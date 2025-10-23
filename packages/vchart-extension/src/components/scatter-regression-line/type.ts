import type { RegressionLineAttrs } from '../regression-line/type';

export interface ScatterRegressionLineAttrs extends RegressionLineAttrs {
  type: 'linear' | 'logisitc' | 'lowess' | 'polynomial';
  /**
   * 多项式回归的阶数，仅当 type 为 polynomial 时有效
   */
  polynomialDegree?: number;
}

export interface ScatterRegressionLineSpec
  extends Partial<
    Pick<ScatterRegressionLineAttrs, 'type' | 'polynomialDegree' | 'line' | 'label' | 'confidenceInterval' | 'color'>
  > {
  visible?: boolean;
}
