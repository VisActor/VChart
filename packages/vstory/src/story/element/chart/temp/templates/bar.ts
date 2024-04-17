import { TemplateChartType } from '../constant';
import { CartesianSingleSeriesTemp } from './cartesian-single';
import { getSeriesLabelSpec, getTotalLabelSpec } from './common';

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
      direction: this.direction,
      bar: {
        style: {
          stroke: '',
          lineWidth: 1
        },
        state: {
          hover: {
            stroke: '#000',
            lineWidth: 1
          }
        }
      },
      barBackground: {
        style: {
          stroke: '',
          lineWidth: 1
        }
      },
      label: {
        visible: true,
        position: 'inside',
        style: {
          lineHeight: '100%',
          fontSize: 16,
          fontWeight: 'bold'
        },
        overlap: {
          strategy: [] as any[]
        },
        smartInvert: true
      },
      totalLabel: getTotalLabelSpec(this.defaultTotalLabel),
      seriesLabel: getSeriesLabelSpec(this.direction)
    };
  }
}
