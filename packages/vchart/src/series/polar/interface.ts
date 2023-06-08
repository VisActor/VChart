import type { ISeriesSpec } from '../../typings/spec/common';

export interface IPolarSeriesSpec extends ISeriesSpec {
  /** 饼图中心点 x 坐标 */
  centerX?: number;
  /** 饼图中心点 y 坐标 */
  centerY?: number;

  /**
   * 扇区外半径
   * @default 0.6
   */
  outerRadius?: number;

  /**
   * 扇区内半径
   */
  innerRadius?: number;

  /** 扇区起始角度 */
  startAngle?: number;
  /** 扇区结束角度 */
  endAngle?: number;

  /** 类别字段 */
  categoryField?: string | string[];

  /** 数值字段 */
  valueField?: string | string[];

  /**
   * @deprecated 请使用 `valueField`
   */
  radiusField?: string | string[];

  /**
   * @deprecated 请使用 `categoryField`
   */
  angleField?: string | string[];

  /**
   * 扇区半径
   * @default 0.6
   * @deprecated use outerRadius instead
   */
  radius?: number;
}

export interface IPolarSeriesTheme {
  /**
   * @deprecated use outerRadius instead
   */
  radius?: number;
  outerRadius?: number;
  innerRadius?: number;
  startAngle?: number;
  endAngle?: number;
}
