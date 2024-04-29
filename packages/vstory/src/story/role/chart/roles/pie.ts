import { StoryFactory } from '../../../factory/factory';
import { RoleChart } from '../role';
import { PieTemp } from '../temp/templates/pie';

StoryFactory.registerChartTemp(PieTemp.type, PieTemp);

export class PieChartRole extends RoleChart {
  static type = 'PieChart';
}
