import { CharacterComponentQipao } from './character/component/characters/role-qipao';
import { CharacterComponentRect } from './character/component/characters/role-rect';
import { StoryFactory } from './factory/factory';
import { CharacterChart } from './character/chart/character';
import { ContainerModule, GraphicRender, container } from '@visactor/vrender-core';
import { ChartRender, VChartRender } from './character/chart/graphic/vchart-graphic-render';
import { BarChartCharacter } from './character/chart/characters/bar';
import { LineChartCharacter } from './character/chart/characters/line';
import { AreaChartCharacter } from './character/chart/characters/area';
import { PieChartCharacter } from './character/chart/characters/pie';
import { ScatterChartCharacter } from './character/chart/characters/scatter';
import { RangeColumnChartCharacter } from './character/chart/characters/rangeColumn';
import { CharacterComponentText } from './character/component/characters/role-text';

StoryFactory.registerCharacter(BarChartCharacter.type, BarChartCharacter);
StoryFactory.registerCharacter(LineChartCharacter.type, CharacterChart);
StoryFactory.registerCharacter(CharacterChart.type, CharacterChart);
StoryFactory.registerCharacter(AreaChartCharacter.type, AreaChartCharacter);
StoryFactory.registerCharacter(PieChartCharacter.type, PieChartCharacter);
StoryFactory.registerCharacter(ScatterChartCharacter.type, ScatterChartCharacter);
StoryFactory.registerCharacter(RangeColumnChartCharacter.type, RangeColumnChartCharacter);

// StoryFactory.registerCharacter('BarChart', CharacterChart);
// StoryFactory.registerCharacter('CharacterChart', CharacterChart);
// StoryFactory.registerCharacter('LineChart', CharacterChart);
StoryFactory.registerCharacter('RectComponent', CharacterComponentRect);
StoryFactory.registerCharacter('TextComponent', CharacterComponentText);

StoryFactory.registerCharacter('QipaoComponent', CharacterComponentQipao);

const splitModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  // chart渲染器注入
  bind(VChartRender).toSelf().inSingletonScope();
  bind(ChartRender).toService(VChartRender);
  bind(GraphicRender).toService(ChartRender);
});
container.load(splitModule);
