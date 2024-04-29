import { RoleComponentQipao } from './role/component/roles/role-qipao';
import { RoleComponentRect } from './role/component/roles/role-rect';
import { StoryFactory } from './factory/factory';
import { RoleChart } from './role/chart/role';
import { ContainerModule, GraphicRender, container } from '@visactor/vrender-core';
import { ChartRender, VChartRender } from './role/chart/graphic/vchart-graphic-render';
import { BarChartRole } from './role/chart/roles/bar';
import { LineChartRole } from './role/chart/roles/line';
import { AreaChartRole } from './role/chart/roles/area';
import { PieChartRole } from './role/chart/roles/pie';
import { ScatterChartRole } from './role/chart/roles/scatter';
import { RangeColumnChartRole } from './role/chart/roles/rangeColumn';
import { RoleComponentText } from './role/component/roles/role-text';
import { RoleComponentRichText } from './role/component/roles/role-richtext';

StoryFactory.registerRole(BarChartRole.type, BarChartRole);
StoryFactory.registerRole(LineChartRole.type, RoleChart);
StoryFactory.registerRole(RoleChart.type, RoleChart);
StoryFactory.registerRole(AreaChartRole.type, AreaChartRole);
StoryFactory.registerRole(PieChartRole.type, PieChartRole);
StoryFactory.registerRole(ScatterChartRole.type, ScatterChartRole);
StoryFactory.registerRole(RangeColumnChartRole.type, RangeColumnChartRole);

// StoryFactory.registerRole('BarChart', RoleChart);
// StoryFactory.registerRole('RoleChart', RoleChart);
// StoryFactory.registerRole('LineChart', RoleChart);
StoryFactory.registerRole('RectComponent', RoleComponentRect);
StoryFactory.registerRole('TextComponent', RoleComponentText);
StoryFactory.registerRole('RichTextComponent', RoleComponentRichText);

StoryFactory.registerRole('QipaoComponent', RoleComponentQipao);

const splitModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  // chart渲染器注入
  bind(VChartRender).toSelf().inSingletonScope();
  bind(ChartRender).toService(VChartRender);
  bind(GraphicRender).toService(ChartRender);
});
container.load(splitModule);
