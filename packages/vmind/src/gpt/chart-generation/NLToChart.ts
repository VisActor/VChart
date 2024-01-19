import { SUPPORTED_CHART_LIST } from '../../common/vizDataToSpec/constants';
import { DataItem, GPTChartAdvisorResult, ILLMOptions, LOCATION, SimpleFieldInfo, VizSchema } from '../../typings';
import { checkChartTypeAndCell, vizDataToSpec } from '../../common/vizDataToSpec';
import { parseGPTResponse, requestGPT } from '../utils';
import { patchChartTypeAndCell, patchUserInput } from './utils';
import { ChartAdvisorPromptEnglish } from './prompts';
import { chartAdvisorHandler } from '../../common/chartAdvisor';
import { estimateVideoTime } from '../../common/vizDataToSpec/utils';
import { getSchemaFromFieldInfo } from '../../common/schema';

export const generateChartWithGPT = async (
  userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
  fieldInfo: SimpleFieldInfo[],
  propsDataset: DataItem[],
  options: ILLMOptions,
  colorPalette?: string[],
  animationDuration?: number
) => {
  const userInputFinal = patchUserInput(userPrompt);
  const schema = getSchemaFromFieldInfo(fieldInfo);
  const colors = colorPalette;
  let chartType;
  let cell;
  let dataset: DataItem[] = propsDataset;
  let chartSource: string = options.model;
  try {
    // throw 'test chartAdvisorHandler';
    const resJson: any = await chartAdvisorGPT(schema, userInputFinal, options);

    const chartTypeRes = resJson['CHART_TYPE'].toUpperCase();
    const cellRes = resJson['FIELD_MAP'];
    const patchResult = patchChartTypeAndCell(chartTypeRes, cellRes, dataset);
    if (checkChartTypeAndCell(patchResult.chartTypeNew, patchResult.cellNew, fieldInfo)) {
      chartType = patchResult.chartTypeNew;
      cell = patchResult.cellNew;
    }
  } catch (err) {
    console.warn(err);
    console.warn('LLM generation error, use rule generation.');
    // call rule-based method to get recommended chart type and fieldMap(cell)
    const advisorResult = chartAdvisorHandler(schema, dataset);
    chartType = advisorResult.chartType;
    cell = advisorResult.cell;
    dataset = advisorResult.dataset as DataItem[];
    chartSource = 'chartAdvisor';
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
    chartSource,
    spec,
    time: estimateVideoTime(chartType, spec, animationDuration ? animationDuration * 1000 : undefined)
  };
};

/**
 * call GPT to get recommended chart type and fieldMap
 * @param schema VizSchema
 * @param userInput user input about their intention
 * @param options vmind options
 * @returns
 */
export const chartAdvisorGPT = async (
  schema: Partial<VizSchema>,
  userInput: string,
  options: ILLMOptions | undefined
) => {
  //call GPT
  const filteredFields = schema.fields.filter(
    field => true
    //usefulFields.includes(field.fieldName)
  );
  const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(schema.fields)}`;
  //console.log(chartAdvisorMessage);

  const requestFunc = options.customRequestFunc?.chartAdvisor ?? requestGPT;

  const advisorRes = await requestFunc(ChartAdvisorPromptEnglish, chartAdvisorMessage, options);

  const advisorResJson: GPTChartAdvisorResult = parseGPTResponse(advisorRes) as unknown as GPTChartAdvisorResult;

  //console.log(advisorResJson);
  if (advisorResJson.error) {
    throw Error('Network Error!');
  }
  if (!SUPPORTED_CHART_LIST.includes(advisorResJson['CHART_TYPE'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }
  return advisorResJson;
};
