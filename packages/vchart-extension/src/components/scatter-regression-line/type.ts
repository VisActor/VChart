import type { RegressionLineAttrs } from '../regression-line/type';

export interface ScatterRegressionLineAttrs extends RegressionLineAttrs {
  type: 'linear' | 'logisitc' | 'lowess' | 'polynomial';
  /**
   * 多项式回归的阶数，仅当 type 为 polynomial 时有效
   */
  polynomialDegree?: number;
  /**
   * logisitc 回归时，打标字段对应的数据字段名称
   */
  logisiticLabelField?: string;
}

export interface ScatterRegressionLineSpec
  extends Partial<
    Pick<ScatterRegressionLineAttrs, 'type' | 'polynomialDegree' | 'line' | 'label' | 'confidenceInterval'>
  > {
  /**
   * 是否显示回归线
   */
  visible?: boolean;
  /**
   * 主色，可以不设置，默认取散点图系列颜色
   */
  color?: string;
}
