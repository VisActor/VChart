import { StoryFactory } from '../../../factory/factory';
import { RoleChart } from '../role';
import { BarTemp } from '../temp/templates/bar';

StoryFactory.registerChartTemp(BarTemp.type, BarTemp);

export class BarChartRole extends RoleChart {
  static type = 'BarChart';
}
