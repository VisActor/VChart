import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';

export class BarTemp extends CartesianSingleSeriesTemp {
  static type = TemplateChartType.bar;
  type = BarTemp.type;
  // 唯一系列类型
  seriesType = 'bar';
  // 默认是否展示总计标签
  defaultTotalLabel = true;

  protected _getSeriesSpec() {
    return {
      type: 'bar',
      stack: true,
      direction: this.direction
    };
  }

  afterInitializeChart(): void {
    console.log('afterInitializeChart');
  }
}
