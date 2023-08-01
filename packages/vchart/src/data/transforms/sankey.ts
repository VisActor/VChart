import type { SankeyOptions, SankeyData } from '@visactor/vgrammar-sankey';
import { SankeyLayout } from '@visactor/vgrammar-sankey';
import { isArray } from '@visactor/vutils';

export interface ISankeyOpt extends SankeyOptions {
  targetField: string;
  sourceField: string;
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

  if (data[0]?.latestData) {
    data = data[0].latestData[0];
  } else {
    data = data[0];
  }

  if (op.sourceField !== 'source' || op.targetField !== 'target') {
    for (const key in data) {
      if (key === 'links') {
        const updatedData: {}[] = [];
        data[key].forEach((datum: any) => {
          const updatedDatum = {};
          for (const key in datum) {
            if (key === op.sourceField) {
              updatedDatum.source = datum[op.sourceField];
            } else if (key === op.targetField) {
              updatedDatum.target = datum[op.targetField];
            } else {
              updatedDatum[key] = datum[key];
            }
          }
          updatedData.push(updatedDatum);
        });
        data[key] = updatedData;
      }
    }
  }

  const layout = new SankeyLayout(op);

  const result = [];

  result.push(layout.layout(data, view));

  return result;
};
