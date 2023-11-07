import type { SymbolType } from '@visactor/vrender-core';
export declare enum ShapeTypeEnum {
    circle = "circle",
    triangle = "triangle",
    triangleUp = "triangleUp",
    triangleLeft = "triangleLeft",
    triangleRight = "triangleRight",
    triangleDown = "triangleDown",
    thinTriangle = "thinTriangle",
    rect = "rect",
    diamond = "diamond",
    square = "square",
    arrowLeft = "arrowLeft",
    arrow2Left = "arrow2Left",
    arrowRight = "arrowRight",
    arrow2Right = "arrow2Right",
    cross = "cross",
    wedge = "wedge",
    star = "star",
    wye = "wye"
}
export type ShapeType = SymbolType;
export declare const ShapeTypes: string[];
export interface IShapeStyle {
    shape?: ShapeType;
    size?: number;
}
