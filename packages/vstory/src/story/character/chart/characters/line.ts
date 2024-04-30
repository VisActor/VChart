import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { LineTemp } from '../temp/templates/line';

StoryFactory.registerChartTemp(LineTemp.type, LineTemp);

export class LineChartCharacter extends CharacterChart {
  static type = 'LineChart';
}
