import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { PieTemp } from '../temp/templates/pie';

StoryFactory.registerChartTemp(PieTemp.type, PieTemp);

export class PieChartCharacter extends CharacterChart {
  static type = 'PieChart';
}
