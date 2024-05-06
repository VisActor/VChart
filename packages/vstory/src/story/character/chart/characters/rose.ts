import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { RoseTemp } from '../temp/templates/rose';

StoryFactory.registerChartTemp(RoseTemp.type, RoseTemp);

export class RoseChartCharacter extends CharacterChart {
  static type = 'RoseChart';
}
