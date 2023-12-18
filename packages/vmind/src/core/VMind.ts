import { _chatToVideoWasm } from '../chart-to-video';
import { generateChartWithGPT } from '../gpt/chart-generation/NLToChart';
import { IGPTOptions, TimeType, Model, SimpleFieldInfo, DataItem } from '../typings';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { parseCSVDataWithGPT } from '../gpt/dataProcess';
import { parseCSVData as parseCSVDataWithRule } from '../common/dataProcess';

class VMind {
  private _FPS = 30;
  private _options: IGPTOptions | undefined;
  private _model: Model;

  constructor(options?: IGPTOptions) {
    this._options = options;
    this._model = options.model;
  }

  parseCSVData(csvString: string): { fieldInfo: SimpleFieldInfo[]; dataset: DataItem[] } {
    //Parse CSV Data without LLM
    //return dataset and fieldInfo
    return parseCSVDataWithRule(csvString);
  }

  parseCSVDataWithLLM(csvString: string, userPrompt: string) {
    if ([Model.GPT3_5, Model.GPT4].includes(this._model)) {
      return parseCSVDataWithGPT(csvString, userPrompt, this._options);
    }
    console.error('Unsupported Model!');
  }

  async generateChart(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset: DataItem[],
    colorPalette?: string[],
    animationDuration?: number
  ) {
    if ([Model.GPT3_5, Model.GPT4].includes(this._model)) {
      return generateChartWithGPT(userPrompt, fieldInfo, dataset, this._options, colorPalette, animationDuration);
    } else if (this._model == Model.SKYLARK) {
      return {};
    }
    if (this._model === Model.SKYLARK) {
      return generateChartWithSkylark(userPrompt, fieldInfo);
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
