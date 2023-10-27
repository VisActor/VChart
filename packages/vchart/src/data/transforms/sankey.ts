import type { SankeyOptions, SankeyData } from '@visactor/vgrammar-sankey';
import { SankeyLayout } from '@visactor/vgrammar-sankey';
import { isArray, isString } from '@visactor/vutils';

export interface ISankeyOpt extends SankeyOptions {
  targetField: string;
  sourceField: string;
  valueField: string;
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

  if (op.sourceField !== 'source' || op.targetField !== 'target' || op.valueField !== 'value') {
    for (const key in data) {
      if (key === 'links') {
        const updatedData: {}[] = [];
        data[key].forEach((datum: any) => {
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
        data[key] = updatedData;
      }
    }
  }

  const convertValuesToNumbers = (data: any) => {
    data.forEach((obj: any) => {
      obj.value = isString(obj.value) ? +obj.value : obj.value; // 将字符串转换为数值类型
      if (obj.children && obj.children.length > 0) {
        convertValuesToNumbers(obj.children); // 递归处理子节点
      }
    });
  };

  //Convert value from string to number
  for (const key in data) {
    //node-link型数据
    if (key === 'links') {
      const updatedData: {}[] = [];
      data[key].forEach((datum: any) => {
        const updatedDatum: any = {};
        for (const key in datum) {
          if (key === 'value') {
            updatedDatum.value = isString(datum.value) ? +datum.value : datum.value; // 将字符串转换为数值类型
          } else {
            updatedDatum[key] = datum[key];
          }
        }
        updatedData.push(updatedDatum);
      });
      data[key] = updatedData;
      //层级型数据
    } else if (key === 'nodes') {
      if ((data.nodes?.[0] as any)?.children) {
        convertValuesToNumbers(data.nodes);
      }
    }
  }

  const layout = new SankeyLayout(op);

  const result = [];

  result.push(layout.layout(data, view));

  return result;
};
