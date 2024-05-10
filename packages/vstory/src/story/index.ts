import { CharacterComponentQipao } from './character/component/characters/character-qipao';
import { CharacterComponentRect } from './character/component/characters/character-rect';
import { StoryFactory } from './factory/factory';
import { CharacterChart } from './character/chart/character';
import { ContainerModule, GraphicRender, container } from '@visactor/vrender-core';
import { CanvasPickerContribution } from '@visactor/vrender-kits';
import { ChartRender, VChartRender } from './character/chart/graphic/vchart-graphic-render';
import { BarChartCharacter } from './character/chart/characters/bar';
import { LineChartCharacter } from './character/chart/characters/line';
import { AreaChartCharacter } from './character/chart/characters/area';
import { PieChartCharacter } from './character/chart/characters/pie';
import { RoseChartCharacter } from './character/chart/characters/rose';
import { RadarChartCharacter } from './character/chart/characters/radar';
import { WordCloudCharacter } from './character/chart/characters/wordcloud';
import { TreeMapChartCharacter } from './character/chart/characters/treemap';
import { SunburstChartCharacter } from './character/chart/characters/sunburst';
import { ScatterChartCharacter } from './character/chart/characters/scatter';
import { RangeColumnChartCharacter } from './character/chart/characters/rangeColumn';
import { CharacterComponentText } from './character/component/characters/character-text';
import { CharacterComponentRichText } from './character/component/characters/character-richtext';
import { VChartPicker } from './character/chart/graphic/vchart-graphic-picker';

StoryFactory.registerCharacter(BarChartCharacter.type, BarChartCharacter);
StoryFactory.registerCharacter(LineChartCharacter.type, CharacterChart);
StoryFactory.registerCharacter(CharacterChart.type, CharacterChart);
StoryFactory.registerCharacter(AreaChartCharacter.type, AreaChartCharacter);
StoryFactory.registerCharacter(PieChartCharacter.type, PieChartCharacter);
StoryFactory.registerCharacter(RoseChartCharacter.type, RoseChartCharacter);
StoryFactory.registerCharacter(RadarChartCharacter.type, RadarChartCharacter);
StoryFactory.registerCharacter(WordCloudCharacter.type, WordCloudCharacter);
StoryFactory.registerCharacter(TreeMapChartCharacter.type, TreeMapChartCharacter);
StoryFactory.registerCharacter(SunburstChartCharacter.type, SunburstChartCharacter);
StoryFactory.registerCharacter(ScatterChartCharacter.type, ScatterChartCharacter);
StoryFactory.registerCharacter(RangeColumnChartCharacter.type, RangeColumnChartCharacter);

// StoryFactory.registerCharacter('BarChart', CharacterChart);
// StoryFactory.registerCharacter('CharacterChart', CharacterChart);
// StoryFactory.registerCharacter('LineChart', CharacterChart);
StoryFactory.registerCharacter('RectComponent', CharacterComponentRect);
StoryFactory.registerCharacter('TextComponent', CharacterComponentText);
StoryFactory.registerCharacter('RichTextComponent', CharacterComponentRichText);

StoryFactory.registerCharacter('QipaoComponent', CharacterComponentQipao);

const splitModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  // chart渲染器注入
  bind(VChartRender).toSelf().inSingletonScope();
  bind(ChartRender).toService(VChartRender);
  bind(GraphicRender).toService(ChartRender);
  bind(VChartPicker).to(VChartPicker).inSingletonScope();
  bind(CanvasPickerContribution).toService(VChartPicker);
});
container.load(splitModule);
