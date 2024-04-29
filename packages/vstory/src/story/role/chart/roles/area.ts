import { StoryFactory } from '../../../factory/factory';
import { RoleChart } from '../role';
import { AreaTemp } from '../temp/templates/area';

StoryFactory.registerChartTemp(AreaTemp.type, AreaTemp);

export class AreaChartRole extends RoleChart {
  static type = 'AreaChart';
}
