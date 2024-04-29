import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { AreaTemp } from '../temp/templates/area';

StoryFactory.registerChartTemp(AreaTemp.type, AreaTemp);

export class AreaChartCharacter extends CharacterChart {
  static type = 'AreaChart';
}
