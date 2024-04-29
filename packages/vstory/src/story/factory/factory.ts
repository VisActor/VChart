import { IDataParserConstructor } from '../role/visactor/interface';
import { IGraphicConstructor } from '../role/component/graphic/graphic';
import { IRoleConstructor, IRoleInitOption } from '../role/runtime-interface';
import { IRoleSpec } from '../role/dsl-interface';
import { IChartTempConstructor } from '../role/chart/temp/interface';

export class StoryFactory {
  static roleMap: { [key: string]: IRoleConstructor } = {};
  static registerRole(type: string, c: IRoleConstructor) {
    StoryFactory.roleMap[type] = c;
  }
  static createRole(spec: IRoleSpec, opt: IRoleInitOption) {
    const classC = StoryFactory.roleMap[spec.type];
    if (!classC) {
      console.error('获取模板失败', spec);
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
  static createChartTemp(type: string, opt: any) {
    const classC = StoryFactory.chartTempMap[type];
    if (!classC) {
      return null;
    }
    return new classC(opt);
  }
}
