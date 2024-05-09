import type { SankeyOptions, SankeyData } from '@visactor/vgrammar-sankey';
import { SankeyLayout } from '@visactor/vgrammar-sankey';
import { isArray, isNil, isString } from '@visactor/vutils';

export interface ISankeyOpt extends SankeyOptions {
  targetField: string;
  sourceField: string;
  valueField: string;
  view: () => { x0: number; x1: number; y0: number; y1: number };
}

export const collectHierarchyField = (set: Set<any>, data: any[], field: string) => {
  data.forEach((obj: any) => {
    if (!isNil(obj[field])) {
      set.add(obj[field]);
    }

    if (obj.children && obj.children.length > 0) {
      collectHierarchyField(set, obj.children, field); // 递归处理子节点
    }
  });
};

export const sankeyFormat = (data: any[]): SankeyData[] => {
  if (!data || !isArray(data)) {
    return [] as SankeyData[];
  }

  if (data.length > 1) {
    /**
     * data structure for Fengshen:
     * [{id:’nodes’, values:[xxx]},{id:’links’, values:[xxx]}]
     */
    const updateData: SankeyData = {
      links: [],
      nodes: []
    };
    data.forEach((datum: any) => {
      if (datum.id === 'links' || datum.id === 'nodes') {
        updateData[datum.id] = datum.values;
      }
    });
    return [updateData];
  }
  /**
   * data structure:
   * [{nodes: [xxx], links: [xxx]}]
   */
  if (data[0]?.latestData) {
    return data[0].latestData;
  }
  return data;
};

export const sankeyLayout = (data: SankeyData[], op: ISankeyOpt) => {
  if (!data || !op?.view || !data.length) {
    return [];
  }

  const view = op.view();

  if (
    view.x1 - view.x0 === 0 ||
    view.y1 - view.y0 === 0 ||
    view.x1 - view.x0 === -Infinity ||
    view.x1 - view.x0 === Infinity ||
    view.y1 - view.y0 === -Infinity ||
    view.y1 - view.y0 === Infinity
  ) {
    return [];
  }

  const originalData = data[0];

  if (op.sourceField !== 'source' || op.targetField !== 'target' || op.valueField !== 'value') {
    if ((originalData as any).links) {
      const updatedData: {}[] = [];

      (originalData as any).links.forEach((datum: any) => {
        const updatedDatum: any = {};
        for (const key in datum) {
          if (key === op.sourceField) {
            updatedDatum.source = datum[op.sourceField];
          } else if (key === op.targetField) {
            updatedDatum.target = datum[op.targetField];
          } else if (key === op.valueField) {
            updatedDatum.value = datum[op.valueField];
          } else {
            updatedDatum[key] = datum[key];
          }
        }
        updatedData.push(updatedDatum);
      });
      (originalData as any).links = updatedData;
    }
  }

  const layout = new SankeyLayout(op);

  const result = [];

  result.push(layout.layout(originalData, view));

  return result;
};
