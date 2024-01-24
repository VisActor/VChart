import { error, log } from 'console';
import VMind from '../../src/index';

import { Model } from '../../src/typings';
import {
  mockUserInput10,
  mockUserInput2,
  mockUserInput3,
  mockUserInput3Eng,
  mockUserInput6,
  mockUserInput6Eng,
  mockUserInput8,
  carSaleMockData,
  mockUserInput15,
  acceptRatioData,
  mallSalesData,
  hotWordsData,
  mockUserInput4,
  mockUserInput5,
  mockUserInput9,
  mockUserInput11,
  mockUserInput12,
  mockUserInput13,
  mockUserInput14,
  mockUserInput16
} from '../browser/src/constants/mockData';
const demoDataList: { [key: string]: any } = {
  pie: mockUserInput2,
  'dynamic bar zh_cn': mockUserInput6,
  line: mockUserInput8,
  column: mockUserInput3,
  column2: mockUserInput10,
  wordcloud: hotWordsData,
  wordcloud2: mockUserInput5,
  'scatter plot': mockUserInput4,
  funnel: mockUserInput9,
  'dual-axis': mockUserInput11,
  waterfall: mockUserInput12,
  rose: mockUserInput13,
  radar: mockUserInput14,
  sankey: mockUserInput15,
  'box-plot': mockUserInput16,
  'Electric vehicle sales': carSaleMockData,
  'College entrance examination': acceptRatioData,
  'Shopping Mall Sales Performance': mallSalesData,
  'Global GDP': mockUserInput6Eng,
  'Sales of different drinkings': mockUserInput3Eng
};
const CHART_GENERATION_AVERAGE_TIME = 10000;
const QPM_LIMIT = 10; //qpm limit of your llm service
const TOKEN_LIMIT = 20000; //token limit of your llm service
const START_INDEX = 0;

const modelResultMap = {
  [Model.GPT3_5]: { totalCount: 0, successCount: 0, totalTime: 0 },
  [Model.SKYLARK]: { totalCount: 0, successCount: 0, totalTime: 0 },
  [Model.SKYLARK2]: { totalCount: 0, successCount: 0, totalTime: 0 }
};

const testPerformance = (model: Model, vmind: any) => {
  dataList.some((dataName, index) => {
    if (index >= START_INDEX) {
      it(dataName, async done => {
        log(dataName + '......');
        const { csv, input } = demoDataList[dataName];
        const { fieldInfo, dataset } = vmind.parseCSVData(csv);
        //const { fieldInfo, dataset } = await vmind.parseCSVDataWithLLM(csv, describe);
        const startTime = new Date().getTime();
        const { spec, time, chartSource } = await vmind.generateChart(input, fieldInfo, dataset);
        const endTime = new Date().getTime();
        log('generated chart type: ' + spec.type);
        if (chartSource !== 'chartAdvisor') {
          const costTime = endTime - startTime;
          log('time cost: ' + costTime / 1000 + 's');
          modelResultMap[model].totalTime += costTime;
          modelResultMap[model].successCount += 1;
        } else {
          error('fail to generate with LLM!');
        }
        done();
      });
    }
    modelResultMap[model].totalCount += 1;
  });
};

const dataList = Object.keys(demoDataList);

const gptKey = process.env.VITE_GPT_KEY;
const gptURL = process.env.VITE_GPT_JEST_URL;
if (gptKey && gptURL) {
  const vmind = new VMind({
    url: gptURL,
    model: Model.GPT3_5,
    cache: false,
    headers: {
      'api-key': gptKey
    }
  });
  testPerformance(Model.GPT3_5, vmind);
}

//const skylarkKey = process.env.VITE_SKYLARK_KEY;
//const skylarkURL = process.env.VITE_SKYLARK_JEST_URL;

//if (skylarkKey && skylarkURL) {
//  const vmind = new VMind({
//    url: skylarkURL,
//    model: Model.SKYLARK,
//    cache: false,
//    headers: {
//      'api-key': skylarkKey
//    }
//  });
//  testPerformance(Model.SKYLARK, vmind);
//}

const skylark2Key = process.env.VITE_SKYLARK_KEY;
const skylark2URL = process.env.VITE_SKYLARK_JEST_URL;

//if (skylark2Key && skylark2URL) {
//  const vmind = new VMind({
//    url: skylark2URL,
//    model: Model.SKYLARK2,
//    cache: false,
//    showThoughts: false,
//    headers: {
//      'api-key': skylark2Key
//    }
//  });
//  testPerformance(Model.SKYLARK2, vmind);
//}

afterAll(() => {
  log('---------------VMind performance test---------------');
  Object.keys(modelResultMap).forEach(model => {
    log(`---------------${model}---------------`);

    const { successCount, totalCount, totalTime } = modelResultMap[model];
    log('success count: ' + successCount);
    log('total count: ' + totalCount);
    log('success ratio: ' + (successCount / totalCount) * 100 + '%');

    log('chart generation average time: ' + totalTime / successCount / 1000 + 's');

    log('------------------------------');
  });
});
