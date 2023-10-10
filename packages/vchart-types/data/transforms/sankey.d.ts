import type { SankeyOptions, SankeyData } from '@visactor/vgrammar-sankey';
export interface ISankeyOpt extends SankeyOptions {
  targetField: string;
  sourceField: string;
  view: () => {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
  };
}
export declare const sankey: (
  data: SankeyData,
  op: ISankeyOpt
) =>
  | {
      nodes?: import('@visactor/vgrammar-sankey').SankeyNodeDatum[];
      links: import('@visactor/vgrammar-sankey').SankeyLinkDatum[];
    }
  | {
      nodes: import('@visactor/vgrammar-sankey').HierarchyNodeDatum[];
    }
  | {
      nodes: import('@visactor/vgrammar-sankey').SankeyNodeElement[];
      links: import('@visactor/vgrammar-sankey').SankeyLinkElement[];
      columns: import('@visactor/vgrammar-sankey').SankeyNodeElement[][];
    }[];
