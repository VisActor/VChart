import { TemplateChartType } from '../constant';
import type { DirectionType } from './../../../../typings/space';
import { BarTemp } from './bar';

export class HorizontalBarGroupTemp extends BarTemp {
  static type = TemplateChartType.horizontalBarGroup;
  type = HorizontalBarGroupTemp.type;
  multiDimensionField = true;
  direction: DirectionType = 'horizontal';
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
