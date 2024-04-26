import type { DirectionType } from '../../../../typings/space';
import { TemplateChartType } from '../constant';
import { BarTemp } from './bar';

export class HorizontalBarPercentTemp extends BarTemp {
  static type = TemplateChartType.horizontalBarPercent;
  type = HorizontalBarPercentTemp.type;
  direction: DirectionType = 'horizontal';
  // 是否是百分百图表
  percent = true;

  protected _getSeriesSpec() {
    // @ts-ignore 最新版ts已经修复
    const spec = super._getSeriesSpec() as any;
    spec.percent = true;
    return spec;
  }
}
