import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';
import { getSeriesLabelSpec } from './common';

export class LineTemp extends CartesianSingleSeriesTemp {
  static type = TemplateChartType.line;
  type = LineTemp.type;
  // 唯一系列类型
  seriesType = 'line';
  stack = false;
  // 是否消除维度轴的2测留白
  trimPadding = true;

  protected _getSeriesSpec() {
    return {
      direction: this.direction,
      type: 'line',
      stack: false,
      line: {
        style: {
          lineCap: 'butt'
        }
      },
      label: {
        visible: true,
        position: 'top',
        style: {
          lineHeight: '100%',
          fontSize: 16,
          fontWeight: 'bold'
        },
        overlap: true,
        smartInvert: true
      },
      seriesLabel: getSeriesLabelSpec(this.direction)
    };
  }
}
