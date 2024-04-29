import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';

export class AreaTemp extends CartesianSingleSeriesTemp {
  static type = TemplateChartType.area;
  type = AreaTemp.type;
  // 唯一系列类型
  seriesType = 'area';
  // 是否消除维度轴的2测留白
  trimPadding = true;

  protected _getSeriesSpec() {
    return {
      type: 'area',
      stack: true,
      direction: this.direction,
      line: {
        style: {
          lineCap: 'butt'
        }
      }
    };
  }
}
