import { StoryFactory } from '../../../factory/factory';
import { RoleChart } from '../role';
import { RangeColumnTemp } from '../temp/templates/rangeColumn';

StoryFactory.registerChartTemp(RangeColumnTemp.type, RangeColumnTemp);

export class RangeColumnChartRole extends RoleChart {
  static type = 'RangeColumnChart';
}
