import { _chatToVideoWasm } from '../chart-to-video';
import {
  chartAdvisorGPT,
  dataProcessVChart,
  dataProcessGPT,
  estimateVideoTime
} from '../chart-generation/NLToChartPipe';
import { SUPPORTED_CHART_LIST } from '../chart-generation/constants';
import { GPTDataProcessResult } from '../chart-generation/type';
import { patchUserInput } from '../chart-generation/utils';
import { vizDataToSpec } from '../chart-generation/vizDataToSpec';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { TimeType } from '../chart-to-video/type';

class VMind {
  private _OPENAI_KEY: string | undefined = undefined;
  private _FPS = 30;

  constructor(key: string) {
    this.setOpenAIKey(key);
  }

  setOpenAIKey(key: string) {
    this._OPENAI_KEY = key;
  }

  // Load ffmpeg outside of vmind.
  // async initFFMPEG() {
  //   this._FFMPEG = createFFmpeg({ log: true });
  //   await this.loadFFmpeg();
  // }
  // async loadFFmpeg() {
  //   if (!this._FFMPEG) {
  //     this._FFMPEG = createFFmpeg({ log: true });
  //   }
  //   await this._FFMPEG.load();
  //   this._FFMPEG_Loaded = true;
  // }

  async generateChart(csvFile: string, userInput: string) {
    const dataView = dataProcessVChart(csvFile);
    const userInputFinal = patchUserInput(userInput);
    //if (!this._OPENAI_KEY) {
    //  throw Error('OpenAI Key Unset!')
    //}

    const dataProcessResJson: GPTDataProcessResult = await dataProcessGPT(csvFile, userInputFinal, this._OPENAI_KEY);
    const resJson: any = await chartAdvisorGPT(dataProcessResJson, userInput, this._OPENAI_KEY);
    if (resJson.error) {
      throw Error('Network Error!');
    }
    if (!SUPPORTED_CHART_LIST.includes(resJson['CHART_TYPE'])) {
      throw Error('Unsupported Chart Type. Please Change User Input');
      //return {
      //  spec: undefined,
      //  time: {
      //    totalTime: DEFAULT_VIDEO_LENGTH,
      //    frameArr: [],
      //  }
      //}
    }
    console.log(resJson);
    const chartType = resJson['CHART_TYPE'].toUpperCase();
    const cell = resJson['FIELD_MAP'];
    const colors = resJson['COLOR_PALETTE'];
    const parsedTime = resJson['VIDEO_DURATION'];
    const { spec, chartTypeNew } = vizDataToSpec(
      dataView,
      chartType,
      cell,
      colors,
      parsedTime ? parsedTime * 1000 : undefined
    );
    spec.background = '#00000033';
    console.log(spec);
    return {
      spec,
      time: estimateVideoTime(chartTypeNew, spec, parsedTime ? parsedTime * 1000 : undefined)
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
