import type { IAreaGraphicAttribute, IGroupGraphicAttribute, ILineGraphicAttribute } from '@visactor/vrender-core';

export interface RegressionLineData {
  line: { x: number; y: number }[];
  area?: { x: number; y: number; y1: number }[];
}

export interface RegressionLineAttrs extends IGroupGraphicAttribute {
  /**
   * 颜色值
   */
  color?: string;
  /**
   * 回归线配置
   */
  line?: {
    /**
     * 是否显示系列标签
     * @default true
     */
    visible?: boolean;
    /**
     * 线样式
     */
    style?: ILineGraphicAttribute;
  };
  /**
   * 回归线公式标签
   */
  label?: {
    visible?: boolean;
  };
  /**
   * 置信区间
   */
  confidenceInterval?: {
    visible?: boolean;
    style?: IAreaGraphicAttribute;
  };

  data: RegressionLineData[];
}
