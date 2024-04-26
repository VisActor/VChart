import type { DirectionType } from '../../../../typings/space';
import { TemplateChartType } from '../constant';
import { BarTemp } from './bar';

export class HorizontalBarTemp extends BarTemp {
  static type = TemplateChartType.horizontalBar;
  type = HorizontalBarTemp.type;
  direction: DirectionType = 'horizontal';
}
