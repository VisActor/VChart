import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { TreeMapTemp } from '../temp/templates/treemap';

StoryFactory.registerChartTemp(TreeMapTemp.type, TreeMapTemp);

export class TreeMapChartCharacter extends CharacterChart {
  static type = 'TreeMapChart';
}
