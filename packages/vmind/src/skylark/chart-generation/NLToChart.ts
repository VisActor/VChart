import axios from 'axios';
import { chartAdvisorHandler } from '../../common/chartAdvisor';
import { getSchemaFromFieldInfo } from '../../common/schema';
import { SUPPORTED_CHART_LIST, checkChartTypeAndCell, vizDataToSpec } from '../../common/vizDataToSpec';
import { DataItem, ILLMOptions, SimpleFieldInfo, VizSchema } from '../../typings';
import { patchChartTypeAndCell, requestSkyLark } from './utils';
import { ChartRecommendPrompt } from './prompts';
import { parseSkylarkResponse } from '../utils';
import { ChartRecommendResult } from '../typings';
import { estimateVideoTime } from '../../common/vizDataToSpec/utils';

export const generateChartWithSkylark = async (
  userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
  fieldInfo: SimpleFieldInfo[],
  propsDataset: DataItem[],
  options: ILLMOptions,
  colorPalette?: string[],
  animationDuration?: number
) => {
  const schema = getSchemaFromFieldInfo(fieldInfo);
  const colors = colorPalette;
  let chartType;
  let cell;
  let dataset: DataItem[] = propsDataset;
  try {
    // throw 'test chartAdvisorHandler';
    const resJson: any = await chartAdvisorSkylark(schema, fieldInfo, userPrompt, options);

    const chartTypeRes = resJson.chartType.toUpperCase();
    //TODO: request skylark for cell according to chartType
    const patchResult = patchChartTypeAndCell(chartTypeRes, cellRes, dataset);
    if (checkChartTypeAndCell(patchResult.chartTypeNew, patchResult.cellNew)) {
      chartType = patchResult.chartTypeNew;
      cell = patchResult.cellNew;
    }
  } catch (err) {
    console.warn(err);
    console.warn('LLM generation error, use rule generation.');
    const advisorResult = chartAdvisorHandler(schema, dataset);
    chartType = advisorResult.chartType;
    cell = advisorResult.cell;
    dataset = advisorResult.dataset as DataItem[];
  }
  const spec = vizDataToSpec(
    dataset,
    chartType,
    cell,
    colors,
    animationDuration ? animationDuration * 1000 : undefined
  );
  spec.background = '#00000033';
  console.info(spec);
  return {
    spec,
    time: estimateVideoTime(chartType, spec, animationDuration ? animationDuration * 1000 : undefined)
  };
};

export const chartAdvisorSkylark = async (
  schema: Partial<VizSchema>,
  fieldInfo: SimpleFieldInfo[],
  userInput: string,
  options: ILLMOptions | undefined
) => {
  const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(schema.fields)}`;
  console.log(chartAdvisorMessage);

  const recommendRes = await requestSkyLark(ChartRecommendPrompt, chartAdvisorMessage, options);

  const recommendResJson: ChartRecommendResult = parseSkylarkResponse(recommendRes);

  console.log(recommendResJson);
  if (recommendResJson.error) {
    throw Error('Network Error!');
  }
  if (!SUPPORTED_CHART_LIST.includes(recommendResJson['chartType'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }
  return recommendResJson;
};
