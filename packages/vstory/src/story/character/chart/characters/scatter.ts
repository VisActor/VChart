import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { ScatterTemp } from '../temp/templates/scatter';

StoryFactory.registerChartTemp(ScatterTemp.type, ScatterTemp);

export class ScatterChartCharacter extends CharacterChart {
  static type = 'ScatterChart';
}
