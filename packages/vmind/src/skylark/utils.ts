import yaml from 'js-yaml';
import { ChartRecommendResult } from './typings';

export const parseSkylarkResponse = (larkResponse: any): ChartRecommendResult => {
  try {
    const resJson = yaml.load(larkResponse[0].message.content) as ChartRecommendResult;
    return {
      chartType: resJson.chartType
    };
  } catch (err) {
    return { error: true, chartType: undefined };
  }
};
