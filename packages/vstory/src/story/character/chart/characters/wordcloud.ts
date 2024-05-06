import { StoryFactory } from '../../../factory/factory';
import { CharacterChart } from '../character';
import { WordCloudTemp } from '../temp/templates/wordcloud';

StoryFactory.registerChartTemp(WordCloudTemp.type, WordCloudTemp);

export class WordCloudCharacter extends CharacterChart {
  static type = 'WordCloudChart';
}
