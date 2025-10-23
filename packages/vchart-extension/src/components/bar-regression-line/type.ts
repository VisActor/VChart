import type { RegressionLineAttrs } from '../regression-line/type';

export interface BarRegressionLineAttrs extends RegressionLineAttrs {
  /**
   * 多项式回归的阶数，仅当 type 为 polynomial 时有效
   */
  degree?: number;
}

export interface BarRegressionLineSpec
  extends Partial<Pick<BarRegressionLineAttrs, 'line' | 'label' | 'confidenceInterval' | 'color' | 'degree'>> {
  visible?: boolean;
}
