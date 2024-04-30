import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { RangeColumnTemp } from '../temp/templates/rangeColumn';

StoryFactory.registerChartTemp(RangeColumnTemp.type, RangeColumnTemp);

export class RangeColumnChartCharacter extends CharacterChart {
  static type = 'RangeColumnChart';
}
