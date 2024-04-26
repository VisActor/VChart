import { TemplateChartType } from '../constant';
import { BarTemp } from './bar';

export class BarPercentTemp extends BarTemp {
  static type = TemplateChartType.barPercent;
  type = BarPercentTemp.type;
  // 是否是百分百图表
  percent = true;

  protected _getSeriesSpec = () => {
    const spec = super._getSeriesSpec() as any;
    spec.percent = true;
    return spec;
  };
}
