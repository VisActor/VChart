import { StoryFactory } from '../../../factory/factory';
import { RoleChart } from '../role';
import { LineTemp } from '../temp/templates/line';

StoryFactory.registerChartTemp(LineTemp.type, LineTemp);

export class LineChartRole extends RoleChart {
  static type = 'LineChart';
}
