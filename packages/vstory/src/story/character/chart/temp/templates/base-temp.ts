import { IChartTemp } from '../interface';
import { DataInfo, StandardData } from '../../data/interface';
import { CharacterChart } from '../../character';

export const EDITOR_SERIES_MARK_SINGLE = '_editor_series_mark_single';
export const EDITOR_SERIES_MARK_SINGLE_LEVEL = 100;

export abstract class BaseTemp implements IChartTemp {
  type: string;
  abstract getSpec(data: StandardData, ctx: { character: CharacterChart }, opt?: any): any;
  abstract checkDataEnable(data: StandardData, info: DataInfo, opt?: any): boolean;
  clear() {
    // do nothing
  }

  getChartType() {
    return this.type;
  }

  afterInitializeChart() {
    // do nothing
  }

  standardizedSpec(spec: any, ctx: { character: CharacterChart }) {
    // do nothing
  }
}
