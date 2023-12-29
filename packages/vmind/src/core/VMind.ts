import { _chatToVideoWasm } from '../chart-to-video';
import { generateChartWithGPT } from '../gpt/chart-generation/NLToChart';
import { ILLMOptions, TimeType, Model, SimpleFieldInfo, DataItem } from '../typings';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { parseCSVDataWithGPT } from '../gpt/dataProcess';
import { parseCSVData as parseCSVDataWithRule } from '../common/dataProcess';
import { generateChartWithSkylark } from '../skylark/chart-generation';

class VMind {
  private _FPS = 30;
  private _options: ILLMOptions | undefined;
  private _model: Model;

  constructor(options?: ILLMOptions) {
    this._options = { ...(options ?? {}) };
    this._model = options.model ?? Model.GPT3_5;
  }

  /**
   * parse csv string and get the name, type of each field using rule-based method.
   * @param csvString csv data user want to visualize
   * @returns fieldInfo and raw dataset.
   */
  parseCSVData(csvString: string): { fieldInfo: SimpleFieldInfo[]; dataset: DataItem[] } {
    //Parse CSV Data without LLM
    //return dataset and fieldInfo
    return parseCSVDataWithRule(csvString);
  }

  /**
   * call LLM to parse csv data. return fieldInfo and raw dataset.
   * fieldInfo includes name, type, role, description of each field.
   * NOTE: This will transfer your data to LLM.
   * @param csvString csv data user want to visualize
   * @param userPrompt
   * @returns
   */
  parseCSVDataWithLLM(csvString: string, userPrompt: string) {
    if ([Model.GPT3_5, Model.GPT4].includes(this._model)) {
      return parseCSVDataWithGPT(csvString, userPrompt, this._options);
    }
    console.error('Unsupported Model!');

    return undefined;
  }

  /**
   *
   * @param userPrompt user's visualization intention (what aspect they want to show in the data)
   * @param fieldInfo information about fields in the dataset. field name, type, etc. You can get fieldInfo using parseCSVData or parseCSVDataWithLLM
   * @param dataset raw dataset used in the chart
   * @param colorPalette color palette of the chart
   * @param animationDuration duration of chart animation.
   * @returns spec and time duration of the chart.
   */
  async generateChart(
    userPrompt: string, //user's intent of visualization, usually aspect in data that they want to visualize
    fieldInfo: SimpleFieldInfo[],
    dataset: DataItem[],
    colorPalette?: string[],
    animationDuration?: number
  ) {
    if ([Model.GPT3_5, Model.GPT4].includes(this._model)) {
      return generateChartWithGPT(userPrompt, fieldInfo, dataset, this._options, colorPalette, animationDuration);
    }
    if (this._model === Model.SKYLARK) {
      return generateChartWithSkylark(userPrompt, fieldInfo, dataset, this._options, colorPalette, animationDuration);
    }
    console.error('unsupported model in chart generation!');
    return { spec: undefined, time: undefined, dataSource: undefined, tokens: undefined } as any;
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
