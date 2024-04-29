import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { BarTemp } from '../temp/templates/bar';

StoryFactory.registerChartTemp(BarTemp.type, BarTemp);

export class BarChartCharacter extends CharacterChart {
  static type = 'BarChart';
}
