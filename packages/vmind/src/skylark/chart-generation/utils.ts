import axios from 'axios';
import { Cell, DataItem, ILLMOptions } from '../../typings';

export const patchChartTypeAndCell = (chartTypeRes: any, cellRes: Cell, dataset: DataItem[]) => {
  const chartTypeNew = chartTypeRes;
  let cellNew = cellRes;
  if (chartTypeRes === 'RADAR CHART') {
    cellNew = {
      x: cellRes.angle,
      y: cellRes.value,
      color: cellRes.color
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
  const headers = { ...(options.headers ?? {}), 'Content-Type': 'application/json' };

  const res = await axios(url, {
    method: options?.method ?? 'POST',
    headers, //must has Authorization: `Bearer ${openAIKey}` if use openai api
    data: {
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
      max_tokens: options?.max_tokens ?? 4096,
      temperature: options?.temperature ?? 0
    }
  })
    .then(response => response.data)
    .then(data => data.choices);

  return res;
};

export const getStrFromDict = (dict: Record<string, string>) =>
  Object.keys(dict)
    .map(key => `${key}: ${dict[key]}`)
    .join('\n');

const KNOWLEDGE_START_INDEX = 1;
export const getStrFromArray = (array: string[]) =>
  array.map((item, index) => `${index + KNOWLEDGE_START_INDEX}. ${item}`).join('\n');
