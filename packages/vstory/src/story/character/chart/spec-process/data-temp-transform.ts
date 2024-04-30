import type { IChartDataTempTransform } from './interface';
import { DataTempTransformBase } from '../../visactor/data-temp-transform-base';
import { IChartTemp } from '../temp/interface';

export class ChartDataTempTransform extends DataTempTransformBase implements IChartDataTempTransform {
  protected declare _specTemp: IChartTemp;
  get specTemp() {
    return this._specTemp;
  }

  protected declare _nextTemp: IChartTemp;
  get nextTemp() {
    return this._nextTemp;
  }
}
