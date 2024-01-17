import { getDataset, parseCSVData } from '../../common/dataProcess';
import { readTopNLine } from '../../common/dataProcess/utils';
import { ILLMOptions } from '../../typings';
import { parseGPTResponse, requestGPT } from '../utils';
import { DataProcessPromptEnglish } from './prompts';

/*
 ** call GPT to parse csv data
 **get the fieldInfo from csv file
 */
export const parseCSVDataWithGPT = async (csvFile: string, userInput: string, options: ILLMOptions | undefined) => {
  const DATA_TOP_N = 5; //取csv文件的前多少条数据
  const topNCSVFile = readTopNLine(csvFile, DATA_TOP_N);
  const dataProcessMessage = `CSV file content:\n${topNCSVFile}\nUser Input: ${userInput}`;

  const requestFunc = options.customRequestFunc ?? requestGPT;

  const dataProcessRes = await requestFunc(DataProcessPromptEnglish, dataProcessMessage, options);

  const dataProcessResJson = parseGPTResponse(dataProcessRes);
  const { dataset } = getDataset(csvFile);

  if (!dataProcessResJson.error) {
    return {
      fieldInfo: dataProcessResJson['FIELD_INFO'],
      videoDuration: dataProcessResJson['VIDEO_DURATION'],
      colorPalette: dataProcessResJson['COLOR_PALETTE'],
      usefulFields: dataProcessResJson['USEFUL_FIELDS'],
      dataset,
      error: dataProcessResJson['error'],
      thought: dataProcessResJson['thought']
    };
  } else {
    //传统方法做兜底
    const { fieldInfo } = parseCSVData(csvFile);
    console.error('gpt parse data error!');
    return { fieldInfo, dataset };
  }
};

export { queryDataset } from './queryDataset';
