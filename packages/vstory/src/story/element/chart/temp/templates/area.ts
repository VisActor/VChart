import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';
import { getSeriesLabelSpec, getTotalLabelSpec } from './common';

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
      },
      label: {
        visible: true,
        position: 'bottom',
        style: {
          lineHeight: '100%',
          fontSize: 16,
          fontWeight: 'bold'
        },
        overlap: true,
        smartInvert: true
      },
      totalLabel: getTotalLabelSpec(false),
      seriesLabel: getSeriesLabelSpec(this.direction)
    };
  }
}
