export type ITooltipPositionCallback = (event: MouseEvent) => number;
export interface ITooltipPositionPattern {
    left?: number | ITooltipPositionCallback;
    right?: number | ITooltipPositionCallback;
    top?: number | ITooltipPositionCallback;
    bottom?: number | ITooltipPositionCallback;
}
export type TooltipFixedPosition = 'top' | 'bottom' | 'left' | 'right' | 'tl' | 'lt' | 'tr' | 'rt' | 'bl' | 'lb' | 'br' | 'rb' | 'inside';
export type TooltipPositionMode = 'pointer' | 'mark';
export type TooltipPosition = ITooltipPositionPattern | TooltipFixedPosition;
export interface ITooltipPositionActual {
    x: number;
    y: number;
}
