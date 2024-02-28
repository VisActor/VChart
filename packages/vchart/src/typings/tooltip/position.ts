export type ITooltipPositionCallback = (event: MouseEvent) => number;

export interface ITooltipPositionPattern {
  left?: number | ITooltipPositionCallback;
  right?: number | ITooltipPositionCallback;
  top?: number | ITooltipPositionCallback;
  bottom?: number | ITooltipPositionCallback;
}

/** tooltip显示在鼠标所在图形的固定位置，只对mark tooltip有效 */
export type TooltipFixedPosition =
  /** tooltip显示在上侧 */
  | 'top'
  /** tooltip显示在下侧 */
  | 'bottom'
  /** tooltip显示在左侧 */
  | 'left'
  /** tooltip显示在右侧 */
  | 'right'
  /**
   * tooltip显示在左上角
   * @since 1.4.0
   */
  | 'tl'
  /**
   * tooltip显示在左上角（容错）
   * @since 1.4.0
   */
  | 'lt'
  /**
   * tooltip显示在右上角
   * @since 1.4.0
   */
  | 'tr'
  /**
   * tooltip显示在右上角（容错）
   * @since 1.4.0
   */
  | 'rt'
  /**
   * tooltip显示在左下角
   * @since 1.4.0
   */
  | 'bl'
  /**
   * tooltip显示在左下角（容错）
   * @since 1.4.0
   */
  | 'lb'
  /**
   * tooltip显示在右下角
   * @since 1.4.0
   */
  | 'br'
  /**
   * tooltip显示在右下角（容错）
   * @since 1.4.0
   */
  | 'rb'
  /** tooltip显示在鼠标所在图形中心位置 */
  | 'inside';

export type TooltipPositionMode =
  /** tooltip固定在鼠标指针附近 */
  | 'pointer'
  /** tooltip固定在图元附近 */
  | 'mark';

export type TooltipPosition = ITooltipPositionPattern | TooltipFixedPosition;

export interface ITooltipPositionActual {
  x: number;
  y: number;
}
