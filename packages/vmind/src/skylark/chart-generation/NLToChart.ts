import axios from 'axios';
import { chartAdvisorHandler } from '../../common/chartAdvisor';
import { getSchemaFromFieldInfo } from '../../common/schema';
import { SUPPORTED_CHART_LIST, checkChartTypeAndCell, vizDataToSpec } from '../../common/vizDataToSpec';
import { DataItem, ILLMOptions, SimpleFieldInfo, VizSchema } from '../../typings';
import { getStrFromArray, getStrFromDict, patchChartTypeAndCell, requestSkyLark } from './utils';
import { ChartRecommendPrompt, getFieldMapPrompt } from './prompts';
import { parseSkylarkResponse } from '../utils';
import { estimateVideoTime } from '../../common/vizDataToSpec/utils';
import { ChartFieldInfo } from './constants';
import { omit } from 'lodash';

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
    const cellRes = resJson['cell'];
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
  const userMessage = `User's Command: ${userInput}\nData field description: ${JSON.stringify(schema.fields)}`;

  //call skylark to get recommended chart
  const chartRecommendRes = await requestSkyLark(ChartRecommendPrompt, userMessage, options);
  const chartRecommendResJSON = parseSkylarkResponse(chartRecommendRes);
  console.log(chartRecommendResJSON);
  if (chartRecommendResJSON.error) {
    throw Error('Network Error!');
  }
  if (!SUPPORTED_CHART_LIST.includes(chartRecommendResJSON['chartType'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }

  const { chartType } = chartRecommendResJSON;

  //call skylark to get field map result.
  const { visualChannels, responseDescription, knowledge } = ChartFieldInfo[chartType.toUpperCase()];
  const visualChannelInfoStr = getStrFromDict(visualChannels);
  const channelResponseStr = getStrFromDict(responseDescription);
  const knowledgeStr = getStrFromArray(knowledge);
  const fieldMapPrompt = getFieldMapPrompt(chartType, visualChannelInfoStr, channelResponseStr, knowledgeStr);

  const fieldMapRes = await requestSkyLark(fieldMapPrompt, userMessage, options);
  const fieldMapResJson = parseSkylarkResponse(fieldMapRes);
  console.log(fieldMapResJson);
  if (fieldMapResJson.error) {
    throw Error('Network Error!');
  }

  return {
    chartType,
    cell: omit(fieldMapResJson, ['thoughts'])
  };
};

export const getFieldMapSkylark = async (chartType: string, userInput: string) => {};

const getChartChannel = (chartType: string) => {};
