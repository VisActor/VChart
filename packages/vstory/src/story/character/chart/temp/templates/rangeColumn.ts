import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';
import { CharacterChart } from '../../character';

export class RangeColumnTemp extends CartesianSingleSeriesTemp {
  static type = TemplateChartType.rangeColumn;
  type = RangeColumnTemp.type;
  // 唯一系列类型
  seriesType = 'rangeColumn';
  // 是否消除维度轴的2测留白
  trimPadding = true;

  protected _getSeriesSpec() {
    return {
      type: 'rangeColumn',
      stack: false,
      direction: this.direction
    };
  }

  standardizedSpec(spec: any, ctx: { character: CharacterChart }) {
    if (spec.series) {
      spec.series.forEach((seriesSpec: any) => {
        if (seriesSpec.minField && seriesSpec.maxField) {
          if (this.direction === 'vertical') {
            if (!seriesSpec.yField) {
              seriesSpec.yField = [seriesSpec.minField, seriesSpec.maxField];
            }
          } else {
            if (!seriesSpec.xField) {
              seriesSpec.xField = [seriesSpec.minField, seriesSpec.maxField];
            }
          }
        }
      });
    }
  }
}
