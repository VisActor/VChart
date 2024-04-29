import { IDataParserConstructor } from '../character/visactor/interface';
import { IGraphicConstructor } from '../character/component/graphic/graphic';
import { ICharacterConstructor, ICharacterInitOption } from '../character/runtime-interface';
import { ICharacterSpec } from '../character/dsl-interface';
import { IChartTempConstructor } from '../character/chart/temp/interface';

export class StoryFactory {
  static characterMap: { [key: string]: ICharacterConstructor } = {};
  static registerCharacter(type: string, c: ICharacterConstructor) {
    StoryFactory.characterMap[type] = c;
  }
  static createCharacter(spec: ICharacterSpec, opt: ICharacterInitOption) {
    const classC = StoryFactory.characterMap[spec.type];
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
