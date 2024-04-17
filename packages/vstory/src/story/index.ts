import { PieTemp } from './element/chart/temp/templates/pie';
import { AreaPercentTemp } from './element/chart/temp/templates/area-percent';
import { AreaTemp } from './element/chart/temp/templates/area';
import { HorizontalBarPercentTemp } from './element/chart/temp/templates/horizontal-bar-percent';
import { HorizontalBarGroupTemp } from './element/chart/temp/templates/horizontal-bar-group';
import { HorizontalBarTemp } from './element/chart/temp/templates/horizontal-bar';
import { BarPercentTemp } from './element/chart/temp/templates/bar-percent';
import { BarGroupTemp } from './element/chart/temp/templates/bar-group';
import { LineTemp } from './element/chart/temp/templates/line';
import { BarTemp } from './element/chart/temp/templates/bar';
import { GraphicRect } from './element/graphics/graphic/rect';
import { StoryFactory } from './factory/factory';
import { ElementGraphics } from './element/graphics/element';
import { ElementChart } from './element/chart/element';
import { ContainerModule, GraphicRender, container } from '@visactor/vrender-core';
import { ChartRender, VChartRender } from './element/chart/graphic/vchart-graphic-render';
import { StandardParser } from './element/chart/data/parser/standard';

// @ts-ignore
StoryFactory.registerElement('chart', ElementChart);
StoryFactory.registerElement('graphics', ElementGraphics);

StoryFactory.registerGraphic('rect', GraphicRect);

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
