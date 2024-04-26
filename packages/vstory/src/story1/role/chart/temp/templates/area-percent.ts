import { TemplateChartType } from '../constant';
import { AreaTemp } from './area';

export class AreaPercentTemp extends AreaTemp {
  static type = TemplateChartType.areaPercent;
  type = AreaPercentTemp.type;
  // 是否是百分百图表
  percent = true;

  protected _getSeriesSpec = () => {
    const spec = super._getSeriesSpec() as any;
    spec.percent = true;
    return spec;
  };
}
