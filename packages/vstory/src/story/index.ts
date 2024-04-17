import { GraphicRect } from './element/graphics/graphic/rect';
import { StoryFactory } from './factory/factory';
import { ElementGraphics } from './element/graphics/element';
import { ElementChart } from './element/chart/element';
import { ContainerModule, GraphicRender, container } from '@visactor/vrender-core';
import { ChartRender, VChartRender } from './element/chart/graphic/vchart-graphic-render';

StoryFactory.registerElement('graphics', ElementGraphics);
StoryFactory.registerElement('chart', ElementChart);

StoryFactory.registerGraphic('rect', GraphicRect);

const splitModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  // chart渲染器注入
  bind(VChartRender).toSelf().inSingletonScope();
  bind(ChartRender).toService(VChartRender);
  bind(GraphicRender).toService(ChartRender);
});
container.load(splitModule);
