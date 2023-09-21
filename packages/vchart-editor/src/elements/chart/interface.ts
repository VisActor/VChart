import type { IElementOption } from './../interface';
import type { IParserValue } from './data/interface';
export interface IChartElementOption extends IElementOption {
  dataSource?: { type: string; value: IParserValue };
  temp?: string;
  renderCanvas: HTMLCanvasElement;
}
