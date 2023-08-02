import type { SankeyOptions, SankeyData } from '@visactor/vgrammar-sankey';
import { SankeyLayout } from '@visactor/vgrammar-sankey';
import { isArray } from '@visactor/vutils';

export interface ISankeyOpt extends SankeyOptions {
  view: () => { x0: number; x1: number; y0: number; y1: number };
}

export const sankey = (data: SankeyData, op: ISankeyOpt) => {
  if (!data || !op?.view || !isArray(data)) {
    return data;
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
    return data;
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
    data = updateData;
  } else {
    /**
     * data structure:
     * [{nodes: [xxx], links: [xxx]}]
     */
    if (data[0]?.latestData) {
      data = data[0].latestData[0];
    } else {
      data = data[0];
    }
  }

  const layout = new SankeyLayout(op);

  const result = [];

  result.push(layout.layout(data, view));

  return result;
};
