import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';

export class ScatterTemp extends CartesianSingleSeriesTemp {
  static type = TemplateChartType.scatter;
  type = ScatterTemp.type;
  // 唯一系列类型
  seriesType = 'scatter';
  // 是否消除维度轴的2测留白
  trimPadding = true;

  protected _getSeriesSpec() {
    return {
      type: 'scatter',
      stack: false,
      direction: this.direction
    };
  }
}
