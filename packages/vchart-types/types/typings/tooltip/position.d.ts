export type ITooltipPositionCallback = (event: MouseEvent) => number;
export interface ITooltipPositionPattern {
    left?: number | ITooltipPositionCallback;
    right?: number | ITooltipPositionCallback;
    top?: number | ITooltipPositionCallback;
    bottom?: number | ITooltipPositionCallback;
}
export declare const enum TooltipFixedPosition {
    top = "top",
    bottom = "bottom",
    left = "left",
    right = "right",
    tl = "tl",
    lt = "lt",
    tr = "tr",
    rt = "rt",
    bl = "bl",
    lb = "lb",
    br = "br",
    rb = "rb",
    inside = "inside"
}
export declare const enum TooltipPositionMode {
    pointer = "pointer",
    mark = "mark"
}
export type TooltipPosition = ITooltipPositionPattern | TooltipFixedPosition;
export interface ITooltipPositionActual {
    x: number;
    y: number;
}
