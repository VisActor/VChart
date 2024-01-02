import axios from 'axios';
import { Cell, DataItem, ILLMOptions, SimpleFieldInfo } from '../../typings';
import { detectAxesType } from '../../common/vizDataToSpec/utils';
import { isArray, omit } from 'lodash';

export const patchChartTypeAndCell = (
  chartTypeRes: any,
  cellRes: any,
  dataset: DataItem[],
  fieldInfo: SimpleFieldInfo[]
) => {
  let chartTypeNew = chartTypeRes;
  let cellNew = cellRes;
  const columns = fieldInfo.map(field => field.fieldName);

  //set null field to undefined
  Object.keys(cellNew).forEach(key => {
    const value = cellNew[key];
    if (isArray(value)) {
      cellNew[key] = value.map(v => (columns.includes(v) ? v : undefined)).filter(Boolean);
    } else if (!columns.includes(value) || value === '') {
      cellNew[key] = undefined;
    }
  });

  if (chartTypeRes === 'RADAR CHART') {
    cellNew = {
      x: cellRes.angle,
      y: cellRes.value,
      color: cellRes.color
    };
  } else if (chartTypeRes === 'BOX PLOT') {
    const { x, min, q1, median, q3, max } = cellRes;
    cellNew = {
      x,
      y: [min, q1, median, q3, max].filter(Boolean)
    };
  } else if (chartTypeRes === 'BAR CHART') {
    if (isArray(cellRes.y) && cellRes.y.length === 2) {
      chartTypeNew = 'DUAL AXIS CHART';
    } else if ((cellRes.y ?? '').includes(',')) {
      const yNew = cellRes.y.split(',');
      if (yNew.length === 2) {
        chartTypeNew = 'DUAL AXIS CHART';
        cellNew = {
          ...cellRes,
          y: yNew
        };
      }
    }
  } else if (chartTypeRes === 'DYNAMIC BAR CHART') {
    const cellNew = { ...cellRes };

    if (!cellRes.time || cellRes.time === '' || cellRes.time.length === 0) {
      const flattenedXField = Array.isArray(cellRes.x) ? cellRes.x : [cellRes.x];
      const usedFields = Object.values(cellNew).filter(f => !Array.isArray(f));
      usedFields.push(...flattenedXField);
      const dataFields = Object.keys(dataset[0]);
      const remainedFields = dataFields.filter(f => !usedFields.includes(f));

      //动态条形图没有time字段，选择一个离散字段作为time
      const timeField = remainedFields.find(f => {
        const fieldType = detectAxesType(dataset, f);
        return fieldType === 'band';
      });
      if (timeField) {
        cellNew.time = timeField;
      } else {
        cellNew.time = remainedFields[0];
      }
    }
    return {
      chartTypeNew: chartTypeRes,
      cellNew
    };
  }
  return {
    chartTypeNew,
    cellNew
  };
};

/**
 *
 * @param prompt
 * @param message
 * @param options
 */
export const requestSkyLark = async (prompt: string, message: string, options: ILLMOptions) => {
  const url: string = options?.url;
  const headers: any = { ...(options.headers ?? {}), 'Content-Type': 'application/json' };

  try {
    const res = await axios(url, {
      method: options?.method ?? 'POST',
      headers, //must has Authorization: `Bearer ${openAIKey}` if use openai api
      data: {
        ...omit(options, ['headers', 'url', 'method']),
        model: options?.model ?? 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: options?.max_tokens ?? 500,
        temperature: options?.temperature ?? 0
      }
    }).then(response => response.data);

    return res;
  } catch (err: any) {
    return err.response.data;
  }
};

export const getStrFromDict = (dict: Record<string, string>) =>
  Object.keys(dict)
    .map(key => `${key}: ${dict[key]}`)
    .join('\n');

const KNOWLEDGE_START_INDEX = 1;
export const getStrFromArray = (array: string[]) =>
  array.map((item, index) => `${index + KNOWLEDGE_START_INDEX}. ${item}`).join('\n');
