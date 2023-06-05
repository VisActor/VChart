export type ITooltipPositionCallback = (event: MouseEvent) => number;

export interface ITooltipPositionPattern {
  left?: number | ITooltipPositionCallback;
  right?: number | ITooltipPositionCallback;
  top?: number | ITooltipPositionCallback;
  bottom?: number | ITooltipPositionCallback;
}

/** tooltip显示在鼠标所在图形的固定位置，只对mark tooltip有效 */
export enum TooltipFixedPosition {
  /** tooltip显示在鼠标所在图形上侧 */
  top = 'top',
  /** tooltip显示在鼠标所在图形左侧 */
  left = 'left',
  /** tooltip显示在鼠标所在图形右侧 */
  right = 'right',
  /** tooltip显示在鼠标所在图形下侧 */
  bottom = 'bottom',
  /** tooltip显示在鼠标所在图形中心位置 */
  inside = 'inside'
}

export type TooltipPosition = ITooltipPositionPattern | TooltipFixedPosition;

export interface ITooltipPositionActual {
  x: number;
  y: number;
}
