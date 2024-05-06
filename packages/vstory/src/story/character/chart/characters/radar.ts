import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { RadarTemp } from '../temp/templates/radar';

StoryFactory.registerChartTemp(RadarTemp.type, RadarTemp);

export class RadarChartCharacter extends CharacterChart {
  static type = 'RadarChart';
}
