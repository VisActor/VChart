import type { TreemapNodeElement, TreemapOptions } from '@visactor/vgrammar-hierarchy';
export declare const treemapLayout: (data: Array<any>, op: TreemapOptions & {
    getViewBox: () => {
        x0: number;
        x1: number;
        y0: number;
        y1: number;
    };
    nameField: string;
}) => TreemapNodeElement[];
