import { _chatToVideoWasm } from '../chart-to-video';
import {
  chartAdvisorGPT,
  dataProcessVChart,
  dataProcessGPT,
  estimateVideoTime,
  getSchemaFromFieldInfo
} from '../gpt/chart-generation/NLToChartPipe';
import { GPTDataProcessResult, IGPTOptions, TimeType } from '../typings';
import { patchUserInput } from '../gpt/chart-generation/utils';
import { checkChartTypeAndCell, patchChartTypeAndCell, vizDataToSpec } from '../gpt/chart-generation/vizDataToSpec';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { chartAdvisorHandler } from '../gpt/chart-generation/chartAdvisorHandler';

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

  async generateChart(csvFile: string, userInput: string) {
    const dataView = dataProcessVChart(csvFile);
    const userInputFinal = patchUserInput(userInput);

    const dataProcessResJson: GPTDataProcessResult = await dataProcessGPT(
      csvFile,
      userInputFinal,
      this._OPENAI_KEY,
      this._options
    );
    const schema = getSchemaFromFieldInfo(dataProcessResJson);

    const colors = dataProcessResJson.COLOR_PALETTE;
    const parsedTime = dataProcessResJson.VIDEO_DURATION;
    let chartType;
    let cell;
    let dataset = dataView.latestData;
    try {
      // throw 'test chartAdvisorHandler';
      const resJson: any = await chartAdvisorGPT(
        schema,
        dataProcessResJson,
        userInput,
        this._OPENAI_KEY,
        this._options
      );

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
      dataset = advisorResult.dataset;
    }
    const spec = vizDataToSpec(dataset, chartType, cell, colors, parsedTime ? parsedTime * 1000 : undefined);
    spec.background = '#00000033';
    console.info(spec);
    return {
      spec,
      time: estimateVideoTime(chartType, spec, parsedTime ? parsedTime * 1000 : undefined)
    };
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
