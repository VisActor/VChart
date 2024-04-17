import { IDataParserConstructor } from '../element/visactor/interface';
import { IGraphicConstructor } from '../element/graphics/graphic/graphic';
import { IElementConstructor, IElementInitOption } from '../element/runtime-interface';
import { IElementSpec } from './../element/dsl-interface';
import { IChartTempConstructor } from '../element/chart/temp/interface';

export class StoryFactory {
  static elementMap: { [key: string]: IElementConstructor } = {};
  static registerElement(type: string, c: IElementConstructor) {
    StoryFactory.elementMap[type] = c;
  }
  static createElement(spec: IElementSpec, opt: IElementInitOption) {
    const classC = StoryFactory.elementMap[spec.type];
    if (!classC) {
      return null;
    }
    const el = new classC(spec, opt);
    el.init();
    return el;
  }

  static graphicMap: { [key: string]: IGraphicConstructor } = {};
  static registerGraphic(type: string, c: IGraphicConstructor) {
    StoryFactory.graphicMap[type] = c;
  }
  static createGraphic(type: string, opt: any) {
    const classC = StoryFactory.graphicMap[type];
    if (!classC) {
      return null;
    }
    return new classC(type, opt);
  }

  static dataParserMap: { [key: string]: IDataParserConstructor } = {};
  static registerDataParser(type: string, c: IDataParserConstructor) {
    StoryFactory.dataParserMap[type] = c;
  }
  static createDataParser(type: string, opt: any) {
    const classC = StoryFactory.dataParserMap[type];
    if (!classC) {
      return null;
    }
    return new classC(type, opt);
  }

  static chartTempMap: { [key: string]: IChartTempConstructor } = {};
  static registerChartTemp(type: string, c: IChartTempConstructor) {
    StoryFactory.chartTempMap[type] = c;
  }
  static createChartTemp(type: string) {
    const classC = StoryFactory.chartTempMap[type];
    if (!classC) {
      return null;
    }
    return new classC();
  }
}
