import { _chatToVideoWasm } from '../chart-to-video';
import {
  chartAdvisorGPT,
  dataProcessGPT,
  estimateVideoTime,
  getSchemaFromFieldInfo
} from '../gpt/chart-generation/NLToChartPipe';
import {
  GPTDataProcessResult,
  IGPTOptions,
  TimeType,
  ChartGenerationProps,
  Model,
  FieldInfo,
  SimpleFieldInfo,
  DataItem
} from '../typings';
import { patchUserInput } from '../gpt/chart-generation/utils';
import { checkChartTypeAndCell, patchChartTypeAndCell, vizDataToSpec } from '../gpt/chart-generation/vizDataToSpec';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { chartAdvisorHandler } from '../gpt/chart-generation/chartAdvisorHandler';
import { dataProcessVChart, parseCSVData } from '../common/dataProcess';
import { parseCSVDataWithGPT } from '../gpt/dataProcess';

class VMind {
  private _OPENAI_KEY: string | undefined = undefined;
  private _FPS = 30;
  private _options: IGPTOptions | undefined;

  constructor(key: string, options?: IGPTOptions) {
    this.setOpenAIKey(key);
    this._options = options;
  }

  setOpenAIKey(key: string) {
    this._OPENAI_KEY = key;
  }

  parseCSVData(csvString: string): { fieldInfo: SimpleFieldInfo[]; dataset: DataItem[] } {
    //Parse CSV Data without LLM
    //return dataset and fieldInfo
    return parseCSVData(csvString);
  }

  parseDataWithGPT(csvString: string, userPrompt: string) {
    return parseCSVDataWithGPT(csvString, userPrompt, this._OPENAI_KEY, this._options);
  }

  async generateChart(
    model: Model, //models to finish data generation task
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    propsDataset: DataItem[],
    colorPalette?: string[],
    animationDuration?: number
  ) {
    if ([Model.GPT3_5, Model.GPT4].includes(model)) {
      const userInputFinal = patchUserInput(userPrompt);
      const schema = getSchemaFromFieldInfo(fieldInfo);
      const colors = colorPalette;
      let chartType;
      let cell;
      let dataset: DataItem[] = propsDataset;
      try {
        // throw 'test chartAdvisorHandler';
        const resJson: any = await chartAdvisorGPT(schema, fieldInfo, userInputFinal, this._OPENAI_KEY, this._options);

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
    } else if (model == Model.SKYLARK) {
      return {};
    }
    return {};
  }

  async exportVideo(
    spec: any,
    time: TimeType,
    VChart: any,
    ffmpeg: FFmpeg,
    fetchFile: (data: string | Buffer | Blob | File) => Promise<Uint8Array>
  ) {
    const outName = `out`;
    await _chatToVideoWasm(VChart, ffmpeg, fetchFile, this._FPS, spec, time, outName);
    const data = ffmpeg.FS('readFile', `${outName}.mp4`);
    const objUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    return objUrl;
  }

  async exportGIF(
    spec: any,
    time: TimeType,
    VChart: any,
    ffmpeg: FFmpeg,
    fetchFile: (data: string | Buffer | Blob | File) => Promise<Uint8Array>
  ) {
    const outName = `out`;
    await _chatToVideoWasm(VChart, ffmpeg, fetchFile, this._FPS, spec, time, outName);
    // 调色板
    await ffmpeg.run('-i', `${outName}.mp4`, '-filter_complex', '[0:v] palettegen', 'palette.png');
    await ffmpeg.run(
      '-i',
      `${outName}.mp4`,
      '-i',
      'palette.png',
      '-filter_complex',
      '[0:v][1:v] paletteuse',
      'out.gif'
    );
    const data = ffmpeg.FS('readFile', 'out.gif');
    const objUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    return objUrl;
  }
}

export default VMind;
