import type { ITitle } from './interface';
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
    visible?: boolean;
    text?: string | number | string[] | number[] | {
        type?: "text";
        text: string | number | string[] | number[];
    } | {
        type: "rich";
        text: import("@visactor/vrender-core").IRichTextCharacter[];
    } | {
        type: "html";
        text: {
            dom: string | HTMLElement;
        } & import("@visactor/vrender-core").SimpleDomStyleOptions & import("@visactor/vrender-core").CommonDomOptions;
    } | {
        type: "react";
        text: {
            element: any;
        } & import("@visactor/vrender-core").SimpleDomStyleOptions & import("@visactor/vrender-core").CommonDomOptions;
    };
    maxWidth?: number;
    minWidth?: number;
    padding?: import("@visactor/vrender-components").Padding;
    align?: "center" | "start" | "end";
    space?: number;
};
