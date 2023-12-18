import {
  DEFAULT_VIDEO_LENGTH,
  CHARTTYP_VIDEO_ELENGTH,
  SUPPORTED_CHART_LIST
} from '../../common/vizDataToSpec/constants';
import { DataItem, GPTChartAdvisorResult, IGPTOptions, LOCATION, SimpleFieldInfo, VizSchema } from '../../typings';
import { checkChartTypeAndCell, patchChartTypeAndCell, vizDataToSpec } from '../../common/vizDataToSpec/vizDataToSpec';
import { parseGPTResponse, requestGPT } from '../utils';
import { patchUserInput } from './utils';
import { chartAdvisorHandler } from '../../common/chartAdvisor/chartAdvisorHandler';
import { ChartAdvisorPromptEnglish } from './prompts';

export const estimateVideoTime = (chartType: string, spec: any, parsedTime?: number) => {
  //估算视频长度
  if (chartType === 'DYNAMIC BAR CHART') {
    const frameNumber = spec.player.specs.length;
    const duration = spec.player.interval;
    return {
      totalTime: parsedTime ?? frameNumber * duration,
      frameArr: parsedTime
        ? Array.from(new Array(frameNumber).keys()).map(n => Number(parsedTime / frameNumber))
        : Array.from(new Array(frameNumber).keys()).map(n => duration)
    };
  }

  // chartType不是真实的图表类型，转一次
  const map: Record<string, string> = {
    'PIE CHART': 'pie',
    'WORD CLOUD': 'wordCloud'
  };
  return {
    totalTime: parsedTime ?? CHARTTYP_VIDEO_ELENGTH[map[chartType]] ?? DEFAULT_VIDEO_LENGTH,
    frameArr: []
  };
};

export const generateChartWithGPT = async (
  userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
  fieldInfo: SimpleFieldInfo[],
  propsDataset: DataItem[],
  options: IGPTOptions,
  colorPalette?: string[],
  animationDuration?: number
) => {
  const userInputFinal = patchUserInput(userPrompt);
  const schema = getSchemaFromFieldInfo(fieldInfo);
  const colors = colorPalette;
  let chartType;
  let cell;
  let dataset: DataItem[] = propsDataset;
  try {
    // throw 'test chartAdvisorHandler';
    const resJson: any = await chartAdvisorGPT(schema, fieldInfo, userInputFinal, options);

    const chartTypeRes = resJson['CHART_TYPE'].toUpperCase();
    const cellRes = resJson['FIELD_MAP'];
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

export const chartAdvisorGPT = async (
  schema: Partial<VizSchema>,
  fieldInfo: SimpleFieldInfo[],
  userInput: string,
  options: IGPTOptions | undefined
) => {
  const filteredFields = fieldInfo.filter(
    field => true
    //usefulFields.includes(field.fieldName)
  );
  const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(schema.fields)}`;
  console.log(chartAdvisorMessage);

  const advisorRes = await requestGPT(ChartAdvisorPromptEnglish, chartAdvisorMessage, options);

  const advisorResJson: GPTChartAdvisorResult = parseGPTResponse(advisorRes) as unknown as GPTChartAdvisorResult;

  console.log(advisorResJson);
  if (advisorResJson.error) {
    throw Error('Network Error!');
  }
  if (!SUPPORTED_CHART_LIST.includes(advisorResJson['CHART_TYPE'])) {
    throw Error('Unsupported Chart Type. Please Change User Input');
  }
  return advisorResJson;
};

export const getSchemaFromFieldInfo = (fieldInfo: SimpleFieldInfo[]): Partial<VizSchema> => {
  const schema = {
    fields: fieldInfo
      //.filter(d => usefulFields.includes(d.fieldName))
      .map(d => ({
        id: d.fieldName,
        alias: d.fieldName,
        description: d.description,
        visible: true,
        type: d.type,
        role: d.role,
        location: d.role as unknown as LOCATION
      }))
  };
  return schema;
};
