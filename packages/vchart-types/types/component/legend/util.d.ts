import type { ILegendCommonSpec, ITitle } from './interface';
export declare function transformLegendTitleAttributes(title: ITitle): {
    textStyle?: import("./interface").NoVisibleMarkStyle<import("../..").ITextMarkSpec>;
    style?: import("./interface").NoVisibleMarkStyle<import("../..").ITextMarkSpec>;
    shape?: {
        visible?: boolean;
        space?: number;
        style?: import("./interface").NoVisibleMarkStyle<import("../..").ISymbolMarkSpec>;
    } & {
        visible?: boolean;
        space?: number;
        style?: Omit<Partial<import("@visactor/vrender-core").ISymbolGraphicAttribute>, "visible">;
    };
    background?: {
        visible?: boolean;
        style?: Omit<import("./interface").NoVisibleMarkStyle<import("../..").IRectMarkSpec>, "visible" | "width" | "height">;
    };
    text?: string | number | string[] | number[];
    visible?: boolean;
    padding?: import("@visactor/vrender-components/es/core/type").Padding;
    maxWidth?: number;
    minWidth?: number;
    space?: number;
    align?: "center" | "start" | "end";
};
export declare function getLayout(spec: ILegendCommonSpec): "horizontal" | "vertical";
