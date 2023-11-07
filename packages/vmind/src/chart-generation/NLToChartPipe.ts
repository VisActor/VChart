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
import { GPTChartAdvisorResult, GPTDataProcessResult, IGPTOptions, NLToChartResult } from '../typings';
import { parseGPTJson, parseGPTResponse, patchUserInput, readTopNLine, requestGPT } from './utils';
import { DataSet, DataView, csvParser, fold } from '@visactor/vdataset';
import { vizDataToSpec } from './vizDataToSpec';
import {
  getMockData1,
  getMockData2,
  getMockData3,
  getMockData4,
  getMockData5,
  getMockData6,
  getMockDataDynamicBar,
  getMockDataDynamicBar2,
  getMockDataScatter1,
  getMockDataScatter2,
  getMockDataWordCloud1,
  getMockDataWordCloud2
} from '../site/constants/mockData';

import {
  mockGPTResponseBarChart,
  mockGPTResponseLineChart,
  mockGPTResponsePieChart
} from '../site/constants/mockResponse';

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

export const dataProcessVChart = (csvFile: string) => {
  //ChartSpace处理用户上传的csv数据
  const dataSet = new DataSet();
  dataSet.registerParser('csv', csvParser);
  dataSet.registerTransform('fold', fold);
  const dataView = new DataView(dataSet, { name: 'data' });
  dataView.parse(csvFile, {
    type: 'csv'
  });
  return dataView;
};

/*
 ** GPT数据预处理，进行字段信息总结和字段筛选
 */
export const dataProcessGPT = async (
  csvFile: string,
  userInput: string,
  openAIKey: string | undefined,
  options: IGPTOptions | undefined
) => {
  const DATA_TOP_N = 5; //取csv文件的前多少条数据
  const topNCSVFile = readTopNLine(csvFile, DATA_TOP_N);
  const dataProcessMessage = `CSV file content:\n${topNCSVFile}\nUser Input: ${userInput}`;
  const dataProcessRes = await requestGPT(openAIKey as string, DataProcessPromptEnglish, dataProcessMessage, options);
  // const dataProcessRes = getMockData1()
  // const dataProcessRes = getMockDataWordCloud1()
  // const dataProcessRes = getMockDataDynamicBar();

  const dataProcessResJson = parseGPTResponse(dataProcessRes);
  if (!dataProcessResJson.error) {
    return dataProcessResJson;
  } else {
    //传统方法做兜底
    return dataProcessResJson;
  }
};

export const chartAdvisorGPT = async (
  dataProcessResJson: GPTDataProcessResult,
  userInput: string,
  openAIKey: string | undefined,
  options: IGPTOptions | undefined
) => {
  if (!dataProcessResJson.error) {
    //GPT进行图表推荐、配色和字段映射
    const fieldInfo = dataProcessResJson.FIELD_INFO;
    const usefulFields = dataProcessResJson.USEFUL_FIELDS;
    const colorPalette = dataProcessResJson.COLOR_PALETTE;
    const videoDuration = dataProcessResJson.VIDEO_DURATION;
    const filteredFields = fieldInfo.filter(
      field => true
      //usefulFields.includes(field.fieldName)
    );
    const chartAdvisorMessage = `User Input: ${userInput}\nData field description: ${JSON.stringify(filteredFields)}`;
    const advisorRes = await requestGPT(openAIKey, ChartAdvisorPromptEnglish, chartAdvisorMessage, options);
    // const advisorRes = getMockDataWordCloud2()
    //const advisorRes = getMockDataDynamicBar2();

    const advisorResJson: GPTChartAdvisorResult = parseGPTResponse(advisorRes) as unknown as GPTChartAdvisorResult;
    if (colorPalette) {
      advisorResJson.COLOR_PALETTE = colorPalette;
    }
    if (videoDuration) {
      advisorResJson.VIDEO_DURATION = videoDuration;
    }
    if (!advisorResJson.error) {
      return advisorResJson;
    } else {
      //传统方法做兜底
      return advisorResJson;
    }
  }
  return {};
};
