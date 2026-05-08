import type { SankeyOptions, SankeyData } from '@visactor/vgrammar-sankey';
import { SankeyLayout } from '@visactor/vgrammar-sankey';
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
    customLayout?: (layout: SankeyLayout, originalData: SankeyData, view: ReturnType<ISankeyOpt['view']>, option: ISankeyOpt) => ReturnType<SankeyLayout['layout']>;
}
export declare const collectHierarchyField: (set: Set<any>, data: any[], field: string) => void;
export declare const sankeyFormat: (data: any[]) => SankeyData[];
export declare const sankeyLayout: (data: SankeyData[], op: ISankeyOpt) => {
    nodes: import("@visactor/vgrammar-sankey").SankeyNodeElement[];
    links: import("@visactor/vgrammar-sankey").SankeyLinkElement[];
    columns: import("@visactor/vgrammar-sankey").SankeyNodeElement[][];
}[];
