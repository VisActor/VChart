export type ITooltipPositionCallback = (event: MouseEvent) => number;

export interface ITooltipPositionPattern {
  left?: number | ITooltipPositionCallback;
  right?: number | ITooltipPositionCallback;
  top?: number | ITooltipPositionCallback;
  bottom?: number | ITooltipPositionCallback;
}

/** tooltip显示在鼠标所在图形的固定位置，只对 mark tooltip 有效 */
export type TooltipFixedPosition =
  /** tooltip 显示在上侧 */
  | 'top'
  /** tooltip 显示在下侧 */
  | 'bottom'
  /** tooltip 显示在左侧 */
  | 'left'
  /** tooltip 显示在右侧 */
  | 'right'
  /**
   * tooltip 显示在左上角
   * @since 1.4.0
   */
  | 'tl'
  /**
   * tooltip 显示在左上角（容错）
   * @since 1.4.0
   */
  | 'lt'
  /**
   * tooltip 显示在右上角
   * @since 1.4.0
   */
  | 'tr'
  /**
   * tooltip 显示在右上角（容错）
   * @since 1.4.0
   */
  | 'rt'
  /**
   * tooltip 显示在左下角
   * @since 1.4.0
   */
  | 'bl'
  /**
   * tooltip 显示在左下角（容错）
   * @since 1.4.0
   */
  | 'lb'
  /**
   * tooltip 显示在右下角
   * @since 1.4.0
   */
  | 'br'
  /**
   * tooltip 显示在右下角（容错）
   * @since 1.4.0
   */
  | 'rb'
  /** tooltip 显示在鼠标所在图形中心位置 */
  | 'inside'
  /**
   * tooltip 显示在鼠标所在图形中心位置的上侧
   * @since 1.10.0
   */
  | 'insideTop'
  /**
   * tooltip 显示在鼠标所在图形中心位置的下侧
   * @since 1.10.0
   */
  | 'insideBottom'
  /**
   * tooltip 显示在鼠标所在图形中心位置的左侧
   * @since 1.10.0
   */
  | 'insideLeft'
  /**
   * tooltip 显示在鼠标所在图形中心位置的右侧
   * @since 1.10.0
   */
  | 'insideRight';

export type TooltipPositionMode =
  /** tooltip 固定在鼠标指针附近 */
  | 'pointer'
  /** tooltip 固定在图元附近 */
  | 'mark'
  /** tooltip 固定在 crosshair 附近 */
  | 'crosshair';

export type TooltipPosition = ITooltipPositionPattern | TooltipFixedPosition;

export interface ITooltipPositionActual {
  x: number;
  y: number;
}
