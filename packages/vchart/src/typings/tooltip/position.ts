export type ITooltipPositionCallback = (event: MouseEvent) => number;

export interface ITooltipPositionPattern {
  left?: number | ITooltipPositionCallback;
  right?: number | ITooltipPositionCallback;
  top?: number | ITooltipPositionCallback;
  bottom?: number | ITooltipPositionCallback;
}

/** tooltip显示在鼠标所在图形的固定位置，只对mark tooltip有效 */
export const enum TooltipFixedPosition {
  /** tooltip显示在上侧 */
  top = 'top',
  /** tooltip显示在下侧 */
  bottom = 'bottom',
  /** tooltip显示在左侧 */
  left = 'left',
  /** tooltip显示在右侧 */
  right = 'right',
  /**
   * tooltip显示在左上角
   * @since 1.4.0
   */
  tl = 'tl',
  /**
   * tooltip显示在左上角（容错）
   * @since 1.4.0
   */
  lt = 'lt',
  /**
   * tooltip显示在右上角
   * @since 1.4.0
   */
  tr = 'tr',
  /**
   * tooltip显示在右上角（容错）
   * @since 1.4.0
   */
  rt = 'rt',
  /**
   * tooltip显示在左下角
   * @since 1.4.0
   */
  bl = 'bl',
  /**
   * tooltip显示在左下角（容错）
   * @since 1.4.0
   */
  lb = 'lb',
  /**
   * tooltip显示在右下角
   * @since 1.4.0
   */
  br = 'br',
  /**
   * tooltip显示在右下角（容错）
   * @since 1.4.0
   */
  rb = 'rb',
  /** tooltip显示在鼠标所在图形中心位置 */
  inside = 'inside'
}

export const enum TooltipPositionMode {
  /** tooltip固定在鼠标指针附近 */
  pointer = 'pointer',
  /** tooltip固定在图元附近 */
  mark = 'mark'
}

export type TooltipPosition = ITooltipPositionPattern | TooltipFixedPosition;

export interface ITooltipPositionActual {
  x: number;
  y: number;
}
