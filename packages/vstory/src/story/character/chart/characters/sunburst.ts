import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { SunburstTemp } from '../temp/templates/sunburst';

StoryFactory.registerChartTemp(SunburstTemp.type, SunburstTemp);

export class SunburstChartCharacter extends CharacterChart {
  static type = 'SunburstChart';
}
