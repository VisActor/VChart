import type { SankeyOptions, SankeyData } from '@visactor/vlayouts';
export interface ISankeyOpt extends SankeyOptions {
    targetField: string;
    sourceField: string;
    valueField: string;
    view: () => {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
    };
}
export declare const collectHierarchyField: (set: Set<any>, data: any[], field: string) => void;
export declare const sankeyFormat: (data: any[]) => SankeyData[];
export declare const sankeyLayout: (data: SankeyData[], op: ISankeyOpt) => {
    nodes: import("@visactor/vlayouts").SankeyNodeElement[];
    links: import("@visactor/vlayouts").SankeyLinkElement[];
    columns: import("@visactor/vlayouts").SankeyNodeElement[][];
}[];
