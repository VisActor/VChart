import { RoleComponentQipao } from './role/component/roles/role-qipao';
import { RoleComponentRect } from './role/component/roles/role-rect';
import { PieTemp } from './role/chart/temp/templates/pie';
import { AreaPercentTemp } from './role/chart/temp/templates/area-percent';
import { AreaTemp } from './role/chart/temp/templates/area';
import { HorizontalBarPercentTemp } from './role/chart/temp/templates/horizontal-bar-percent';
import { HorizontalBarGroupTemp } from './role/chart/temp/templates/horizontal-bar-group';
import { HorizontalBarTemp } from './role/chart/temp/templates/horizontal-bar';
import { BarPercentTemp } from './role/chart/temp/templates/bar-percent';
import { BarGroupTemp } from './role/chart/temp/templates/bar-group';
import { LineTemp } from './role/chart/temp/templates/line';
import { BarTemp } from './role/chart/temp/templates/bar';
import { StoryFactory } from './factory/factory';
import { RoleChart } from './role/chart/role';
import { ContainerModule, GraphicRender, container } from '@visactor/vrender-core';
import { ChartRender, VChartRender } from './role/chart/graphic/vchart-graphic-render';
import { StandardParser } from './role/chart/data/parser/standard';
import { RoleComponentText } from './role/component/roles/role-text';

StoryFactory.registerRole('BarChart', RoleChart);
// StoryFactory.registerRole('LineChart', RoleChart);
StoryFactory.registerRole('RectComponent', RoleComponentRect);
StoryFactory.registerRole('TextComponent', RoleComponentText);

StoryFactory.registerRole('QipaoComponent', RoleComponentQipao);

StoryFactory.registerDataParser('standard', StandardParser);

StoryFactory.registerChartTemp(BarTemp.type, BarTemp);
StoryFactory.registerChartTemp(LineTemp.type, LineTemp);
StoryFactory.registerChartTemp(BarTemp.type, BarTemp);
StoryFactory.registerChartTemp(BarGroupTemp.type, BarGroupTemp);
StoryFactory.registerChartTemp(BarPercentTemp.type, BarPercentTemp);
StoryFactory.registerChartTemp(HorizontalBarTemp.type, HorizontalBarTemp);
StoryFactory.registerChartTemp(HorizontalBarGroupTemp.type, HorizontalBarGroupTemp);
StoryFactory.registerChartTemp(HorizontalBarPercentTemp.type, HorizontalBarPercentTemp);
StoryFactory.registerChartTemp(AreaTemp.type, AreaTemp);
StoryFactory.registerChartTemp(AreaPercentTemp.type, AreaPercentTemp);
StoryFactory.registerChartTemp(LineTemp.type, LineTemp);
StoryFactory.registerChartTemp(PieTemp.type, PieTemp);

const splitModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  // chart渲染器注入
  bind(VChartRender).toSelf().inSingletonScope();
  bind(ChartRender).toService(VChartRender);
  bind(GraphicRender).toService(ChartRender);
});
container.load(splitModule);
