import { StoryFactory } from '../../../factory/factory';
import { RoleChart } from '../role';
import { ScatterTemp } from '../temp/templates/scatter';

StoryFactory.registerChartTemp(ScatterTemp.type, ScatterTemp);

export class ScatterChartRole extends RoleChart {
  static type = 'ScatterChart';
}
