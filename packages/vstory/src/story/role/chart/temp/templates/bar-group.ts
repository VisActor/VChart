import { TemplateChartType } from '../constant';
import { BarTemp } from './bar';

export class BarGroupTemp extends BarTemp {
  static type = TemplateChartType.barGroup;
  type = BarGroupTemp.type;
  multiDimensionField = true;
  // 默认是否展示总计标签
  defaultTotalLabel = false;
  // 是否默认展示图例
  defaultLegendVisible = true;

  protected _getSeriesSpec = () => {
    const spec = super._getSeriesSpec() as any;
    delete spec.seriesLabel;
    return spec;
  };
}
