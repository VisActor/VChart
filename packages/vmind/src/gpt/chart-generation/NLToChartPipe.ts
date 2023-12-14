import {
  ChartAdvisorPrompt,
  ChartAdvisorPromptEnglish,
  DataProcessPrompt,
  DataProcessPromptEnglish,
  NLToChartPrompt,
  DEFAULT_VIDEO_LENGTH,
  CHARTTYP_VIDEO_ELENGTH,
  SUPPORTED_CHART_LIST
} from './constants';
import {
  GPTChartAdvisorResult,
  GPTDataProcessResult,
  IGPTOptions,
  LOCATION,
  NLToChartResult,
  SimpleFieldInfo,
  VizSchema
} from '../../typings';
import { DataSet, DataView, csvParser, fold } from '@visactor/vdataset';
import { vizDataToSpec } from './vizDataToSpec';
import { parseGPTResponse, requestGPT } from '../utils';
// import {
//   getMockData1,
//   getMockData2,
//   getMockData3,
//   getMockData4,
//   getMockData5,
//   getMockData6,
//   getMockDataDynamicBar,
//   getMockDataDynamicBar2,
//   getMockDataScatter1,
//   getMockDataScatter2,
//   getMockDataWordCloud1,
//   getMockDataWordCloud2
// } from '../site/constants/mockData';

// import {
//   mockGPTResponseBarChart,
//   mockGPTResponseLineChart,
//   mockGPTResponsePieChart
// } from '../site/constants/mockResponse';

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

export const chartAdvisorGPT = async (
  schema: Partial<VizSchema>,
  fieldInfo: SimpleFieldInfo[],
  userInput: string,
  openAIKey: string | undefined,
  options: IGPTOptions | undefined
) => {
  const filteredFields = fieldInfo.filter(
    field => true
    //usefulFields.includes(field.fieldName)
  );
  const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(schema.fields)}`;
  console.log(chartAdvisorMessage);

  const advisorRes = await requestGPT(openAIKey, ChartAdvisorPromptEnglish, chartAdvisorMessage, options);

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
